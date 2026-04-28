import { create } from 'zustand';
import { getAdminDashboard, getAgentDashboard } from '../api/services/dashboardService';
import type { AdminDashboardData, AgentDashboardData } from '../api/services/dashboardService';

interface DashboardState {
  adminDashboard: AdminDashboardData | null;
  agentDashboard: AgentDashboardData | null;
  stats: AdminDashboardData | null;
  isLoading: boolean;
  loading: boolean;
  error: string | null;
}

interface DashboardActions {
  fetchAdminDashboard: () => Promise<void>;
  fetchAgentDashboard: () => Promise<void>;
  fetchStats: () => Promise<void>;
  clearError: () => void;
}

type DashboardStore = DashboardState & DashboardActions;

export const useDashboardStore = create<DashboardStore>((set) => ({
  adminDashboard: null,
  agentDashboard: null,
  stats: null,
  isLoading: false,
  loading: false,
  error: null,

  fetchAdminDashboard: async () => {
    set({ isLoading: true, loading: true, error: null });
    try {
      const adminDashboard = await getAdminDashboard();
      set({ adminDashboard, stats: adminDashboard, isLoading: false, loading: false, error: null });
    } catch (error) {
      set({
        isLoading: false,
        loading: false,
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

  fetchStats: async () => {
    set({ isLoading: true, loading: true, error: null });
    try {
      const adminDashboard = await getAdminDashboard();
      set({ adminDashboard, stats: adminDashboard, isLoading: false, loading: false, error: null });
    } catch (error) {
      set({
        isLoading: false,
        loading: false,
        error: error instanceof Error ? error.message : 'Failed to fetch admin dashboard',
      });
    }
  },

  clearError: () => set({ error: null }),
}));
