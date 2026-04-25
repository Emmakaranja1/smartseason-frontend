import { useAuthStore } from '../store/authStore';

export const useAuth = () => {
  const {
    user,
    isAuthenticated,
    isLoading,
    error,
    login: storeLogin,
    logout: storeLogout,
    getCurrentUser,
    clearError,
  } = useAuthStore();

  const login = async (credentials: { email: string; password: string }) => {
    await storeLogin(credentials);
  };

  const logout = async () => {
    await storeLogout();
  };

  const isAdmin = user?.role === 'ADMIN';
  const isAgent = user?.role === 'FIELD_AGENT';

  return {
    user,
    isAuthenticated,
    loading: isLoading,
    error,
    login,
    logout,
    getCurrentUser,
    clearError,
    isAdmin,
    isAgent,
  };
};
