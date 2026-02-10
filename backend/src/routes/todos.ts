import { Router, Response } from 'express';
import { authenticateToken } from '../middleware/auth';
import { validateBody, createTodoSchema, updateTodoSchema } from '../middleware/validation';
import { AuthRequest, CreateTodoInput, UpdateTodoInput } from '../types';
import { todoService } from '../services/todo-service';

const router = Router();

// All routes require authentication
router.use(authenticateToken);

// Get all todos
router.get('/', async (req: AuthRequest, res: Response, next) => {
  try {
    const { status, dueBefore, priority } = req.query;

    const todos = await todoService.getTodos(req.user!.id, {
      status: typeof status === 'string' ? status as any : undefined,
      dueBefore: typeof dueBefore === 'string' ? dueBefore : undefined,
      priority: typeof priority === 'string' ? priority as any : undefined,
    });

    res.json({
      success: true,
      data: todos,
    });
  } catch (error) {
    next(error);
  }
});

// Create todo
router.post(
  '/',
  validateBody(createTodoSchema),
  async (req: AuthRequest, res: Response, next) => {
    try {
      const input = req.body as CreateTodoInput;
      const todo = await todoService.createTodo(req.user!.id, input);

      res.status(201).json({
        success: true,
        data: todo,
      });
    } catch (error) {
      next(error);
    }
  }
);

// Update todo
router.patch(
  '/:id',
  validateBody(updateTodoSchema),
  async (req: AuthRequest, res: Response, next) => {
    try {
      const id = req.params.id as string;
      const input = req.body as UpdateTodoInput;
      const todo = await todoService.updateTodo(req.user!.id, id, input);

      res.json({
        success: true,
        data: todo,
      });
    } catch (error) {
      next(error);
    }
  }
);

// Delete todo
router.delete('/:id', async (req: AuthRequest, res: Response, next) => {
  try {
    const id = req.params.id as string;
    await todoService.deleteTodo(req.user!.id, id);

    res.json({
      success: true,
      message: 'Todo deleted successfully',
    });
  } catch (error) {
    next(error);
  }
});

export default router;
