 import { ReactNode } from 'react';
 import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
 import { Badge } from '@/components/ui/badge';
 import { ProcessingIndicator } from './ProcessingIndicator';
 import { cn } from '@/lib/utils';
 import { CheckCircle2, Circle } from 'lucide-react';
 
 export type ModuleColor = 'planner' | 'executor' | 'critic' | 'refiner' | 'complete';
 
 interface AgentModuleCardProps {
   title: string;
   icon: ReactNode;
   color: ModuleColor;
   isActive: boolean;
   isComplete: boolean;
   isPending: boolean;
   processingLabel?: string;
   statusLabel?: string;
   children: ReactNode;
 }
 
 const colorStyles: Record<ModuleColor, {
   ring: string;
   shadow: string;
   iconBg: string;
   badge: string;
 }> = {
   planner: {
     ring: 'ring-2 ring-agent-planner',
     shadow: 'shadow-lg shadow-agent-planner/20',
     iconBg: 'bg-agent-planner/10',
     badge: 'bg-agent-planner text-white'
   },
   executor: {
     ring: 'ring-2 ring-agent-executor',
     shadow: 'shadow-lg shadow-agent-executor/20',
     iconBg: 'bg-agent-executor/10',
     badge: 'bg-agent-executor text-white'
   },
   critic: {
     ring: 'ring-2 ring-agent-critic',
     shadow: 'shadow-lg shadow-agent-critic/20',
     iconBg: 'bg-agent-critic/10',
     badge: 'bg-agent-critic text-white'
   },
   refiner: {
     ring: 'ring-2 ring-agent-refiner',
     shadow: 'shadow-lg shadow-agent-refiner/20',
     iconBg: 'bg-agent-refiner/10',
     badge: 'bg-agent-refiner text-white'
   },
   complete: {
     ring: 'ring-2 ring-agent-complete',
     shadow: 'shadow-lg shadow-agent-complete/20',
     iconBg: 'bg-agent-complete/10',
     badge: 'bg-agent-complete text-white'
   }
 };
 
 export function AgentModuleCard({
   title,
   icon,
   color,
   isActive,
   isComplete,
   isPending,
   processingLabel = 'Processing...',
   statusLabel,
   children
 }: AgentModuleCardProps) {
   const styles = colorStyles[color];
 
   return (
     <Card className={cn(
       "transition-all duration-500 relative overflow-hidden",
       isActive && [styles.ring, styles.shadow, "scale-[1.01]"],
       isComplete && "border-agent-complete/30",
       isPending && "opacity-50"
     )}>
       {/* Active glow effect */}
       {isActive && (
         <div className={cn(
           "absolute inset-0 bg-gradient-to-br opacity-5 pointer-events-none",
           `from-agent-${color} to-transparent`
         )} />
       )}
       
       <CardHeader className="pb-4">
         <div className="flex items-center justify-between">
           <CardTitle className="flex items-center gap-3">
             <div className={cn(
               "p-2 rounded-lg transition-all duration-300",
               styles.iconBg,
               isActive && "animate-pulse-ring"
             )}>
               {icon}
             </div>
             <span className="text-base font-semibold">{title}</span>
           </CardTitle>
           
           <div className="flex items-center gap-2">
             {isActive && (
               <ProcessingIndicator 
                 label={processingLabel} 
                 isActive={true} 
                 color={color} 
               />
             )}
             {isComplete && !isActive && (
               <Badge variant="outline" className="gap-1.5 border-agent-complete/50 text-agent-complete">
                 <CheckCircle2 className="h-3 w-3" />
                 {statusLabel || 'Done'}
               </Badge>
             )}
             {isPending && !isActive && (
               <Badge variant="outline" className="gap-1.5 text-muted-foreground">
                 <Circle className="h-3 w-3" />
                 Pending
               </Badge>
             )}
           </div>
         </div>
       </CardHeader>
       
       <CardContent className="relative">
         {children}
       </CardContent>
     </Card>
   );
 }