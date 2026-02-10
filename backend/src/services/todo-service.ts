import { getPrismaClient } from '../db/client';
import { CreateTodoInput, UpdateTodoInput, TodoAction } from '../types';
import { logger } from '../utils/logger';

export class TodoService {
  async createTodo(userId: string, input: CreateTodoInput) {
    const prisma = getPrismaClient();

    const todo = await prisma.todo.create({
      data: {
        userId,
        title: input.title,
        description: input.description,
        dueDate: input.dueDate ? new Date(input.dueDate) : null,
        priority: input.priority || 'MEDIUM',
      },
    });

    logger.info('Todo created', { todoId: todo.id, userId });
    return todo;
  }

  async updateTodo(userId: string, todoId: string, input: UpdateTodoInput) {
    const prisma = getPrismaClient();

    // Verify ownership
    const existing = await prisma.todo.findFirst({
      where: { id: todoId, userId },
    });

    if (!existing) {
      throw new Error('Todo not found or access denied');
    }

    const todo = await prisma.todo.update({
      where: { id: todoId },
      data: {
        title: input.title,
        description: input.description,
        status: input.status,
        dueDate: input.dueDate ? new Date(input.dueDate) : undefined,
        priority: input.priority,
      },
    });

    logger.info('Todo updated', { todoId, userId });
    return todo;
  }

  async deleteTodo(userId: string, todoId: string) {
    const prisma = getPrismaClient();

    // Verify ownership
    const existing = await prisma.todo.findFirst({
      where: { id: todoId, userId },
    });

    if (!existing) {
      throw new Error('Todo not found or access denied');
    }

    await prisma.todo.delete({
      where: { id: todoId },
    });

    logger.info('Todo deleted', { todoId, userId });
  }

  async getTodos(userId: string, filters?: {
    status?: 'PENDING' | 'COMPLETED';
    dueBefore?: string;
    priority?: 'LOW' | 'MEDIUM' | 'HIGH';
  }) {
    const prisma = getPrismaClient();

    const where: any = { userId };

    if (filters?.status) {
      where.status = filters.status;
    }

    if (filters?.dueBefore) {
      where.dueDate = {
        lte: new Date(filters.dueBefore),
      };
    }

    if (filters?.priority) {
      where.priority = filters.priority;
    }

    const todos = await prisma.todo.findMany({
      where,
      orderBy: [
        { status: 'asc' }, // PENDING first
        { dueDate: 'asc' }, // Earliest due date first
        { createdAt: 'desc' }, // Newest first
      ],
    });

    return todos;
  }

  async executeAction(userId: string, action: TodoAction) {
    switch (action.type) {
      case 'create':
        if (!action.data) throw new Error('Create action requires data');
        return await this.createTodo(userId, action.data as CreateTodoInput);

      case 'update':
        if (!action.todoId || !action.data) {
          throw new Error('Update action requires todoId and data');
        }
        return await this.updateTodo(userId, action.todoId, action.data as UpdateTodoInput);

      case 'delete':
        if (!action.todoId) throw new Error('Delete action requires todoId');
        await this.deleteTodo(userId, action.todoId);
        return null;

      case 'query':
        return await this.getTodos(userId, action.filters);

      default:
        throw new Error(`Unknown action type: ${action.type}`);
    }
  }
}

export const todoService = new TodoService();
