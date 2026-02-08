import { cn } from '@/lib/utils';
import { ChevronDown } from 'lucide-react';

interface WorkflowConnectorProps {
  isActive?: boolean;
  isComplete?: boolean;
  isEnabled?: boolean;
}

export function WorkflowConnector({ 
  isActive = false, 
  isComplete = false,
  isEnabled = true 
}: WorkflowConnectorProps) {
  return (
    <div className={cn(
      "flex flex-col items-center py-2 transition-all",
      !isEnabled && "opacity-30"
    )}>
      {/* Line with flow animation */}
      <div className={cn(
        "w-0.5 h-8 rounded-full transition-all duration-500",
        isComplete && "bg-[hsl(var(--agent-complete))]",
        isActive && "bg-gradient-to-b from-primary to-primary/50 animate-pulse",
        !isActive && !isComplete && "bg-border"
      )} />
      
      {/* Arrow indicator */}
      <div className={cn(
        "flex items-center justify-center w-6 h-6 rounded-full transition-all",
        isComplete && "bg-[hsl(var(--agent-complete))]/20 text-[hsl(var(--agent-complete))]",
        isActive && "bg-primary/20 text-primary animate-bounce",
        !isActive && !isComplete && "bg-muted text-muted-foreground"
      )}>
        <ChevronDown className="h-4 w-4" />
      </div>
      
      {/* Line after arrow */}
      <div className={cn(
        "w-0.5 h-8 rounded-full transition-all duration-500",
        isComplete && "bg-[hsl(var(--agent-complete))]",
        isActive && "bg-gradient-to-b from-primary/50 to-primary animate-pulse",
        !isActive && !isComplete && "bg-border"
      )} />
    </div>
  );
}
