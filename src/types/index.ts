
export const UserRole = {
  ADMIN: 'ADMIN',
  FIELD_AGENT: 'FIELD_AGENT'
} as const;

export type UserRole = typeof UserRole[keyof typeof UserRole];

export const FieldStage = {
  PLANTED: 'PLANTED',
  GROWING: 'GROWING',
  READY: 'READY',
  HARVESTED: 'HARVESTED'
} as const;

export const FieldStatus = {
  ACTIVE: 'ACTIVE',
  AT_RISK: 'AT_RISK',
  COMPLETED: 'COMPLETED'
} as const;

export type FieldStage = typeof FieldStage[keyof typeof FieldStage];
export type FieldStatus = typeof FieldStatus[keyof typeof FieldStatus];

export interface User {
  id: number;
  email: string;
  role: UserRole;
  name: string;
}

export interface FieldUpdate {
  id: number;
  fieldId: number;
  stage: FieldStage;
  notes: string;
  agentId: number;
  createdAt: string;
  agent?: {
    id: number;
    name: string;
    email: string;
  };
}

export interface Field {
  id: number;
  name: string;
  cropType: string;
  plantingDate: string;
  currentStage: FieldStage;
  status: FieldStatus;
  assignedAgentId: number | null;
  assignedAgent?: {
    id: number;
    name: string;
    email: string;
  };
  createdAt: string;
}

export interface DashboardStats {
  totalFields?: number;
  activeFields?: number;
  atRiskFields?: number; 
  completedFields?: number;
  fieldsPerAgent?: { agentId: number; count: number }[];
  agentActivity?: { agentId: number; updates: number }[];
  
  
  assignedFields?: Field[];
  statusBreakdown?: {
    active: number;
    atRisk: number;
    completed: number;
  };
  atRiskFieldsList?: Field[]; 
  recentUpdates?: FieldUpdate[];
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}


export interface ApiError {
  message: string;
  status?: number;
  data?: any;
}


export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  user: User;
  token: string;
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


export interface CreateFieldUpdateRequest {
  stage: FieldStage;
  notes: string;
}


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
    status: FieldStatus;
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
    status: FieldStatus;
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

export interface ApiResponse<T = any> {
  data: T;
  message?: string;
}

export interface MessageResponse {
  message: string;
}