import { create } from 'zustand';
import { getAdminDashboard, getAgentDashboard } from '../api/services/dashboardService';
import type { AdminDashboardData, AgentDashboardData } from '../api/services/dashboardService';

interface DashboardState {
  adminDashboard: AdminDashboardData | null;
  agentDashboard: AgentDashboardData | null;
  isLoading: boolean;
  error: string | null;
}

interface DashboardActions {
  fetchAdminDashboard: () => Promise<void>;
  fetchAgentDashboard: () => Promise<void>;
  clearError: () => void;
}

type DashboardStore = DashboardState & DashboardActions;

export const useDashboardStore = create<DashboardStore>((set) => ({
  adminDashboard: null,
  agentDashboard: null,
  isLoading: false,
  error: null,

  fetchAdminDashboard: async () => {
    set({ isLoading: true, error: null });
    try {
      const adminDashboard = await getAdminDashboard();
      set({ adminDashboard, isLoading: false, error: null });
    } catch (error) {
      set({
        isLoading: false,
        error: error instanceof Error ? error.message : 'Failed to fetch admin dashboard',
      });
    }
  },

  fetchAgentDashboard: async () => {
    set({ isLoading: true, error: null });
    try {
      const agentDashboard = await getAgentDashboard();
      set({ agentDashboard, isLoading: false, error: null });
    } catch (error) {
      set({
        isLoading: false,
        error: error instanceof Error ? error.message : 'Failed to fetch agent dashboard',
      });
    }
  },

  clearError: () => set({ error: null }),
}));
