import { useAgent } from '@/hooks/useAgent';
import { GoalInput } from './GoalInput';
import { PhaseIndicator } from './PhaseIndicator';
import { PlannerCard } from './PlannerCard';
import { ExecutorCard } from './ExecutorCard';
import { CriticCard } from './CriticCard';
import { RefinementCard } from './RefinementCard';
import { MemoryPanel } from './MemoryPanel';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Target, RotateCcw } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';

export function AgentDashboard() {
  const {
    state,
    memory,
    isProcessing,
    processGoal,
    reset,
    clearMemory,
    exampleGoals
  } = useAgent();

  return (
    <div className="flex h-full gap-6">
      {/* Main Content */}
      <div className="flex-1 flex flex-col gap-6 min-w-0">
        {/* Goal Input */}
        <GoalInput
          onSubmit={processGoal}
          isProcessing={isProcessing}
          exampleGoals={exampleGoals}
        />

        {/* Current Goal Display */}
        {state.goal && (
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2 text-base">
                  <Target className="h-5 w-5 text-primary" />
                  Current Goal
                </CardTitle>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary">
                    {state.phase === 'idle' ? 'Ready' : state.phase}
                  </Badge>
                  {state.phase === 'complete' && (
                    <Button variant="ghost" size="sm" onClick={reset}>
                      <RotateCcw className="h-4 w-4 mr-1" />
                      New Goal
                    </Button>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground italic">
                "{state.goal}"
              </p>
            </CardContent>
          </Card>
        )}

        {/* Phase Indicator */}
        <PhaseIndicator currentPhase={state.phase} />

        {/* Agent Module Cards */}
        {state.phase !== 'idle' && (
          <ScrollArea className="flex-1">
            <div className="space-y-4 pb-6">
              <PlannerCard
                output={state.plannerOutput}
                isActive={state.phase === 'planning'}
              />

              <ExecutorCard
                outputs={state.executorOutputs}
                isActive={state.phase === 'executing'}
              />

              <CriticCard
                output={state.criticOutput}
                isActive={state.phase === 'critiquing'}
              />

              <RefinementCard
                output={state.refinementOutput}
                isActive={state.phase === 'refining'}
                isComplete={state.phase === 'complete'}
              />
            </div>
          </ScrollArea>
        )}
      </div>

      {/* Memory Panel */}
      <div className="w-80 shrink-0 hidden lg:block">
        <MemoryPanel memory={memory} onClear={clearMemory} />
      </div>
    </div>
  );
}
