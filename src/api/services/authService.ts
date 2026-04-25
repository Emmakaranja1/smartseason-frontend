import httpClient from '../httpClient';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface User {
  id: number;
  name: string;
  email: string;
  role: 'ADMIN' | 'FIELD_AGENT';
}

export interface LoginResponse {
  user: User;
  token: string;
}

export const login = async (credentials: LoginRequest): Promise<LoginResponse> => {
  const response = await httpClient.post('/auth/login', credentials);
  return response.data;
};

export const logout = async (): Promise<{ message: string }> => {
  const response = await httpClient.post('/auth/logout');
  return response.data;
};

export const getCurrentUser = async (): Promise<{ user: User }> => {
  const response = await httpClient.get('/auth/me');
  return response.data;
};
