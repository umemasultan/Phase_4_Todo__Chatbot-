import axios, { AxiosInstance, AxiosError } from 'axios';
import { AuthResponse, ApiResponse, Todo, CreateTodoInput, UpdateTodoInput, ChatResponse, ChatMessage } from '../types';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

class ApiClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: API_URL,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Add token to requests
    this.client.interceptors.request.use((config) => {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });

    // Handle errors
    this.client.interceptors.response.use(
      (response) => response,
      (error: AxiosError) => {
        if (error.response?.status === 401) {
          // Unauthorized - clear token and redirect to login
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          window.location.href = '/login';
        }
        return Promise.reject(error);
      }
    );
  }

  // Auth endpoints
  async register(email: string, password: string): Promise<AuthResponse> {
    const response = await this.client.post<AuthResponse>('/api/auth/register', {
      email,
      password,
    });
    return response.data;
  }

  async login(email: string, password: string): Promise<AuthResponse> {
    const response = await this.client.post<AuthResponse>('/api/auth/login', {
      email,
      password,
    });
    return response.data;
  }

  async getCurrentUser(): Promise<ApiResponse> {
    const response = await this.client.get('/api/auth/me');
    return response.data;
  }

  // Todo endpoints
  async getTodos(filters?: {
    status?: 'PENDING' | 'COMPLETED';
    dueBefore?: string;
    priority?: 'LOW' | 'MEDIUM' | 'HIGH';
  }): Promise<ApiResponse<Todo[]>> {
    const response = await this.client.get('/api/todos', { params: filters });
    return response.data;
  }

  async createTodo(input: CreateTodoInput): Promise<ApiResponse<Todo>> {
    const response = await this.client.post('/api/todos', input);
    return response.data;
  }

  async updateTodo(id: string, input: UpdateTodoInput): Promise<ApiResponse<Todo>> {
    const response = await this.client.patch(`/api/todos/${id}`, input);
    return response.data;
  }

  async deleteTodo(id: string): Promise<ApiResponse> {
    const response = await this.client.delete(`/api/todos/${id}`);
    return response.data;
  }

  // Chat endpoints
  async sendChatMessage(message: string): Promise<ApiResponse<ChatResponse>> {
    const response = await this.client.post('/api/chat/message', { message });
    return response.data;
  }

  async getChatHistory(limit?: number): Promise<ApiResponse<ChatMessage[]>> {
    const response = await this.client.get('/api/chat/history', {
      params: { limit },
    });
    return response.data;
  }
}

export const apiClient = new ApiClient();
