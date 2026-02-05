import { useAgent } from '@/hooks/useAgent';
import { GoalInput } from './GoalInput';
import { PhaseIndicator } from './PhaseIndicator';
import { PlannerCard } from './PlannerCard';
import { ExecutorCard } from './ExecutorCard';
import { CriticCard } from './CriticCard';
import { RefinementCard } from './RefinementCard';
import { MemoryPanel } from './MemoryPanel';
import { FinalOutputCard } from './FinalOutputCard';
import { ModuleConnector } from './ModuleConnector';
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

  const getPhaseIndex = (phase: string) => {
    const phases = ['idle', 'planning', 'executing', 'critiquing', 'refining', 'complete'];
    return phases.indexOf(phase);
  };

  const currentPhaseIndex = getPhaseIndex(state.phase);

  const isModuleComplete = (modulePhase: string) => {
    return getPhaseIndex(state.phase) > getPhaseIndex(modulePhase);
  };

  const isModuleActive = (modulePhase: string) => {
    return state.phase === modulePhase;
  };

  const isModulePending = (modulePhase: string) => {
    return getPhaseIndex(state.phase) < getPhaseIndex(modulePhase);
  };

  // Determine goal type for final output
  const goalType = state.goal.toLowerCase().includes('internship') || 
                   state.goal.toLowerCase().includes('fake') ||
                   state.goal.toLowerCase().includes('legitimate')
                   ? 'internship' : 'fibonacci';

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
          <Card className="border-primary/20 bg-gradient-to-r from-primary/5 to-transparent">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2 text-base">
                  <Target className="h-5 w-5 text-primary" />
                  Current Goal
                </CardTitle>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="capitalize">
                    {state.phase === 'idle' ? 'Ready' : state.phase === 'complete' ? '✓ Complete' : `${state.phase}...`}
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
              <p className="text-sm font-medium">
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
              {/* Planner */}
              <PlannerCard
                output={state.plannerOutput}
                isActive={isModuleActive('planning')}
                isComplete={isModuleComplete('planning')}
                isPending={isModulePending('planning')}
              />

              <ModuleConnector 
                isActive={isModuleActive('executing')} 
                isComplete={isModuleComplete('executing')} 
              />

              {/* Executor */}
              <ExecutorCard
                outputs={state.executorOutputs}
                isActive={isModuleActive('executing')}
                isComplete={isModuleComplete('executing')}
                isPending={isModulePending('executing')}
              />

              <ModuleConnector 
                isActive={isModuleActive('critiquing')} 
                isComplete={isModuleComplete('critiquing')} 
              />

              {/* Critic */}
              <CriticCard
                output={state.criticOutput}
                isActive={isModuleActive('critiquing')}
                isComplete={isModuleComplete('critiquing')}
                isPending={isModulePending('critiquing')}
              />

              <ModuleConnector 
                isActive={isModuleActive('refining')} 
                isComplete={isModuleComplete('refining')} 
              />

              {/* Refiner */}
              <RefinementCard
                output={state.refinementOutput}
                isActive={isModuleActive('refining')}
                isComplete={isModuleComplete('refining')}
                isPending={isModulePending('refining')}
              />

              {/* Final Output */}
              {state.phase === 'complete' && state.refinementOutput && (
                <>
                  <ModuleConnector isComplete={true} />
                  <FinalOutputCard 
                    output={state.refinementOutput} 
                    goalType={goalType}
                  />
                </>
              )}
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
