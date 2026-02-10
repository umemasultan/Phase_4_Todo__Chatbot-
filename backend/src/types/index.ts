import { Request } from 'express';

// Extend Express Request to include authenticated user
export interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
  };
}

// API Response types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// Todo types
export interface CreateTodoInput {
  title: string;
  description?: string;
  dueDate?: string;
  priority?: 'LOW' | 'MEDIUM' | 'HIGH';
}

export interface UpdateTodoInput {
  title?: string;
  description?: string;
  status?: 'PENDING' | 'COMPLETED';
  dueDate?: string;
  priority?: 'LOW' | 'MEDIUM' | 'HIGH';
}

// Chat types
export interface ChatMessageInput {
  message: string;
}

export interface ChatIntent {
  intent: 'CREATE' | 'UPDATE' | 'DELETE' | 'QUERY' | 'CHAT';
  action?: TodoAction;
  reply: string;
}

export interface TodoAction {
  type: 'create' | 'update' | 'delete' | 'query';
  todoId?: string;
  data?: CreateTodoInput | UpdateTodoInput;
  filters?: {
    status?: 'PENDING' | 'COMPLETED';
    dueBefore?: string;
    priority?: 'LOW' | 'MEDIUM' | 'HIGH';
  };
}

// Auth types
export interface RegisterInput {
  email: string;
  password: string;
}

export interface LoginInput {
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  user: {
    id: string;
    email: string;
  };
}
