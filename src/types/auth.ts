// src/types/auth.ts
export interface User {
    id: string;
    email: string;
    name: string;
    role: 'admin' | 'user';
  }
  
  export interface AuthState {
    isAuthenticated: boolean;
    user: User | null;
    token: string | null;
  }