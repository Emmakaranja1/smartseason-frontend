import { create } from 'zustand';
import { getFieldUpdates, createFieldUpdate } from '../api/services/fieldupdateService';
import type { FieldUpdate, CreateFieldUpdateRequest } from '../api/services/fieldupdateService';

interface FieldUpdateState {
  updates: Record<number, FieldUpdate[]>;
  isLoading: boolean;
  error: string | null;
}

interface FieldUpdateActions {
  fetchFieldUpdates: (fieldId: number) => Promise<void>;
  createFieldUpdate: (fieldId: number, updateData: CreateFieldUpdateRequest) => Promise<void>;
  clearError: () => void;
}

type FieldUpdateStore = FieldUpdateState & FieldUpdateActions;

export const useFieldUpdateStore = create<FieldUpdateStore>((set, get) => ({
  updates: {},
  isLoading: false,
  error: null,

  fetchFieldUpdates: async (fieldId: number) => {
    set({ isLoading: true, error: null });
    try {
      const updates = await getFieldUpdates(fieldId);
      const { updates: currentUpdates } = get();
      set({
        updates: { ...currentUpdates, [fieldId]: updates },
        isLoading: false,
        error: null,
      });
    } catch (error) {
      set({
        isLoading: false,
        error: error instanceof Error ? error.message : 'Failed to fetch field updates',
      });
    }
  },

  createFieldUpdate: async (fieldId: number, updateData: CreateFieldUpdateRequest) => {
    set({ isLoading: true, error: null });
    try {
      const newUpdate = await createFieldUpdate(fieldId, updateData);
      const { updates: currentUpdates } = get();
      const fieldUpdates = currentUpdates[fieldId] || [];
      set({
        updates: { ...currentUpdates, [fieldId]: [newUpdate, ...fieldUpdates] },
        isLoading: false,
        error: null,
      });
    } catch (error) {
      set({
        isLoading: false,
        error: error instanceof Error ? error.message : 'Failed to create field update',
      });
    }
  },

  clearError: () => set({ error: null }),
}));
