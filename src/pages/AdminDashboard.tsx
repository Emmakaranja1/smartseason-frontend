import { useEffect } from 'react';
import { useDashboardStore } from '../store/dashboardStore';
import { StatCard } from '../components/custom/StatCard';
import { 
  Users, 
  Map as MapIcon, 
  AlertTriangle, 
  CheckCircle2, 
  Leaf
} from 'lucide-react';
import { motion } from 'framer-motion';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription 
} from '../components/ui/card';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '../components/ui/table';
import { Button } from '../components/ui/button';
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
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
};

export const AdminDashboard = () => {
  const { stats, loading, fetchStats } = useDashboardStore();

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  if (loading && !stats) {
    return (
      <div className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-32 w-full rounded-2xl" />
          ))}
        </div>
        <Skeleton className="h-[400px] w-full rounded-2xl" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold text-stone-900 tracking-tight">Admin Overview</h2>
        <p className="text-stone-500 mt-1">Real-time agricultural intelligence and coordination.</p>
      </div>

      <motion.div 
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch"
      >
        <motion.div variants={item}>
          <StatCard 
            title="Total Fields" 
            value={stats?.totalFields || 0} 
            icon={MapIcon} 
            colorClass="bg-emerald-600"
            trend={{ value: 12, isPositive: true }}
          />
        </motion.div>
        <motion.div variants={item}>
          <StatCard 
            title="Active Growth" 
            value={stats?.activeFields || 0} 
            icon={Leaf} 
            colorClass="bg-emerald-500"
          />
        </motion.div>
        <motion.div variants={item}>
          <StatCard 
            title="At Risk" 
            value={stats?.atRiskFields || 0} 
            icon={AlertTriangle} 
            colorClass="bg-amber-500"
            trend={{ value: 5, isPositive: false }}
          />
        </motion.div>
        <motion.div variants={item}>
          <StatCard 
            title="Harvested" 
            value={stats?.completedFields || 0} 
            icon={CheckCircle2} 
            colorClass="bg-stone-800"
          />
        </motion.div>
      </motion.div>

      <div className="space-y-8">
        <Card className="border-stone-200 shadow-sm rounded-2xl overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between pb-6">
            <div>
              <CardTitle className="text-xl font-bold">Field Agents Activity</CardTitle>
              <CardDescription>Recent coordination and updates per agent.</CardDescription>
            </div>
            <Button variant="outline" size="sm" className="rounded-lg h-9">
              <Users size={16} className="mr-2" />
              Manage All
            </Button>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader className="bg-stone-50/50">
                <TableRow>
                  <TableHead className="pl-6 w-[250px]">Agent</TableHead>
                  <TableHead>Total Fields</TableHead>
                  <TableHead>Last Update</TableHead>
                  <TableHead className="text-right pr-6">Performance</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {stats?.agentActivity?.map((agent) => (
                  <TableRow key={agent.agentId} className="hover:bg-stone-50/50 transition-colors">
                    <TableCell className="pl-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-stone-100 flex items-center justify-center font-bold text-xs text-stone-600">
                          A
                        </div>
                        <span className="font-medium text-stone-900">Agent #{agent.agentId}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      {stats.fieldsPerAgent?.find(f => f.agentId === agent.agentId)?.count || 0} assigned
                    </TableCell>
                    <TableCell className="text-stone-500 text-sm">{agent.updates} total updates</TableCell>
                    <TableCell className="text-right pr-6">
                      <div className="flex items-center justify-end gap-2">
                        <div className="w-24 h-2 bg-stone-100 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-emerald-500 rounded-full" 
                            style={{ width: `${Math.min(agent.updates * 10, 100)}%` }} 
                          />
                        </div>
                        <span className="text-xs font-bold text-stone-600">{Math.min(agent.updates * 10, 100)}%</span>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                {!stats?.agentActivity?.length && (
                   <TableRow>
                    <TableCell colSpan={4} className="h-48 text-center text-stone-500">
                      <div className="flex flex-col items-center gap-2">
                        <Users size={32} className="text-stone-200" />
                        <p>No active field agents found</p>
                      </div>
                    </TableCell>
                   </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
