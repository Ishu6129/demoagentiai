import { AgentModuleCard } from './AgentModuleCard';
import { RefreshCw, CheckCircle2 } from 'lucide-react';
import { RefinementOutput } from '@/types/agent';

interface RefinementCardProps {
  output: RefinementOutput | null;
  isActive: boolean;
  isComplete: boolean;
  isPending: boolean;
}

export function RefinementCard({ output, isActive, isComplete, isPending }: RefinementCardProps) {
  return (
    <AgentModuleCard
      title="Refiner Module"
      icon={<RefreshCw className={`h-5 w-5 text-agent-refiner ${isActive ? 'animate-spin' : ''}`} />}
      color="refiner"
      isActive={isActive}
      isComplete={isComplete}
      isPending={isPending}
      processingLabel="Applying improvements..."
      statusLabel={output ? `${output.improvements.length} improvements` : undefined}
    >
      {output ? (
        <div className="space-y-4">
          {/* Improvements Applied */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold">Improvements Applied</h4>
            <div className="grid gap-2">
              {output.improvements.map((improvement, index) => (
                <div 
                  key={index}
                  className="flex items-start gap-3 p-2.5 rounded-lg bg-agent-refiner/5 border border-agent-refiner/10"
                >
                  <CheckCircle2 className="h-4 w-4 text-agent-refiner mt-0.5 shrink-0" />
                  <span className="text-sm">{improvement}</span>
                </div>
              ))}
            </div>
          </div>

          <p className="text-sm text-muted-foreground italic text-center">
            View final output below ↓
          </p>
        </div>
      ) : (
        <div className="h-24 flex items-center justify-center text-muted-foreground text-sm">
          Waiting for critic feedback...
        </div>
      )}
    </AgentModuleCard>
  );
}
