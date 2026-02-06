import { useWorkflow } from '@/hooks/useWorkflow';
import { GoalInput } from './GoalInput';
import { PhaseIndicator } from './PhaseIndicator';
import { PlannerCard } from './PlannerCard';
import { ExecutorCard } from './ExecutorCard';
import { CriticCard } from './CriticCard';
import { RefinementCard } from './RefinementCard';
import { MemoryPanel } from './MemoryPanel';
import { FinalOutputCard } from './FinalOutputCard';
import { ModuleConnector } from './ModuleConnector';
import { WorkflowBuilder } from '@/components/workflow/WorkflowBuilder';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Target, RotateCcw, Workflow, Eye } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';

export function AgentDashboard() {
  const {
    agents,
    setAgents,
    state,
    memory,
    isProcessing,
    skippedAgents,
    processGoal,
    reset,
    clearMemory,
    exampleGoals
  } = useWorkflow();

  const getPhaseIndex = (phase: string) => {
    const phases = ['idle', 'planning', 'executing', 'critiquing', 'refining', 'complete'];
    return phases.indexOf(phase);
  };

  const isModuleComplete = (modulePhase: string) => {
    return getPhaseIndex(state.phase) > getPhaseIndex(modulePhase);
  };

  const isModuleActive = (modulePhase: string) => {
    return state.phase === modulePhase;
  };

  const isModulePending = (modulePhase: string) => {
    return getPhaseIndex(state.phase) < getPhaseIndex(modulePhase);
  };

  const isAgentEnabled = (type: string) => {
    return agents.find(a => a.type === type)?.enabled ?? false;
  };

  const goalType = state.goal.toLowerCase().includes('internship') || 
                   state.goal.toLowerCase().includes('fake') ||
                   state.goal.toLowerCase().includes('legitimate')
                   ? 'internship' : 'fibonacci';

  const hasStarted = state.phase !== 'idle';

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

        {/* Workflow Builder & Output Tabs */}
        <Tabs defaultValue="workflow" className="flex-1 flex flex-col">
          <TabsList className="w-fit">
            <TabsTrigger value="workflow" className="gap-2">
              <Workflow className="h-4 w-4" />
              Workflow Builder
            </TabsTrigger>
            <TabsTrigger value="output" className="gap-2" disabled={!hasStarted}>
              <Eye className="h-4 w-4" />
              Agent Output
              {hasStarted && (
                <Badge variant="secondary" className="ml-1 text-xs capitalize">
                  {state.phase === 'complete' ? '✓' : '...'}
                </Badge>
              )}
            </TabsTrigger>
          </TabsList>

          {/* Workflow Builder Tab */}
          <TabsContent value="workflow" className="flex-1 mt-4">
            <WorkflowBuilder
              agents={agents}
              currentPhase={state.phase}
              onAgentsChange={setAgents}
              onRun={() => {}}
              onReset={reset}
              isProcessing={isProcessing}
              goal={state.goal || undefined}
            />
          </TabsContent>

          {/* Agent Output Tab */}
          <TabsContent value="output" className="flex-1 mt-4">
            {hasStarted && (
              <div className="space-y-4">
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
                            {state.phase === 'complete' ? '✓ Complete' : `${state.phase}...`}
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
                      <p className="text-sm font-medium">"{state.goal}"</p>
                    </CardContent>
                  </Card>
                )}

                {/* Phase Indicator */}
                <PhaseIndicator currentPhase={state.phase} />

                {/* Agent Module Cards */}
                <ScrollArea className="flex-1">
                  <div className="space-y-4 pb-6">
                    {/* Planner */}
                    {isAgentEnabled('planner') && (
                      <>
                        <PlannerCard
                          output={state.plannerOutput}
                          isActive={isModuleActive('planning')}
                          isComplete={isModuleComplete('planning')}
                          isPending={isModulePending('planning')}
                        />
                        {isAgentEnabled('executor') && (
                          <ModuleConnector 
                            isActive={isModuleActive('executing')} 
                            isComplete={isModuleComplete('executing')} 
                          />
                        )}
                      </>
                    )}

                    {/* Executor */}
                    {isAgentEnabled('executor') && (
                      <>
                        <ExecutorCard
                          outputs={state.executorOutputs}
                          isActive={isModuleActive('executing')}
                          isComplete={isModuleComplete('executing')}
                          isPending={isModulePending('executing')}
                        />
                        {isAgentEnabled('critic') && (
                          <ModuleConnector 
                            isActive={isModuleActive('critiquing')} 
                            isComplete={isModuleComplete('critiquing')} 
                          />
                        )}
                      </>
                    )}

                    {/* Critic */}
                    {isAgentEnabled('critic') && (
                      <>
                        <CriticCard
                          output={state.criticOutput}
                          isActive={isModuleActive('critiquing')}
                          isComplete={isModuleComplete('critiquing')}
                          isPending={isModulePending('critiquing')}
                        />
                        {isAgentEnabled('refiner') && (
                          <ModuleConnector 
                            isActive={isModuleActive('refining')} 
                            isComplete={isModuleComplete('refining')} 
                          />
                        )}
                      </>
                    )}

                    {/* Refiner */}
                    {isAgentEnabled('refiner') && (
                      <RefinementCard
                        output={state.refinementOutput}
                        isActive={isModuleActive('refining')}
                        isComplete={isModuleComplete('refining')}
                        isPending={isModulePending('refining')}
                      />
                    )}

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

                    {/* Show skipped agents notice */}
                    {skippedAgents.length > 0 && state.phase === 'complete' && (
                      <Card className="border-muted">
                        <CardContent className="py-4">
                          <p className="text-sm text-muted-foreground">
                            Skipped agents: {skippedAgents.map(a => a.charAt(0).toUpperCase() + a.slice(1)).join(', ')}
                          </p>
                        </CardContent>
                      </Card>
                    )}
                  </div>
                </ScrollArea>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>

      {/* Memory Panel */}
      <div className="w-80 shrink-0 hidden lg:block">
        <MemoryPanel memory={memory} onClear={clearMemory} />
      </div>
    </div>
  );
}
