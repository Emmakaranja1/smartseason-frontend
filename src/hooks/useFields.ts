import { useFieldStore } from '../store/fieldStore';

export const useFields = () => {
  const {
    fields,
    selectedField,
    isLoading,
    error,
    fetchFields: storeFetchFields,
    fetchFieldById: storeFetchFieldById,
    createField: storeCreateField,
    updateField: storeUpdateField,
    deleteField: storeDeleteField,
    setSelectedField,
    clearError,
  } = useFieldStore();

  const fetchFields = async () => {
    await storeFetchFields();
  };

  const fetchFieldById = async (id: number) => {
    await storeFetchFieldById(id);
  };

  const createField = async (fieldData: { 
    name: string; 
    cropType: string; 
    plantingDate: string; 
    currentStage: 'PLANTED' | 'GROWING' | 'READY' | 'HARVESTED'; 
    assignedAgentId?: number 
  }) => {
    await storeCreateField(fieldData);
  };

  const updateField = async (id: number, fieldData: { 
    name: string; 
    cropType: string; 
    plantingDate: string; 
    currentStage: 'PLANTED' | 'GROWING' | 'READY' | 'HARVESTED'; 
    assignedAgentId?: number 
  }) => {
    await storeUpdateField(id, fieldData);
  };

  const deleteField = async (id: number) => {
    await storeDeleteField(id);
  };

  return {
    fields,
    selectedField,
    loading: isLoading,
    error,
    fetchFields,
    fetchFieldById,
    createField,
    updateField,
    deleteField,
    setSelectedField,
    clearError,
  };
};
