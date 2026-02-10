import { apiClient } from './ApiClient';
import { User } from '../types';

export class AuthService {
  private static TOKEN_KEY = 'token';
  private static USER_KEY = 'user';

  static async login(email: string, password: string): Promise<User> {
    const response = await apiClient.login(email, password);

    if (response.success && response.data) {
      this.setToken(response.data.token);
      this.setUser(response.data.user);
      return response.data.user;
    }

    throw new Error('Login failed');
  }

  static async register(email: string, password: string): Promise<User> {
    const response = await apiClient.register(email, password);

    if (response.success && response.data) {
      this.setToken(response.data.token);
      this.setUser(response.data.user);
      return response.data.user;
    }

    throw new Error('Registration failed');
  }

  static logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
    window.location.href = '/login';
  }

  static getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  static setToken(token: string): void {
    localStorage.setItem(this.TOKEN_KEY, token);
  }

  static getUser(): User | null {
    const userStr = localStorage.getItem(this.USER_KEY);
    if (!userStr) return null;

    try {
      return JSON.parse(userStr);
    } catch {
      return null;
    }
  }

  static setUser(user: User): void {
    localStorage.setItem(this.USER_KEY, JSON.stringify(user));
  }

  static isAuthenticated(): boolean {
    return !!this.getToken();
  }
}
