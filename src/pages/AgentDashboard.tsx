import { useEffect } from 'react';
import { useDashboardStore } from '../store/dashboardStore';
import { StatCard } from '../components/custom/StatCard';
import { StatusBadge, StageBadge } from '../components/custom/StatusBadge';
import { 
  Map as MapIcon, 
  AlertTriangle, 
  CheckCircle2, 
  Leaf, 
  ArrowRight,
  ClipboardList
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
import { Link } from 'react-router-dom';
import { Skeleton } from '../components/ui/skeleton';

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

export const AgentDashboard = () => {
  const { agentDashboard, isLoading: statsLoading, fetchAgentDashboard } = useDashboardStore();

  useEffect(() => {
    fetchAgentDashboard();
  }, [fetchAgentDashboard]);

  const atRiskFields = agentDashboard?.atRiskFields || [];

  if (statsLoading && !agentDashboard) {
    return (
      <div className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-32 w-full rounded-2xl" />
          ))}
        </div>
        <Skeleton className="h-[400px] w-full rounded-2xl" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-stone-900 tracking-tight">Agent Dashboard</h2>
          <p className="text-stone-500 mt-1">Status of your assigned fields and required actions.</p>
        </div>
        <Link to="/agent/fields">
          <Button className="bg-emerald-600 hover:bg-emerald-700 h-12 px-6 rounded-xl shadow-lg shadow-emerald-600/10">
            <ClipboardList className="mr-2" size={20} />
            Update Fields
          </Button>
        </Link>
      </div>

      <motion.div 
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch"
      >
        <motion.div variants={item}>
          <StatCard 
            title="My Assignments" 
            value={agentDashboard?.assignedFields?.length || 0} 
            icon={MapIcon} 
            colorClass="bg-stone-800"
          />
        </motion.div>
        <motion.div variants={item}>
          <StatCard 
            title="Growing" 
            value={agentDashboard?.statusBreakdown?.active || 0} 
            icon={Leaf} 
            colorClass="bg-emerald-600"
          />
        </motion.div>
        <motion.div variants={item}>
          <StatCard 
            title="Urgent Attention" 
            value={agentDashboard?.statusBreakdown?.atRisk || 0} 
            icon={AlertTriangle} 
            colorClass="bg-amber-500"
          />
        </motion.div>
        <motion.div variants={item}>
          <StatCard 
            title="Completed" 
            value={agentDashboard?.statusBreakdown?.completed || 0} 
            icon={CheckCircle2} 
            colorClass="bg-stone-600"
          />
        </motion.div>
      </motion.div>

      <div className="space-y-8">
        <Card className="border-stone-200 shadow-sm rounded-2xl overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between pb-6">
            <div>
              <CardTitle className="text-xl font-bold">My Field Assignments</CardTitle>
              <CardDescription>Fields assigned to you and their current status.</CardDescription>
            </div>
            <Link to="/agent/fields">
              <Button variant="outline" size="sm" className="rounded-lg h-9">
                <ClipboardList size={16} className="mr-2" />
                Update Fields
              </Button>
            </Link>
          </CardHeader>
          <CardContent className="p-0">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
              {agentDashboard?.assignedFields?.map((field) => (
                <motion.div
                  key={field.id}
                  whileHover={{ y: -4 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                >
                  <Card className="border-stone-200 hover:border-emerald-200 transition-colors rounded-2xl overflow-hidden group">
                    <CardHeader className="pb-4">
                      <div className="flex justify-between items-start">
                        <StatusBadge status={field.status} />
                        <span className="text-[10px] text-stone-400 font-bold uppercase tracking-widest">#{field.id}</span>
                      </div>
                      <CardTitle className="mt-4 text-lg">{field.name}</CardTitle>
                      <CardDescription>{field.cropType} • Planted {new Date(field.plantingDate).toLocaleDateString()}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center justify-between py-3 border-y border-stone-100">
                        <span className="text-sm text-stone-500">Current Stage</span>
                        <StageBadge stage={field.currentStage as any} />
                      </div>
                      <Link to={`/fields/${field.id}`}>
                        <Button 
                          variant="ghost" 
                          className="w-full justify-between hover:bg-emerald-50 hover:text-emerald-700 rounded-xl group"
                        >
                          View Details
                          <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                        </Button>
                      </Link>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
              {(!agentDashboard?.assignedFields?.length && !statsLoading) && (
                <div className="col-span-full h-64 bg-stone-50 border-2 border-dashed border-stone-200 rounded-2xl flex flex-col items-center justify-center text-stone-400 gap-3">
                  <MapIcon size={48} className="opacity-20" />
                  <p>No fields assigned to you yet.</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card className="border-stone-200 shadow-sm rounded-2xl">
            <CardHeader>
              <CardTitle className="text-lg font-bold flex items-center gap-2">
                <AlertTriangle size={18} className="text-amber-500" />
                Action Required
              </CardTitle>
              <CardDescription>Fields that need your attention.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {atRiskFields.map(field => (
                <Link 
                  key={field.id}
                  to={`/fields/${field.id}`}
                  className="flex items-center gap-4 p-3 rounded-xl hover:bg-stone-50 transition-colors border border-transparent hover:border-stone-100 group"
                >
                  <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center text-amber-600 shrink-0">
                    <MapIcon size={20} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-stone-900 truncate">{field.name}</p>
                    <p className="text-xs text-stone-500">Needs update</p>
                  </div>
                  <ArrowRight size={14} className="text-stone-300 group-hover:text-amber-500 group-hover:translate-x-1 transition-all" />
                </Link>
              ))}
              {(!atRiskFields.length && agentDashboard) && (
                <div className="py-12 text-center flex flex-col items-center gap-3">
                  <div className="w-12 h-12 bg-emerald-50 rounded-full flex items-center justify-center text-emerald-500">
                    <CheckCircle2 size={24} />
                  </div>
                  <p className="text-stone-500 text-sm">All clear! No urgent tasks.</p>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="border-stone-200 shadow-sm rounded-2xl">
            <CardHeader>
              <CardTitle className="text-lg font-bold flex items-center gap-2">
                <ClipboardList size={18} className="text-emerald-600" />
                Recent Updates
              </CardTitle>
              <CardDescription>Your latest field update activities.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {agentDashboard?.recentUpdates?.map(update => (
                <div key={update.id} className="flex items-start gap-3 p-3 rounded-xl bg-stone-50 border border-stone-100">
                  <div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center text-emerald-600 shrink-0 mt-0.5">
                    <Leaf size={16} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium text-stone-900 text-sm">Field #{update.fieldId}</span>
                      <span className="text-xs text-stone-500">•</span>
                      <span className="text-xs text-emerald-600 font-medium bg-emerald-50 px-2 py-0.5 rounded-full">
                        {update.stage}
                      </span>
                    </div>
                    {update.notes && (
                      <p className="text-sm text-stone-600 mb-2 line-clamp-2">{update.notes}</p>
                    )}
                    <p className="text-xs text-stone-400">
                      {new Date(update.createdAt).toLocaleDateString()} at {new Date(update.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
              ))}
              {(!agentDashboard?.recentUpdates?.length && agentDashboard) && (
                <div className="py-8 text-center flex flex-col items-center gap-3">
                  <div className="w-10 h-10 bg-stone-100 rounded-full flex items-center justify-center text-stone-400">
                    <ClipboardList size={20} />
                  </div>
                  <p className="text-stone-500 text-sm">No recent updates</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
