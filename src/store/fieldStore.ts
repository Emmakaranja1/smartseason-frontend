import { create } from 'zustand';
import { getFields, getFieldById, createField, updateField, deleteField } from '../api/services/fieldService';
import type { Field, CreateFieldRequest, UpdateFieldRequest } from '../api/services/fieldService';

interface FieldState {
  fields: Field[];
  selectedField: Field | null;
  isLoading: boolean;
  error: string | null;
}

interface FieldActions {
  fetchFields: () => Promise<void>;
  fetchFieldById: (id: number) => Promise<void>;
  createField: (fieldData: CreateFieldRequest) => Promise<void>;
  updateField: (id: number, fieldData: UpdateFieldRequest) => Promise<void>;
  deleteField: (id: number) => Promise<void>;
  setSelectedField: (field: Field | null) => void;
  clearError: () => void;
}

type FieldStore = FieldState & FieldActions;

export const useFieldStore = create<FieldStore>((set, get) => ({
  fields: [],
  selectedField: null,
  isLoading: false,
  error: null,

  fetchFields: async () => {
    set({ isLoading: true, error: null });
    try {
      const fields = await getFields();
      set({ fields, isLoading: false, error: null });
    } catch (error) {
      set({
        isLoading: false,
        error: error instanceof Error ? error.message : 'Failed to fetch fields',
      });
    }
  },

  fetchFieldById: async (id: number) => {
    set({ isLoading: true, error: null });
    try {
      const field = await getFieldById(id);
      set({ selectedField: field, isLoading: false, error: null });
    } catch (error) {
      set({
        isLoading: false,
        error: error instanceof Error ? error.message : 'Failed to fetch field',
      });
    }
  },

  createField: async (fieldData: CreateFieldRequest) => {
    set({ isLoading: true, error: null });
    try {
      const newField = await createField(fieldData);
      const { fields } = get();
      set({
        fields: [...fields, newField],
        isLoading: false,
        error: null,
      });
    } catch (error) {
      set({
        isLoading: false,
        error: error instanceof Error ? error.message : 'Failed to create field',
      });
    }
  },

  updateField: async (id: number, fieldData: UpdateFieldRequest) => {
    set({ isLoading: true, error: null });
    try {
      const updatedField = await updateField(id, fieldData);
      const { fields } = get();
      set({
        fields: fields.map(field => field.id === id ? updatedField : field),
        selectedField: get().selectedField?.id === id ? updatedField : get().selectedField,
        isLoading: false,
        error: null,
      });
    } catch (error) {
      set({
        isLoading: false,
        error: error instanceof Error ? error.message : 'Failed to update field',
      });
    }
  },

  deleteField: async (id: number) => {
    set({ isLoading: true, error: null });
    try {
      await deleteField(id);
      const { fields } = get();
      set({
        fields: fields.filter(field => field.id !== id),
        selectedField: get().selectedField?.id === id ? null : get().selectedField,
        isLoading: false,
        error: null,
      });
    } catch (error) {
      set({
        isLoading: false,
        error: error instanceof Error ? error.message : 'Failed to delete field',
      });
    }
  },

  setSelectedField: (field: Field | null) => set({ selectedField: field }),
  clearError: () => set({ error: null }),
}));
