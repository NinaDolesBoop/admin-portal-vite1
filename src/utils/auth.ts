// src/utils/auth.ts
import type { User } from '../types/auth';

const ADMIN_CREDENTIALS = {
  email: 'admin@admin.com',
  password: 'admin123',
};

export const authenticateUser = (email: string, password: string): User | null => {
  if (email === ADMIN_CREDENTIALS.email && password === ADMIN_CREDENTIALS.password) {
    return {
      id: 'admin-001',
      email: ADMIN_CREDENTIALS.email,
      name: 'Admin User',
      role: 'admin',
    };
  }
  return null;
};

export const getStoredAuth = (): { token: string; user: User } | null => {
  try {
    const token = localStorage.getItem('authToken');
    const userJson = localStorage.getItem('authUser');
    
    if (token && userJson) {
      const user = JSON.parse(userJson) as User;
      return { token, user };
    }
    return null;
  } catch (error) {
    console.error('Error reading auth from storage:', error);
    return null;
  }
};

export const setStoredAuth = (token: string, user: User): void => {
  localStorage.setItem('authToken', token);
  localStorage.setItem('authUser', JSON.stringify(user));
};

export const clearStoredAuth = (): void => {
  localStorage.removeItem('authToken');
  localStorage.removeItem('authUser');
};

export const isAdmin = (user: User | null): boolean => {
  return user?.role === 'admin';
};