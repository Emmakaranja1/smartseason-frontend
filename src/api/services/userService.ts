import httpClient from '../httpClient';

export interface User {
  id: number;
  name: string;
  email: string;
  role: 'ADMIN' | 'FIELD_AGENT';
  createdAt: string;
}

export interface CreateUserRequest {
  name: string;
  email: string;
  password: string;
  role?: 'ADMIN' | 'FIELD_AGENT';
}

export const getUsers = async (): Promise<User[]> => {
  const response = await httpClient.get('/users');
  return response.data;
};

export const getUserById = async (id: number): Promise<User> => {
  const response = await httpClient.get(`/users/${id}`);
  return response.data;
};

export const createUser = async (userData: CreateUserRequest): Promise<User> => {
  const response = await httpClient.post('/users', userData);
  return response.data;
};

export const deleteUser = async (id: number): Promise<{ message: string }> => {
  const response = await httpClient.delete(`/users/${id}`);
  return response.data;
};
