import { useFieldUpdateStore } from '../store/fieldUpdateStore';

export const useFieldUpdates = () => {
  const {
    updates,
    isLoading,
    error,
    fetchFieldUpdates: storeFetchFieldUpdates,
    createFieldUpdate: storeCreateFieldUpdate,
    clearError,
  } = useFieldUpdateStore();

  const fetchFieldUpdates = async (fieldId: number) => {
    await storeFetchFieldUpdates(fieldId);
  };

  const createFieldUpdate = async (fieldId: number, updateData: { 
    stage: 'PLANTED' | 'GROWING' | 'READY' | 'HARVESTED'; 
    notes: string 
  }) => {
    await storeCreateFieldUpdate(fieldId, updateData);
  };

  const getFieldUpdates = (fieldId: number) => {
    return updates[fieldId] || [];
  };

  return {
    updates,
    loading: isLoading,
    error,
    fetchFieldUpdates,
    createFieldUpdate,
    getFieldUpdates,
    clearError,
  };
};
