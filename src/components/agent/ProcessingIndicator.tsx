 import { cn } from '@/lib/utils';
 import { Loader2 } from 'lucide-react';
 
 interface ProcessingIndicatorProps {
   label: string;
   isActive: boolean;
   color?: 'planner' | 'executor' | 'critic' | 'refiner' | 'complete';
 }
 
 const colorClasses = {
   planner: {
     bg: 'bg-agent-planner/10',
     border: 'border-agent-planner/30',
     text: 'text-agent-planner',
     ring: 'ring-agent-planner/50'
   },
   executor: {
     bg: 'bg-agent-executor/10',
     border: 'border-agent-executor/30',
     text: 'text-agent-executor',
     ring: 'ring-agent-executor/50'
   },
   critic: {
     bg: 'bg-agent-critic/10',
     border: 'border-agent-critic/30',
     text: 'text-agent-critic',
     ring: 'ring-agent-critic/50'
   },
   refiner: {
     bg: 'bg-agent-refiner/10',
     border: 'border-agent-refiner/30',
     text: 'text-agent-refiner',
     ring: 'ring-agent-refiner/50'
   },
   complete: {
     bg: 'bg-agent-complete/10',
     border: 'border-agent-complete/30',
     text: 'text-agent-complete',
     ring: 'ring-agent-complete/50'
   }
 };
 
 export function ProcessingIndicator({ label, isActive, color = 'planner' }: ProcessingIndicatorProps) {
   if (!isActive) return null;
 
   const colors = colorClasses[color];
 
   return (
     <div className={cn(
       "flex items-center gap-2 px-3 py-1.5 rounded-full border text-sm font-medium",
       colors.bg,
       colors.border,
       colors.text
     )}>
       <Loader2 className="h-3.5 w-3.5 animate-spin" />
       <span>{label}</span>
     </div>
   );
 }