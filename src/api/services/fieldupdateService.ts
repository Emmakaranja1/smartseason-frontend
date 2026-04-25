import httpClient from '../httpClient';

export type FieldStage = 'PLANTED' | 'GROWING' | 'READY' | 'HARVESTED';

export interface FieldUpdate {
  id: number;
  fieldId: number;
  agentId: number;
  stage: FieldStage;
  notes: string;
  createdAt: string;
  agent?: {
    id: number;
    name: string;
    email: string;
  };
  field?: {
    id: number;
    name: string;
    currentStage: FieldStage;
  };
}

export interface CreateFieldUpdateRequest {
  stage: FieldStage;
  notes: string;
}

export const createFieldUpdate = async (fieldId: number, updateData: CreateFieldUpdateRequest): Promise<FieldUpdate> => {
  const response = await httpClient.post(`/fields/${fieldId}/updates`, updateData);
  return response.data;
};

export const getFieldUpdates = async (fieldId: number): Promise<FieldUpdate[]> => {
  const response = await httpClient.get(`/fields/${fieldId}/updates`);
  return response.data;
};
