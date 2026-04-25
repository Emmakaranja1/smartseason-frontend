import { Badge } from '../ui/badge';
import { FieldStatus, FieldStage } from '../../types';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface StatusBadgeProps {
  status: FieldStatus;
  className?: string;
}

export const StatusBadge = ({ status, className }: StatusBadgeProps) => {
  const variants = {
    [FieldStatus.ACTIVE]: "bg-emerald-100 text-emerald-700 border-emerald-200",
    [FieldStatus.AT_RISK]: "bg-amber-100 text-amber-700 border-amber-200",
    [FieldStatus.COMPLETED]: "bg-stone-100 text-stone-700 border-stone-200",
  };

  const labels = {
    [FieldStatus.ACTIVE]: "Active",
    [FieldStatus.AT_RISK]: "At Risk",
    [FieldStatus.COMPLETED]: "Completed",
  };

  return (
    <Badge 
      variant="outline" 
      className={cn("px-2.5 py-0.5 font-semibold text-[10px] uppercase tracking-wider rounded-full border shadow-sm", variants[status], className)}
    >
      <span className={cn("w-1.5 h-1.5 rounded-full mr-1.5", {
        "bg-emerald-500 animate-pulse": status === FieldStatus.ACTIVE,
        "bg-amber-500": status === FieldStatus.AT_RISK,
        "bg-stone-500": status === FieldStatus.COMPLETED,
      })} />
      {labels[status]}
    </Badge>
  );
};

interface StageBadgeProps {
  stage: FieldStage;
  className?: string;
}

export const StageBadge = ({ stage, className }: StageBadgeProps) => {
  const variants = {
    [FieldStage.PLANTED]: "bg-blue-50 text-blue-700 border-blue-100",
    [FieldStage.GROWING]: "bg-emerald-50 text-emerald-700 border-emerald-100",
    [FieldStage.READY]: "bg-amber-50 text-amber-700 border-amber-100",
    [FieldStage.HARVESTED]: "bg-stone-50 text-stone-700 border-stone-100",
  };

  const labels = {
    [FieldStage.PLANTED]: "Planted",
    [FieldStage.GROWING]: "Growing",
    [FieldStage.READY]: "Ready",
    [FieldStage.HARVESTED]: "Harvested",
  };

  return (
    <Badge 
      variant="outline" 
      className={cn("px-2.5 py-0.5 font-medium text-xs rounded-lg border", variants[stage], className)}
    >
      {labels[stage]}
    </Badge>
  );
};
