import { AgentModuleCard } from './AgentModuleCard';
import { Progress } from '@/components/ui/progress';
import { MessageSquare, CheckCircle2, AlertTriangle, XCircle } from 'lucide-react';
import { CriticOutput, CritiqueItem } from '@/types/agent';
import { cn } from '@/lib/utils';

interface CriticCardProps {
  output: CriticOutput | null;
  isActive: boolean;
  isComplete: boolean;
  isPending: boolean;
}

function SeverityIcon({ severity }: { severity: CritiqueItem['severity'] }) {
  switch (severity) {
    case 'pass':
      return <CheckCircle2 className="h-4 w-4 text-agent-complete" />;
    case 'warning':
      return <AlertTriangle className="h-4 w-4 text-agent-executor" />;
    case 'critical':
      return <XCircle className="h-4 w-4 text-destructive" />;
  }
}

export function CriticCard({ output, isActive, isComplete, isPending }: CriticCardProps) {
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-agent-complete';
    if (score >= 60) return 'text-agent-executor';
    return 'text-destructive';
  };

  const getScoreLabel = (score: number) => {
    if (score >= 80) return 'Excellent';
    if (score >= 60) return 'Needs Work';
    return 'Requires Revision';
  };

  return (
    <AgentModuleCard
      title="Critic Module"
      icon={<MessageSquare className="h-5 w-5 text-agent-critic" />}
      color="critic"
      isActive={isActive}
      isComplete={isComplete}
      isPending={isPending}
      processingLabel="Analyzing output..."
      statusLabel={output ? `Score: ${output.overallScore}` : undefined}
    >
      {output ? (
        <div className="space-y-4">
          {/* Quality Score */}
          <div className="p-4 rounded-lg bg-muted/30 border">
            <div className="flex items-center justify-between mb-3">
              <div>
                <span className="text-sm text-muted-foreground">Quality Score</span>
                <div className={cn("text-2xl font-bold", getScoreColor(output.overallScore))}>
                  {output.overallScore}/100
                </div>
              </div>
              <div className={cn(
                "px-3 py-1.5 rounded-full text-xs font-semibold",
                output.overallScore >= 80 && "bg-agent-complete/10 text-agent-complete",
                output.overallScore >= 60 && output.overallScore < 80 && "bg-agent-executor/10 text-agent-executor",
                output.overallScore < 60 && "bg-destructive/10 text-destructive"
              )}>
                {getScoreLabel(output.overallScore)}
              </div>
            </div>
            <Progress value={output.overallScore} className="h-2" />
          </div>

          {/* Critiques */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold">Feedback ({output.critiques.length} items)</h4>
            {output.critiques.map((critique) => (
              <div
                key={critique.id}
                className={cn(
                  "p-3 rounded-lg border transition-all",
                  critique.severity === 'pass' && "bg-agent-complete/5 border-agent-complete/20",
                  critique.severity === 'warning' && "bg-agent-executor/5 border-agent-executor/20",
                  critique.severity === 'critical' && "bg-destructive/5 border-destructive/20"
                )}
              >
                <div className="flex items-start gap-3">
                  <div className="mt-0.5">
                    <SeverityIcon severity={critique.severity} />
                  </div>
                  <div className="flex-1 space-y-1.5">
                    <div className="flex items-start justify-between gap-2">
                      <span className="text-sm font-medium leading-tight">{critique.issue}</span>
                      <span className={cn(
                        "text-[10px] px-2 py-0.5 rounded-full font-medium uppercase shrink-0",
                        critique.severity === 'pass' && "bg-agent-complete/20 text-agent-complete",
                        critique.severity === 'warning' && "bg-agent-executor/20 text-agent-executor",
                        critique.severity === 'critical' && "bg-destructive/20 text-destructive"
                      )}>
                        {critique.severity}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      💡 {critique.suggestion}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="h-24 flex items-center justify-center text-muted-foreground text-sm">
          Waiting for executor to complete...
        </div>
      )}
    </AgentModuleCard>
  );
}
