import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useDashboardStore } from '../../store/dashboardStore';
import { 
  Map as MapIcon, 
  Leaf, 
  Clock,
  Search,
  ArrowRight,
  RefreshCw
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
import { Badge } from '../../components/ui/badge';
import { Skeleton } from '../../components/ui/skeleton';
import { toast } from 'sonner';

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
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
};

export const AgentUpdates = () => {
  const { agentDashboard, isLoading, fetchAgentDashboard } = useDashboardStore();
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchAgentDashboard();
  }, [fetchAgentDashboard]);

  const filteredUpdates = agentDashboard?.recentUpdates?.filter(update => {
    const matchesSearch = update.notes.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         update.stage.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         update.fieldId.toString().includes(searchTerm);
    
    return matchesSearch;
  }) || [];

  const handleRefresh = () => {
    fetchAgentDashboard();
    toast.success('Data refreshed successfully!');
  };

  if (isLoading && !agentDashboard) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-10 w-32" />
        </div>
        <div className="space-y-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <Skeleton key={i} className="h-32 w-full rounded-2xl" />
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
          <h2 className="text-3xl font-bold text-stone-900 tracking-tight">Field Updates</h2>
          <p className="text-stone-500 mt-1">History of all your field updates and observations.</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" size="sm" onClick={handleRefresh}>
            <RefreshCw size={16} className="mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Search */}
      <Card className="border-stone-200 shadow-sm rounded-2xl">
        <CardContent className="p-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-stone-400" size={20} />
            <Input
              placeholder="Search updates by field, stage, or notes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Updates List */}
      <motion.div 
        variants={container}
        initial="hidden"
        animate="show"
        className="space-y-4"
      >
        {filteredUpdates.map((update) => (
          <motion.div
            key={update.id}
            variants={item}
            whileHover={{ x: 4 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          >
            <Card className="border-stone-200 hover:border-emerald-200 transition-all duration-300 rounded-2xl">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center text-emerald-600 shrink-0">
                    <Leaf size={24} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-3">
                      <Link to={`/fields/${update.fieldId}`}>
                        <Badge variant="outline" className="text-emerald-600 border-emerald-200 hover:bg-emerald-50">
                          <MapIcon size={14} className="mr-1" />
                          Field #{update.fieldId}
                        </Badge>
                      </Link>
                      <Badge className="bg-emerald-100 text-emerald-700">
                        {update.stage}
                      </Badge>
                      <span className="text-sm text-stone-400">
                        {new Date(update.createdAt).toLocaleDateString()} at {new Date(update.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    
                    <p className="text-stone-700 mb-3 leading-relaxed">
                      {update.notes}
                    </p>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-sm text-stone-500">
                        <Clock size={14} />
                        <span>{new Date(update.createdAt).toLocaleDateString()}</span>
                      </div>
                      <Link to={`/fields/${update.fieldId}`}>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          className="hover:bg-emerald-50 hover:text-emerald-700"
                        >
                          View Field
                          <ArrowRight size={14} className="ml-1" />
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
        
        {filteredUpdates.length === 0 && (
          <div className="h-64 bg-stone-50 border-2 border-dashed border-stone-200 rounded-2xl flex flex-col items-center justify-center text-stone-400 gap-3">
            <Leaf size={48} className="opacity-20" />
            <p className="text-lg font-medium">No updates found</p>
            <p className="text-sm">Start updating your fields to see them here</p>
            <Link to="/agent/fields">
              <Button variant="outline" size="sm">
                <MapIcon size={16} className="mr-2" />
                View My Fields
              </Button>
            </Link>
          </div>
        )}
      </motion.div>

      {/* Summary Stats */}
      {agentDashboard && (
        <Card className="border-stone-200 shadow-sm rounded-2xl">
          <CardHeader>
            <CardTitle className="text-lg">Update Summary</CardTitle>
            <CardDescription>Your field update activity</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-stone-50 rounded-xl">
                <div className="text-2xl font-bold text-stone-900">{agentDashboard.recentUpdates.length}</div>
                <div className="text-sm text-stone-500">Total Updates</div>
              </div>
              <div className="text-center p-4 bg-emerald-50 rounded-xl">
                <div className="text-2xl font-bold text-emerald-600">
                  {agentDashboard.recentUpdates.filter(u => u.stage === 'READY').length}
                </div>
                <div className="text-sm text-emerald-600">Fields Ready</div>
              </div>
              <div className="text-center p-4 bg-amber-50 rounded-xl">
                <div className="text-2xl font-bold text-amber-600">
                  {agentDashboard.recentUpdates.filter(u => u.stage === 'GROWING').length}
                </div>
                <div className="text-sm text-amber-600">Fields Growing</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
