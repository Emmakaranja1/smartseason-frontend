import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useDashboardStore } from '../../store/dashboardStore';
import { useFieldUpdateStore } from '../../store/fieldUpdateStore';
import { StatusBadge, StageBadge } from '../../components/custom/StatusBadge';
import { 
  Map as MapIcon, 
  ArrowRight,
  Search,
  Plus,
  Eye,
  Mail,
  MessageSquare
} from 'lucide-react';
import { motion } from 'framer-motion';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription 
} from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Skeleton } from '../../components/ui/skeleton';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../../components/ui/dialog';
import type { CreateFieldUpdateRequest } from '../../api/services/fieldupdateService';

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const item = {
  hidden: { opacity: 0, scale: 0.95 },
  show: { opacity: 1, scale: 1 }
};

export const AgentFields = () => {
  const { agentDashboard, isLoading, fetchAgentDashboard } = useDashboardStore();
  const { createFieldUpdate } = useFieldUpdateStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [stageFilter, setStageFilter] = useState('all');
  const [showRequestDialog, setShowRequestDialog] = useState(false);

  useEffect(() => {
    fetchAgentDashboard();
  }, [fetchAgentDashboard]);

  const filteredFields = agentDashboard?.assignedFields?.filter(field => {
    const matchesSearch = field.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         field.cropType.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || field.status === statusFilter;
    const matchesStage = stageFilter === 'all' || field.currentStage === stageFilter;
    
    return matchesSearch && matchesStatus && matchesStage;
  }) || [];

  const handleQuickUpdate = async (fieldId: number, stage: string) => {
    try {
      const updateData: CreateFieldUpdateRequest = {
        stage: stage as any,
        notes: `Quick update to ${stage} stage`
      };
      
      await createFieldUpdate(fieldId, updateData);
      toast.success('Field updated successfully!');
      fetchAgentDashboard(); // Refresh data
    } catch (error: any) {
      toast.error(error.message || 'Failed to update field');
    }
  };

  if (isLoading && !agentDashboard) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-10 w-32" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Skeleton key={i} className="h-64 w-full rounded-2xl" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-stone-900 tracking-tight">My Fields</h2>
          <p className="text-stone-500 mt-1">Manage and update your assigned fields.</p>
        </div>
        <div className="flex gap-3">
          <Dialog open={showRequestDialog} onOpenChange={setShowRequestDialog}>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setShowRequestDialog(true)}
            >
              <Plus size={16} className="mr-2" />
              Request Field
            </Button>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <Plus size={20} className="text-emerald-600" />
                  Request a New Field
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-6">
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                  <div className="flex items-start gap-3">
                    <MessageSquare className="text-amber-600 mt-0.5" size={20} />
                    <div>
                      <h4 className="font-medium text-amber-900">How to Request a Field</h4>
                      <p className="text-sm text-amber-700 mt-1">
                        Field assignments are managed by administrators. Contact your admin coordinator to request new field assignments.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="bg-stone-50 rounded-xl p-4">
                    <h4 className="font-medium text-stone-900 mb-2">Contact Information</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2">
                        <Mail size={16} className="text-stone-400" />
                        <span className="text-stone-600">admin@smartseason.com</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MessageSquare size={16} className="text-stone-400" />
                        <span className="text-stone-600">Use the internal messaging system</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-emerald-50 rounded-xl p-4">
                    <h4 className="font-medium text-emerald-900 mb-2">What to Include</h4>
                    <ul className="text-sm text-emerald-700 space-y-1">
                      <li>• Field location and size</li>
                      <li>• Crop type you want to plant</li>
                      <li>• Expected planting date</li>
                      <li>• Any special requirements</li>
                    </ul>
                  </div>
                </div>

                <div className="flex gap-3">
                  <Button 
                    variant="outline" 
                    onClick={() => setShowRequestDialog(false)}
                    className="flex-1"
                  >
                    Close
                  </Button>
                  <Button 
                    className="flex-1 bg-emerald-600 hover:bg-emerald-700"
                    onClick={() => {
                      navigator.clipboard.writeText('admin@smartseason.com');
                      toast.success('Admin email copied to clipboard!');
                      setShowRequestDialog(false);
                    }}
                  >
                    Copy Email
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Filters */}
      <Card className="border-stone-200 shadow-sm rounded-2xl">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-stone-400" size={20} />
                <Input
                  placeholder="Search fields..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value || 'all')}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="ACTIVE">Active</SelectItem>
                <SelectItem value="AT_RISK">At Risk</SelectItem>
                <SelectItem value="COMPLETED">Completed</SelectItem>
              </SelectContent>
            </Select>
            <Select value={stageFilter} onValueChange={(value) => setStageFilter(value || 'all')}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Filter by stage" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Stages</SelectItem>
                <SelectItem value="PLANTED">Planted</SelectItem>
                <SelectItem value="GROWING">Growing</SelectItem>
                <SelectItem value="READY">Ready</SelectItem>
                <SelectItem value="HARVESTED">Harvested</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Fields Grid */}
      <motion.div 
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {filteredFields.map((field) => (
          <motion.div
            key={field.id}
            variants={item}
            whileHover={{ y: -4 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          >
            <Card className="border-stone-200 hover:border-emerald-200 transition-all duration-300 rounded-2xl overflow-hidden group">
              <CardHeader className="pb-4">
                <div className="flex justify-between items-start">
                  <StatusBadge status={field.status} />
                  <span className="text-[10px] text-stone-400 font-bold uppercase tracking-widest">#{field.id}</span>
                </div>
                <CardTitle className="mt-4 text-xl">{field.name}</CardTitle>
                <CardDescription>{field.cropType} • Planted {new Date(field.plantingDate).toLocaleDateString()}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between py-3 border-y border-stone-100">
                  <span className="text-sm text-stone-500">Current Stage</span>
                  <StageBadge stage={field.currentStage as any} />
                </div>

                {/* Quick Actions */}
                <div className="flex gap-2">
                  {field.currentStage !== 'HARVESTED' && (
                    <Button
                      size="sm"
                      variant="outline"
                      className="flex-1 text-xs"
                      onClick={() => {
                        const nextStage = field.currentStage === 'PLANTED' ? 'GROWING' : 
                                       field.currentStage === 'GROWING' ? 'READY' : 'HARVESTED';
                        handleQuickUpdate(field.id, nextStage);
                      }}
                    >
                      <ArrowRight size={14} className="mr-1" />
                      {field.currentStage === 'PLANTED' ? 'Mark Growing' : 
                       field.currentStage === 'GROWING' ? 'Mark Ready' : 'Mark Harvested'}
                    </Button>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2">
                  <Link to={`/fields/${field.id}`} className="flex-1">
                    <Button 
                      variant="ghost" 
                      className="w-full justify-between hover:bg-emerald-50 hover:text-emerald-700 rounded-xl group"
                    >
                      <div className="flex items-center">
                        <Eye size={16} className="mr-2" />
                        View Details
                      </div>
                      <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
        
        {filteredFields.length === 0 && (
          <div className="col-span-full h-64 bg-stone-50 border-2 border-dashed border-stone-200 rounded-2xl flex flex-col items-center justify-center text-stone-400 gap-3">
            <MapIcon size={48} className="opacity-20" />
            <p className="text-lg font-medium">No fields found</p>
            <p className="text-sm">Try adjusting your filters or search terms</p>
          </div>
        )}
      </motion.div>

      {/* Summary Stats */}
      {agentDashboard && (
        <Card className="border-stone-200 shadow-sm rounded-2xl">
          <CardHeader>
            <CardTitle className="text-lg">Summary</CardTitle>
            <CardDescription>Overview of your field assignments</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-stone-900">{agentDashboard.assignedFields.length}</div>
                <div className="text-sm text-stone-500">Total Fields</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-emerald-600">{agentDashboard.statusBreakdown.active}</div>
                <div className="text-sm text-stone-500">Active</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-amber-600">{agentDashboard.statusBreakdown.atRisk}</div>
                <div className="text-sm text-stone-500">At Risk</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-stone-600">{agentDashboard.statusBreakdown.completed}</div>
                <div className="text-sm text-stone-500">Completed</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
