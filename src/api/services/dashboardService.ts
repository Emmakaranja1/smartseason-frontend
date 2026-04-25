import httpClient from '../httpClient';

export interface AdminDashboardData {
  totalFields: number;
  activeFields: number;
  atRiskFields: number;
  completedFields: number;
  fieldsPerAgent: Array<{
    agentId: number;
    count: number;
  }>;
  agentActivity: Array<{
    agentId: number;
    updates: number;
  }>;
}

export interface AgentDashboardData {
  assignedFields: Array<{
    id: number;
    name: string;
    cropType: string;
    plantingDate: string;
    currentStage: string;
    assignedAgentId?: number;
    createdAt: string;
    status: 'ACTIVE' | 'AT_RISK' | 'COMPLETED';
    assignedAgent?: {
      id: number;
      name: string;
      email: string;
    };
  }>;
  statusBreakdown: {
    active: number;
    atRisk: number;
    completed: number;
  };
  atRiskFields: Array<{
    id: number;
    name: string;
    cropType: string;
    plantingDate: string;
    currentStage: string;
    assignedAgentId?: number;
    createdAt: string;
    status: 'ACTIVE' | 'AT_RISK' | 'COMPLETED';
    assignedAgent?: {
      id: number;
      name: string;
      email: string;
    };
  }>;
  recentUpdates: Array<{
    id: number;
    fieldId: number;
    agentId: number;
    stage: string;
    notes: string;
    createdAt: string;
  }>;
}

export const getAdminDashboard = async (): Promise<AdminDashboardData> => {
  const response = await httpClient.get('/dashboard/admin');
  return response.data;
};

export const getAgentDashboard = async (): Promise<AgentDashboardData> => {
  const response = await httpClient.get('/dashboard/agent');
  return response.data;
};
