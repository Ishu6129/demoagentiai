import { useState, useEffect } from 'react';
import { usePersistedWorkflow } from '@/hooks/usePersistedWorkflow';
import { GoalInput } from './GoalInput';
import { MemoryPanel } from './MemoryPanel';
import { WorkflowBuilder } from '@/components/workflow/WorkflowBuilder';
import { ChatOutput } from '@/components/chat/ChatOutput';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Target, RotateCcw, Workflow, MessageSquare, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

export function AgentDashboard() {
  const [activeTab, setActiveTab] = useState('workflow');
  
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
  } = usePersistedWorkflow();

  // Get enabled agent types for ChatOutput
  const enabledAgentTypes = agents.filter(a => a.enabled).map(a => a.type);

  // Auto-switch to output tab when processing starts
  useEffect(() => {
    if (state.phase !== 'idle') {
      setActiveTab('output');
    }
  }, [state.phase]);

  // Reset to workflow tab when reset
  const handleReset = () => {
    reset();
    setActiveTab('workflow');
  };

  const hasStarted = state.phase !== 'idle';

  return (
    <div className="flex h-full gap-6">
      {/* Main Content */}
      <div className="flex-1 flex flex-col gap-4 min-w-0">
        {/* Goal Input - Always visible */}
        <GoalInput
          onSubmit={processGoal}
          isProcessing={isProcessing}
          exampleGoals={exampleGoals}
        />

        {/* Workflow Builder & Output Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
          <div className="flex items-center justify-between">
            <TabsList className="bg-muted/50">
              <TabsTrigger value="workflow" className="gap-2 data-[state=active]:bg-background">
                <Workflow className="h-4 w-4" />
                Pipeline
              </TabsTrigger>
              <TabsTrigger 
                value="output" 
                className="gap-2 data-[state=active]:bg-background" 
                disabled={!hasStarted}
              >
                <MessageSquare className="h-4 w-4" />
                Output
                {hasStarted && (
                  <Badge 
                    variant="secondary" 
                    className={cn(
                      "ml-1 text-xs",
                      isProcessing && "animate-pulse bg-primary/20 text-primary"
                    )}
                  >
                    {state.phase === 'complete' ? '✓' : '●'}
                  </Badge>
                )}
              </TabsTrigger>
            </TabsList>

            {hasStarted && (
              <Button variant="outline" size="sm" onClick={handleReset} className="gap-2">
                <RotateCcw className="h-4 w-4" />
                New Task
              </Button>
            )}
          </div>

          {/* Workflow Builder Tab */}
          <TabsContent value="workflow" className="flex-1 mt-4">
            <WorkflowBuilder
              agents={agents}
              currentPhase={state.phase}
              onAgentsChange={setAgents}
              onRun={() => {}}
              onReset={handleReset}
              isProcessing={isProcessing}
              goal={state.goal || undefined}
            />
          </TabsContent>

          {/* Agent Output Tab - ChatGPT-like */}
          <TabsContent value="output" className="flex-1 mt-4">
            {hasStarted && (
              <Card className="h-full border-0 shadow-none bg-transparent">
                {/* Current Goal Header */}
                {state.goal && (
                  <CardHeader className="pb-4 px-0 pt-0">
                    <div className="flex items-center justify-between">
                      <CardTitle className="flex items-center gap-2 text-base">
                        <div className="p-2 rounded-lg bg-primary/10">
                          <Target className="h-4 w-4 text-primary" />
                        </div>
                        <span className="font-medium">Task in Progress</span>
                      </CardTitle>
                      <div className="flex items-center gap-2">
                        <Badge 
                          variant="outline" 
                          className={cn(
                            "capitalize",
                            state.phase === 'complete' && "border-[hsl(var(--agent-complete))] text-[hsl(var(--agent-complete))] bg-[hsl(var(--agent-complete))]/10"
                          )}
                        >
                          {state.phase === 'complete' ? (
                            <><Sparkles className="h-3 w-3 mr-1" /> Completed</>
                          ) : (
                            <><span className="animate-pulse mr-1">●</span> {state.phase}</>
                          )}
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                )}
                
                <CardContent className="px-0">
                  <ChatOutput 
                    state={state} 
                    enabledAgents={enabledAgentTypes}
                  />
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>

      {/* Memory Panel - Sidebar */}
      <div className="w-80 shrink-0 hidden lg:block">
        <MemoryPanel memory={memory} onClear={clearMemory} />
      </div>
    </div>
  );
}
