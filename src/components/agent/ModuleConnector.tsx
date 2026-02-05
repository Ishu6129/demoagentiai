 import { cn } from '@/lib/utils';
 import { ChevronRight } from 'lucide-react';
 
 interface ModuleConnectorProps {
   isActive?: boolean;
   isComplete?: boolean;
   direction?: 'horizontal' | 'vertical';
 }
 
 export function ModuleConnector({ 
   isActive = false, 
   isComplete = false,
   direction = 'vertical' 
 }: ModuleConnectorProps) {
   if (direction === 'horizontal') {
     return (
       <div className="flex items-center justify-center px-2">
         <div className={cn(
           "h-0.5 w-8 rounded-full transition-all duration-500",
           isComplete && "bg-agent-complete",
           isActive && "bg-gradient-to-r from-primary to-primary/50 animate-flow-line bg-[length:200%_100%]",
           !isActive && !isComplete && "bg-border"
         )} />
         <ChevronRight className={cn(
           "h-4 w-4 transition-colors",
           isComplete && "text-agent-complete",
           isActive && "text-primary animate-pulse",
           !isActive && !isComplete && "text-muted-foreground/50"
         )} />
       </div>
     );
   }
 
   return (
     <div className="flex flex-col items-center py-2">
       <div className={cn(
         "w-0.5 h-6 rounded-full transition-all duration-500",
         isComplete && "bg-agent-complete",
         isActive && "bg-gradient-to-b from-primary to-primary/50 animate-flow-line bg-[length:100%_200%]",
         !isActive && !isComplete && "bg-border"
       )} />
       <div className={cn(
         "w-2 h-2 rounded-full transition-all duration-300",
         isComplete && "bg-agent-complete",
         isActive && "bg-primary animate-pulse",
         !isActive && !isComplete && "bg-muted-foreground/30"
       )} />
       <div className={cn(
         "w-0.5 h-6 rounded-full transition-all duration-500",
         isComplete && "bg-agent-complete",
         isActive && "bg-gradient-to-b from-primary/50 to-primary animate-flow-line bg-[length:100%_200%]",
         !isActive && !isComplete && "bg-border"
       )} />
     </div>
   );
 }