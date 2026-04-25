import { useEffect } from 'react';
import { useUserStore } from '../store/userStore';

export const useUsers = () => {
  const {
    users,
    selectedUser,
    isLoading,
    error,
    fetchUsers,
    fetchUserById,
    createUser,
    deleteUser,
    setSelectedUser,
    clearError,
  } = useUserStore();

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  return {
    users,
    selectedUser,
    isLoading,
    error,
    fetchUsers,
    fetchUserById,
    createUser,
    deleteUser,
    setSelectedUser,
    clearError,
  };
};

export const useAgents = () => {
  const { users, isLoading, error, fetchUsers } = useUserStore();
  
  // Filter users to get only FIELD_AGENTs since backend doesn't have separate endpoint
  const agents = users.filter(user => user.role === 'FIELD_AGENT');

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  return {
    agents,
    isLoading,
    error,
    refetch: fetchUsers,
  };
};

export const useUser = (id: number) => {
  const {
    selectedUser,
    isLoading,
    error,
    fetchUserById,
    setSelectedUser,
    clearError,
  } = useUserStore();

  useEffect(() => {
    if (id) {
      fetchUserById(id);
    }
  }, [id, fetchUserById]);

  return {
    user: selectedUser,
    isLoading,
    error,
    refetch: () => fetchUserById(id),
    clearError,
    setUser: setSelectedUser,
  };
};
