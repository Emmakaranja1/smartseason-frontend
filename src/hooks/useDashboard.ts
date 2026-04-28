import { useDashboardStore } from '../store/dashboardStore';

export const useDashboard = () => {
  const {
    adminDashboard,
    agentDashboard,
    stats,
    isLoading,
    loading,
    error,
    fetchAdminDashboard: storeFetchAdminDashboard,
    fetchAgentDashboard: storeFetchAgentDashboard,
    fetchStats: storeFetchStats,
    clearError,
  } = useDashboardStore();

  const fetchAdminDashboard = async () => {
    await storeFetchAdminDashboard();
  };

  const fetchAgentDashboard = async () => {
    await storeFetchAgentDashboard();
  };

  const fetchStats = async () => {
    await storeFetchStats();
  };

  return {
    adminDashboard,
    agentDashboard,
    stats,
    loading: loading || isLoading,
    error,
    fetchAdminDashboard,
    fetchAgentDashboard,
    fetchStats,
    clearError,
  };
};
