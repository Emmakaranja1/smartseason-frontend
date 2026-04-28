import { useEffect, useState } from 'react';
import { useAgents } from '../../hooks/useUsers';
import { 
  createField, 
  getFields, 
  updateField, 
  deleteField,
  type Field,
  type CreateFieldRequest,
  type UpdateFieldRequest,
  type FieldStage
} from '../../api/services/fieldService';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from '../../components/ui/dialog';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../components/ui/select';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '../../components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Skeleton } from '../../components/ui/skeleton';
import { 
  Map as MapIcon, 
  Plus, 
  Trash2, 
  Edit,
  Leaf,
  Calendar,
  User as UserIcon
} from 'lucide-react';
import { toast } from 'sonner';

const FieldStatusBadge = ({ status }: { status: string }) => {
  const variants = {
    ACTIVE: 'bg-emerald-100 text-emerald-800',
    AT_RISK: 'bg-amber-100 text-amber-800',
    COMPLETED: 'bg-stone-100 text-stone-800'
  };
  
  return (
    <Badge className={variants[status as keyof typeof variants] || 'bg-stone-100 text-stone-800'}>
      {status.replace('_', ' ')}
    </Badge>
  );
};

const StageBadge = ({ stage }: { stage: FieldStage }) => {
  const colors = {
    PLANTED: 'bg-blue-100 text-blue-800',
    GROWING: 'bg-emerald-100 text-emerald-800',
    READY: 'bg-amber-100 text-amber-800',
    HARVESTED: 'bg-stone-100 text-stone-800'
  };
  
  return (
    <Badge className={colors[stage]}>
      {stage}
    </Badge>
  );
};

export const FieldManagement = () => {
  const { agents } = useAgents();
  const [fields, setFields] = useState<Field[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingField, setEditingField] = useState<Field | null>(null);
  const [formData, setFormData] = useState<CreateFieldRequest>({
    name: '',
    cropType: '',
    plantingDate: '',
    currentStage: 'PLANTED',
    assignedAgentId: undefined
  });

  const fetchFields = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const fieldsData = await getFields();
      setFields(fieldsData);
    } catch (err) {
      setError('Failed to fetch fields');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchFields();
  }, []);

  const resetForm = () => {
    setFormData({
      name: '',
      cropType: '',
      plantingDate: '',
      currentStage: 'PLANTED',
      assignedAgentId: undefined
    });
  };

  const handleCreateField = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createField(formData);
      toast.success('Field created successfully');
      setIsCreateDialogOpen(false);
      resetForm();
      fetchFields();
    } catch (error) {
      toast.error('Failed to create field');
    }
  };

  const handleEditField = (field: Field) => {
    setEditingField(field);
    setFormData({
      name: field.name,
      cropType: field.cropType,
      plantingDate: field.plantingDate,
      currentStage: field.currentStage,
      assignedAgentId: field.assignedAgentId
    });
    setIsEditDialogOpen(true);
  };

  const handleUpdateField = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingField) return;
    
    try {
      await updateField(editingField.id, formData as UpdateFieldRequest);
      toast.success('Field updated successfully');
      setIsEditDialogOpen(false);
      setEditingField(null);
      resetForm();
      fetchFields();
    } catch (error) {
      toast.error('Failed to update field');
    }
  };

  const handleDeleteField = async (fieldId: number, fieldName: string) => {
    if (window.confirm(`Are you sure you want to delete ${fieldName}?`)) {
      try {
        await deleteField(fieldId);
        toast.success('Field deleted successfully');
        fetchFields();
      } catch (error) {
        toast.error('Failed to delete field');
      }
    }
  };

  if (isLoading && fields.length === 0) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-3xl font-bold text-stone-900">Field Management</h2>
        </div>
        <Card>
          <CardContent className="p-6">
            <div className="space-y-4">
              {[1, 2, 3, 4].map((i) => (
                <Skeleton key={i} className="h-16 w-full" />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-stone-900">Field Management</h2>
          <p className="text-stone-500 mt-1">Manage agricultural fields and monitor their growth stages</p>
        </div>
        
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger>
            <Button className="bg-emerald-600 hover:bg-emerald-700">
              <Plus size={16} className="mr-2" />
              Add Field
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Create New Field</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleCreateField} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Field Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Enter field name"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="cropType">Crop Type</Label>
                <Input
                  id="cropType"
                  value={formData.cropType}
                  onChange={(e) => setFormData({ ...formData, cropType: e.target.value })}
                  placeholder="e.g., Wheat, Corn, Soybeans"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="plantingDate">Planting Date</Label>
                <Input
                  id="plantingDate"
                  type="date"
                  value={formData.plantingDate}
                  onChange={(e) => setFormData({ ...formData, plantingDate: e.target.value })}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="currentStage">Current Stage</Label>
                <Select value={formData.currentStage} onValueChange={(value) => setFormData({ ...formData, currentStage: value as FieldStage })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select stage" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="PLANTED">Planted</SelectItem>
                    <SelectItem value="GROWING">Growing</SelectItem>
                    <SelectItem value="READY">Ready</SelectItem>
                    <SelectItem value="HARVESTED">Harvested</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="assignedAgentId">Assigned Agent</Label>
                <Select value={formData.assignedAgentId?.toString() || ''} onValueChange={(value) => setFormData({ ...formData, assignedAgentId: value ? parseInt(value) : undefined })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select agent (optional)" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Unassigned</SelectItem>
                    {agents.map((agent) => (
                      <SelectItem key={agent.id} value={agent.id.toString()}>
                        {agent.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex justify-end space-x-2 pt-4">
                <Button type="button" variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" className="bg-emerald-600 hover:bg-emerald-700">
                  Create Field
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapIcon size={20} className="text-emerald-600" />
            All Fields ({fields.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700">
              {error}
            </div>
          )}
          
          {fields.length === 0 ? (
            <div className="text-center py-12">
              <MapIcon size={48} className="mx-auto text-stone-300 mb-4" />
              <h3 className="text-lg font-semibold text-stone-900 mb-2">No fields found</h3>
              <p className="text-stone-500 mb-4">Get started by creating your first field</p>
              <Button onClick={() => setIsCreateDialogOpen(true)} className="bg-emerald-600 hover:bg-emerald-700">
                <Plus size={16} className="mr-2" />
                Add First Field
              </Button>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Field</TableHead>
                  <TableHead>Crop</TableHead>
                  <TableHead>Stage</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Assigned Agent</TableHead>
                  <TableHead>Planted</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {fields.map((field) => (
                  <TableRow key={field.id} className="hover:bg-stone-50">
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center">
                          <Leaf size={16} className="text-emerald-600" />
                        </div>
                        <div className="font-medium text-stone-900">{field.name}</div>
                      </div>
                    </TableCell>
                    <TableCell className="text-stone-600">{field.cropType}</TableCell>
                    <TableCell>
                      <StageBadge stage={field.currentStage} />
                    </TableCell>
                    <TableCell>
                      <FieldStatusBadge status={field.status} />
                    </TableCell>
                    <TableCell>
                      {field.assignedAgent ? (
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-full bg-stone-100 flex items-center justify-center">
                            <UserIcon size={12} className="text-stone-600" />
                          </div>
                          <span className="text-sm text-stone-600">{field.assignedAgent.name}</span>
                        </div>
                      ) : (
                        <span className="text-sm text-stone-400">Unassigned</span>
                      )}
                    </TableCell>
                    <TableCell className="text-stone-500">
                      <div className="flex items-center gap-1">
                        <Calendar size={12} />
                        {new Date(field.plantingDate).toLocaleDateString()}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEditField(field)}
                        >
                          <Edit size={14} />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteField(field.id, field.name)}
                          className="text-red-600 hover:text-red-700 hover:border-red-300"
                        >
                          <Trash2 size={14} />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Field</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleUpdateField} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="edit-name">Field Name</Label>
              <Input
                id="edit-name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Enter field name"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="edit-cropType">Crop Type</Label>
              <Input
                id="edit-cropType"
                value={formData.cropType}
                onChange={(e) => setFormData({ ...formData, cropType: e.target.value })}
                placeholder="e.g., Wheat, Corn, Soybeans"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="edit-plantingDate">Planting Date</Label>
              <Input
                id="edit-plantingDate"
                type="date"
                value={formData.plantingDate}
                onChange={(e) => setFormData({ ...formData, plantingDate: e.target.value })}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="edit-currentStage">Current Stage</Label>
              <Select value={formData.currentStage} onValueChange={(value) => setFormData({ ...formData, currentStage: value as FieldStage })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select stage" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="PLANTED">Planted</SelectItem>
                  <SelectItem value="GROWING">Growing</SelectItem>
                  <SelectItem value="READY">Ready</SelectItem>
                  <SelectItem value="HARVESTED">Harvested</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="edit-assignedAgentId">Assigned Agent</Label>
              <Select value={formData.assignedAgentId?.toString() || ''} onValueChange={(value) => setFormData({ ...formData, assignedAgentId: value ? parseInt(value) : undefined })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select agent (optional)" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Unassigned</SelectItem>
                  {agents.map((agent) => (
                    <SelectItem key={agent.id} value={agent.id.toString()}>
                      {agent.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex justify-end space-x-2 pt-4">
              <Button type="button" variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" className="bg-emerald-600 hover:bg-emerald-700">
                Update Field
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};
