import { create } from 'zustand';
import { 
  getUsers, 
  getUserById, 
  createUser, 
  deleteUser
} from '../api/services/userService';
import type { User, CreateUserRequest } from '../api/services/userService';

interface UserState {
  users: User[];
  selectedUser: User | null;
  isLoading: boolean;
  error: string | null;
}

interface UserActions {
  fetchUsers: () => Promise<void>;
  fetchUserById: (id: number) => Promise<void>;
  createUser: (userData: CreateUserRequest) => Promise<void>;
  deleteUser: (id: number) => Promise<void>;
  setSelectedUser: (user: User | null) => void;
  clearError: () => void;
}

type UserStore = UserState & UserActions;

export const useUserStore = create<UserStore>((set, get) => ({
  users: [],
  selectedUser: null,
  isLoading: false,
  error: null,

  fetchUsers: async () => {
    set({ isLoading: true, error: null });
    try {
      const users = await getUsers();
      set({ users, isLoading: false, error: null });
    } catch (error) {
      set({
        isLoading: false,
        error: error instanceof Error ? error.message : 'Failed to fetch users',
      });
    }
  },

  fetchUserById: async (id: number) => {
    set({ isLoading: true, error: null });
    try {
      const user = await getUserById(id);
      set({ selectedUser: user, isLoading: false, error: null });
    } catch (error) {
      set({
        isLoading: false,
        error: error instanceof Error ? error.message : 'Failed to fetch user',
      });
    }
  },

  createUser: async (userData: CreateUserRequest) => {
    set({ isLoading: true, error: null });
    try {
      const newUser = await createUser(userData);
      const { users } = get();
      set({
        users: [...users, newUser],
        isLoading: false,
        error: null,
      });
    } catch (error) {
      set({
        isLoading: false,
        error: error instanceof Error ? error.message : 'Failed to create user',
      });
    }
  },

  deleteUser: async (id: number) => {
    set({ isLoading: true, error: null });
    try {
      await deleteUser(id);
      const { users } = get();
      set({
        users: users.filter(user => user.id !== id),
        selectedUser: get().selectedUser?.id === id ? null : get().selectedUser,
        isLoading: false,
        error: null,
      });
    } catch (error) {
      set({
        isLoading: false,
        error: error instanceof Error ? error.message : 'Failed to delete user',
      });
    }
  },

  setSelectedUser: (user: User | null) => set({ selectedUser: user }),
  clearError: () => set({ error: null }),
}));
