import { Card, CardContent } from '../components/ui/card';
import type { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  description?: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  colorClass?: string;
}

export const StatCard = ({ title, value, icon: Icon, description, trend, colorClass = "bg-emerald-500" }: StatCardProps) => {
  return (
    <Card className="overflow-hidden border-stone-200 bg-white group hover:shadow-lg transition-all duration-300 rounded-2xl">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-stone-500 uppercase tracking-wider">{title}</p>
            <h3 className="text-3xl font-bold text-stone-900 mt-1">{value}</h3>
            {description && (
              <p className="text-xs text-stone-400 mt-1">{description}</p>
            )}
          </div>
          <div className={`w-12 h-12 ${colorClass} rounded-2xl flex items-center justify-center text-white shadow-lg shadow-current/10 -rotate-3 transition-transform group-hover:rotate-0`}>
            <Icon size={24} />
          </div>
        </div>
        {trend && (
          <div className="mt-4 flex items-center gap-2">
            <span className={`text-xs font-bold px-1.5 py-0.5 rounded ${trend.isPositive ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
              {trend.isPositive ? '+' : '-'}{trend.value}%
            </span>
            <span className="text-xs text-stone-400">from last month</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
};