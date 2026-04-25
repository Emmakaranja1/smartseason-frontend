import httpClient from '../httpClient';

export type FieldStage = 'PLANTED' | 'GROWING' | 'READY' | 'HARVESTED';

export interface Field {
  id: number;
  name: string;
  cropType: string;
  plantingDate: string;
  currentStage: FieldStage;
  assignedAgentId?: number;
  createdAt: string;
  status: 'ACTIVE' | 'AT_RISK' | 'COMPLETED';
  assignedAgent?: {
    id: number;
    name: string;
    email: string;
  };
}

export interface CreateFieldRequest {
  name: string;
  cropType: string;
  plantingDate: string;
  currentStage: FieldStage;
  assignedAgentId?: number;
}

export interface UpdateFieldRequest {
  name: string;
  cropType: string;
  plantingDate: string;
  currentStage: FieldStage;
  assignedAgentId?: number;
}

export const createField = async (fieldData: CreateFieldRequest): Promise<Field> => {
  const response = await httpClient.post('/fields', fieldData);
  return response.data;
};

export const getFields = async (): Promise<Field[]> => {
  const response = await httpClient.get('/fields');
  return response.data;
};

export const getFieldById = async (id: number): Promise<Field> => {
  const response = await httpClient.get(`/fields/${id}`);
  return response.data;
};

export const updateField = async (id: number, fieldData: UpdateFieldRequest): Promise<Field> => {
  const response = await httpClient.put(`/fields/${id}`, fieldData);
  return response.data;
};

export const deleteField = async (id: number): Promise<{ message: string }> => {
  const response = await httpClient.delete(`/fields/${id}`);
  return response.data;
};
