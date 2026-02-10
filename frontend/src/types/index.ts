export interface User {
  id: string;
  email: string;
  createdAt?: string;
}

export interface Todo {
  id: string;
  userId: string;
  title: string;
  description?: string;
  status: 'PENDING' | 'COMPLETED';
  dueDate?: string;
  priority: 'LOW' | 'MEDIUM' | 'HIGH';
  createdAt: string;
  updatedAt: string;
}

export interface ChatMessage {
  id: string;
  userId: string;
  role: 'USER' | 'ASSISTANT';
  content: string;
  createdAt: string;
}

export interface AuthResponse {
  success: boolean;
  data: {
    token: string;
    user: User;
  };
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

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

export interface ChatResponse {
  reply: string;
  intent: string;
  actionResult?: any;
  todos: Todo[];
}
