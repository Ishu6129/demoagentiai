import { cn } from '@/lib/utils';
import { AgentPhase } from '@/types/agent';
import { Brain, Cog, MessageSquare, RefreshCw, CheckCircle } from 'lucide-react';

interface PhaseIndicatorProps {
  currentPhase: AgentPhase;
}

const phases = [
  { key: 'planning', label: 'Planning', icon: Brain, color: 'text-blue-500', bg: 'bg-blue-500' },
  { key: 'executing', label: 'Executing', icon: Cog, color: 'text-yellow-500', bg: 'bg-yellow-500' },
  { key: 'critiquing', label: 'Critiquing', icon: MessageSquare, color: 'text-orange-500', bg: 'bg-orange-500' },
  { key: 'refining', label: 'Refining', icon: RefreshCw, color: 'text-purple-500', bg: 'bg-purple-500' },
  { key: 'complete', label: 'Complete', icon: CheckCircle, color: 'text-green-500', bg: 'bg-green-500' },
] as const;

export function PhaseIndicator({ currentPhase }: PhaseIndicatorProps) {
  if (currentPhase === 'idle') return null;

  const getPhaseIndex = (phase: AgentPhase) => {
    return phases.findIndex(p => p.key === phase);
  };

  const currentIndex = getPhaseIndex(currentPhase);

  return (
    <div className="w-full py-4">
      <div className="flex items-center justify-between relative">
        {/* Progress line */}
        <div className="absolute left-0 right-0 top-1/2 h-1 bg-muted -translate-y-1/2 z-0">
          <div 
            className="h-full bg-primary transition-all duration-500 ease-out"
            style={{ width: `${(currentIndex / (phases.length - 1)) * 100}%` }}
          />
        </div>

        {/* Phase dots */}
        {phases.map((phase, index) => {
          const Icon = phase.icon;
          const isActive = phase.key === currentPhase;
          const isCompleted = index < currentIndex;
          
          return (
            <div
              key={phase.key}
              className="relative z-10 flex flex-col items-center gap-2"
            >
              <div
                className={cn(
                  "w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300",
                  isActive && `${phase.bg} text-white shadow-lg animate-pulse`,
                  isCompleted && "bg-primary text-primary-foreground",
                  !isActive && !isCompleted && "bg-muted text-muted-foreground"
                )}
              >
                <Icon className={cn("h-5 w-5", isActive && "animate-spin-slow")} />
              </div>
              <span 
                className={cn(
                  "text-xs font-medium transition-colors",
                  isActive && phase.color,
                  isCompleted && "text-primary",
                  !isActive && !isCompleted && "text-muted-foreground"
                )}
              >
                {phase.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
