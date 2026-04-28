import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useFieldStore } from '../store/fieldStore';
import { useFieldUpdateStore } from '../store/fieldUpdateStore';
import { StatusBadge, StageBadge } from '../components/custom/StatusBadge';
import { 
  ArrowLeft, 
  Calendar, 
  Map as MapIcon, 
  User, 
  Clock,
  Save,
  AlertCircle
} from 'lucide-react';
import { motion } from 'framer-motion';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription 
} from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Textarea } from '../components/ui/textarea';
import { Label } from '../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { toast } from 'sonner';
import { Skeleton } from '../components/ui/skeleton';
import { FieldStage } from '../types';
import type { CreateFieldUpdateRequest } from '../api/services/fieldupdateService';

const fieldStages = [
  { value: 'PLANTED', label: 'Planted', description: 'Seeds have been planted' },
  { value: 'GROWING', label: 'Growing', description: 'Crops are actively growing' },
  { value: 'READY', label: 'Ready', description: 'Crops are ready for harvest' },
  { value: 'HARVESTED', label: 'Harvested', description: 'Crops have been harvested' }
];

export const FieldDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { selectedField, isLoading, fetchFieldById } = useFieldStore();
  const { createFieldUpdate } = useFieldUpdateStore();
  
  const [updateForm, setUpdateForm] = useState({
    stage: '',
    notes: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (id) {
      fetchFieldById(Number(id));
    }
  }, [id, fetchFieldById]);

  const handleSubmitUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!updateForm.stage || !updateForm.notes.trim()) {
      toast.error('Please fill in all fields');
      return;
    }

    setIsSubmitting(true);
    try {
      const updateData: CreateFieldUpdateRequest = {
        stage: updateForm.stage as any,
        notes: updateForm.notes
      };
      
      await createFieldUpdate(Number(id), updateData);
      toast.success('Field updated successfully!');
      setUpdateForm({ stage: '', notes: '' });
      
      // Refresh field data
      if (id) {
        fetchFieldById(Number(id));
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to update field');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Skeleton className="h-10 w-10 rounded-lg" />
          <Skeleton className="h-8 w-48" />
        </div>
        <Skeleton className="h-64 w-full rounded-2xl" />
        <Skeleton className="h-96 w-full rounded-2xl" />
      </div>
    );
  }

  if (!selectedField) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-4">
        <AlertCircle className="w-12 h-12 text-stone-400" />
        <div className="text-center">
          <h3 className="text-lg font-medium text-stone-900">Field not found</h3>
          <p className="text-stone-500 mt-1">The field you're looking for doesn't exist or you don't have access to it.</p>
        </div>
        <Link to="/agent">
          <Button variant="outline">Back to Dashboard</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link to="/agent">
          <Button variant="ghost" size="sm" className="rounded-lg">
            <ArrowLeft size={16} className="mr-2" />
            Back to Dashboard
          </Button>
        </Link>
        <div className="flex-1">
          <h1 className="text-3xl font-bold text-stone-900">{selectedField.name}</h1>
          <p className="text-stone-500 mt-1">Field #{selectedField.id}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Field Information */}
        <div className="lg:col-span-2 space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Card className="border-stone-200 shadow-sm rounded-2xl overflow-hidden">
              <CardHeader className="pb-6">
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-xl">Field Information</CardTitle>
                    <CardDescription>Details about this field and its current status</CardDescription>
                  </div>
                  <StatusBadge status={selectedField.status} />
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-stone-100 rounded-lg flex items-center justify-center">
                        <MapIcon size={18} className="text-stone-600" />
                      </div>
                      <div>
                        <p className="text-sm text-stone-500">Crop Type</p>
                        <p className="font-medium text-stone-900">{selectedField.cropType}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-stone-100 rounded-lg flex items-center justify-center">
                        <Calendar size={18} className="text-stone-600" />
                      </div>
                      <div>
                        <p className="text-sm text-stone-500">Planting Date</p>
                        <p className="font-medium text-stone-900">
                          {new Date(selectedField.plantingDate).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                        <AlertCircle size={18} className="text-emerald-600" />
                      </div>
                      <div>
                        <p className="text-sm text-stone-500">Current Stage</p>
                        <StageBadge stage={selectedField.currentStage as FieldStage} />
                      </div>
                    </div>
                    
                    {selectedField.assignedAgent && (
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-stone-100 rounded-lg flex items-center justify-center">
                          <User size={18} className="text-stone-600" />
                        </div>
                        <div>
                          <p className="text-sm text-stone-500">Assigned Agent</p>
                          <p className="font-medium text-stone-900">{selectedField.assignedAgent.name}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Update Form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <Card className="border-stone-200 shadow-sm rounded-2xl">
              <CardHeader>
                <CardTitle className="text-xl">Update Field Status</CardTitle>
                <CardDescription>Update the current stage and add observations</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmitUpdate} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="stage">Current Stage</Label>
                    <Select 
                      value={updateForm.stage} 
                      onValueChange={(value) => setUpdateForm(prev => ({ ...prev, stage: value || '' }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select current stage" />
                      </SelectTrigger>
                      <SelectContent>
                        {fieldStages.map(stage => (
                          <SelectItem key={stage.value} value={stage.value}>
                            <div>
                              <div className="font-medium">{stage.label}</div>
                              <div className="text-sm text-stone-500">{stage.description}</div>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="notes">Observations & Notes</Label>
                    <Textarea
                      id="notes"
                      placeholder="Describe the current condition, any issues, or observations about this field..."
                      value={updateForm.notes}
                      onChange={(e) => setUpdateForm(prev => ({ ...prev, notes: e.target.value }))}
                      rows={4}
                      className="resize-none"
                    />
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full bg-emerald-600 hover:bg-emerald-700"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <Clock className="mr-2 h-4 w-4 animate-spin" />
                        Updating...
                      </>
                    ) : (
                      <>
                        <Save className="mr-2 h-4 w-4" />
                        Update Field
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Recent Updates Sidebar */}
        <div className="space-y-6">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Card className="border-stone-200 shadow-sm rounded-2xl">
              <CardHeader>
                <CardTitle className="text-lg">Update History</CardTitle>
                <CardDescription>Recent changes to this field</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <Clock className="w-12 h-12 text-stone-300 mx-auto mb-3" />
                  <p className="text-stone-500 text-sm">Update history will be available here</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
};
