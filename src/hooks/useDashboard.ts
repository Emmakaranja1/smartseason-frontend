import { useDashboardStore } from '../store/dashboardStore';

export const useDashboard = () => {
  const {
    adminDashboard,
    agentDashboard,
    isLoading,
    error,
    fetchAdminDashboard: storeFetchAdminDashboard,
    fetchAgentDashboard: storeFetchAgentDashboard,
    clearError,
  } = useDashboardStore();

  const fetchAdminDashboard = async () => {
    await storeFetchAdminDashboard();
  };

  const fetchAgentDashboard = async () => {
    await storeFetchAgentDashboard();
  };

  return {
    adminDashboard,
    agentDashboard,
    loading: isLoading,
    error,
    fetchAdminDashboard,
    fetchAgentDashboard,
    clearError,
  };
};
