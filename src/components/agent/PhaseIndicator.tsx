import { cn } from '@/lib/utils';
import { AgentPhase } from '@/types/agent';
import { Brain, Cog, MessageSquare, RefreshCw, CheckCircle2, ChevronRight } from 'lucide-react';

interface PhaseIndicatorProps {
  currentPhase: AgentPhase;
}

const phases = [
  { key: 'planning', label: 'Planner', icon: Brain, color: 'text-agent-planner', bg: 'bg-agent-planner' },
  { key: 'executing', label: 'Executor', icon: Cog, color: 'text-agent-executor', bg: 'bg-agent-executor' },
  { key: 'critiquing', label: 'Critic', icon: MessageSquare, color: 'text-agent-critic', bg: 'bg-agent-critic' },
  { key: 'refining', label: 'Refiner', icon: RefreshCw, color: 'text-agent-refiner', bg: 'bg-agent-refiner' },
  { key: 'complete', label: 'Output', icon: CheckCircle2, color: 'text-agent-complete', bg: 'bg-agent-complete' },
] as const;

export function PhaseIndicator({ currentPhase }: PhaseIndicatorProps) {
  if (currentPhase === 'idle') return null;

  const getPhaseIndex = (phase: AgentPhase) => {
    return phases.findIndex(p => p.key === phase);
  };

  const currentIndex = getPhaseIndex(currentPhase);

  return (
    <div className="w-full py-6 px-4">
      <div className="flex items-center justify-center gap-1">
        {/* Phase dots */}
        {phases.map((phase, index, arr) => {
          const Icon = phase.icon;
          const isActive = phase.key === currentPhase;
          const isCompleted = index < currentIndex;
          const isLast = index === arr.length - 1;
          
          return (
            <div key={phase.key} className="flex items-center">
              <div className="flex flex-col items-center gap-2">
                <div
                  className={cn(
                    "relative w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-500",
                    isActive && `${phase.bg} text-white shadow-lg shadow-current/30`,
                    isCompleted && "bg-agent-complete/20 text-agent-complete border-2 border-agent-complete/30",
                    !isActive && !isCompleted && "bg-muted text-muted-foreground border-2 border-transparent"
                  )}
                >
                  {isActive && (
                    <div className={cn(
                      "absolute inset-0 rounded-xl animate-ping opacity-30",
                      phase.bg
                    )} />
                  )}
                  <Icon className={cn(
                    "h-5 w-5 relative z-10",
                    isActive && "animate-spin-slow"
                  )} />
                </div>
                <span 
                  className={cn(
                    "text-xs font-semibold transition-colors",
                    isActive && phase.color,
                    isCompleted && "text-agent-complete",
                    !isActive && !isCompleted && "text-muted-foreground"
                  )}
                >
                  {phase.label}
                </span>
              </div>
              
              {/* Connector */}
              {!isLast && (
                <div className="flex items-center mx-2 -mt-6">
                  <div className={cn(
                    "h-0.5 w-6 transition-all duration-500",
                    isCompleted && "bg-agent-complete",
                    isActive && "bg-gradient-to-r from-current to-muted animate-flow-line bg-[length:200%_100%]",
                    !isActive && !isCompleted && "bg-border"
                  )} />
                  <ChevronRight className={cn(
                    "h-4 w-4 -ml-1 transition-colors",
                    isCompleted && "text-agent-complete",
                    isActive && "text-muted-foreground animate-pulse",
                    !isActive && !isCompleted && "text-muted-foreground/30"
                  )} />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
