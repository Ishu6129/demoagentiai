import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { WorkflowNode } from './WorkflowNode';
import { WorkflowConnector } from './WorkflowConnector';
import { AgentLibrary } from './AgentLibrary';
import { WorkflowAgent, AgentType, DEFAULT_AGENTS } from '@/types/workflow';
import { RotateCcw, Settings2, Target, Plus, ChevronDown, ChevronUp } from 'lucide-react';
import { cn } from '@/lib/utils';
import { AgentPhase } from '@/types/agent';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

interface WorkflowBuilderProps {
  agents: WorkflowAgent[];
  currentPhase: AgentPhase;
  onAgentsChange: (agents: WorkflowAgent[]) => void;
  onRun: () => void;
  onReset: () => void;
  isProcessing: boolean;
  goal?: string;
}

export function WorkflowBuilder({
  agents,
  currentPhase,
  onAgentsChange,
  onRun,
  onReset,
  isProcessing,
  goal
}: WorkflowBuilderProps) {
  const [showLibrary, setShowLibrary] = useState(false);

  const enabledAgents = agents.filter(a => a.enabled).sort((a, b) => a.position - b.position);
  const usedTypes = agents.map(a => a.type);
  const availableTypes: AgentType[] = (['planner', 'executor', 'critic', 'refiner'] as AgentType[])
    .filter(type => !usedTypes.includes(type));

  const handleToggle = (id: string) => {
    onAgentsChange(
      agents.map(a => a.id === id ? { ...a, enabled: !a.enabled } : a)
    );
  };

  const handleRemove = (id: string) => {
    onAgentsChange(agents.filter(a => a.id !== id));
  };

  const handleAddAgent = (type: AgentType) => {
    const template = DEFAULT_AGENTS.find(a => a.type === type);
    if (template) {
      const newAgent: WorkflowAgent = {
        ...template,
        id: `${type}-${Date.now()}`,
        position: agents.length
      };
      onAgentsChange([...agents, newAgent]);
    }
  };

  const getPhaseForAgent = (type: AgentType): AgentPhase => {
    switch (type) {
      case 'planner': return 'planning';
      case 'executor': return 'executing';
      case 'critic': return 'critiquing';
      case 'refiner': return 'refining';
    }
  };

  const isAgentActive = (type: AgentType) => {
    return getPhaseForAgent(type) === currentPhase;
  };

  const isAgentComplete = (type: AgentType) => {
    const phases: AgentPhase[] = ['idle', 'planning', 'executing', 'critiquing', 'refining', 'complete'];
    const agentPhase = getPhaseForAgent(type);
    return phases.indexOf(currentPhase) > phases.indexOf(agentPhase);
  };

  return (
    <div className="flex gap-4">
      {/* Main Workflow Canvas */}
      <Card className="flex-1 border-0 bg-muted/20">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <div className="p-1.5 rounded-md bg-primary/10">
                <Settings2 className="h-4 w-4 text-primary" />
              </div>
              Agent Pipeline
              <Badge variant="secondary" className="text-xs">
                {enabledAgents.length} active
              </Badge>
            </CardTitle>
            <div className="flex items-center gap-2">
              {availableTypes.length > 0 && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowLibrary(!showLibrary)}
                  className="gap-1.5 h-8"
                >
                  {showLibrary ? (
                    <ChevronUp className="h-4 w-4" />
                  ) : (
                    <Plus className="h-4 w-4" />
                  )}
                  {showLibrary ? 'Hide' : 'Add Agent'}
                </Button>
              )}
              {currentPhase !== 'idle' && (
                <Button variant="outline" size="sm" onClick={onReset} className="h-8">
                  <RotateCcw className="h-4 w-4 mr-1.5" />
                  Reset
                </Button>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Goal Display */}
          {goal && (
            <div className="mb-6 p-3 rounded-xl bg-primary/5 border border-primary/20">
              <div className="flex items-center gap-2 text-sm">
                <Target className="h-4 w-4 text-primary shrink-0" />
                <span className="font-medium text-muted-foreground">Current Goal:</span>
                <span className="truncate font-medium">{goal}</span>
              </div>
            </div>
          )}

          {/* Workflow Nodes */}
          <div className="flex flex-col items-center">
            {/* Start Node */}
            <div className={cn(
              "flex items-center justify-center w-14 h-14 rounded-2xl border-2 font-bold text-sm transition-all",
              "bg-gradient-to-br from-primary/10 to-primary/5 border-primary text-primary",
              currentPhase !== 'idle' && "animate-pulse"
            )}>
              IN
            </div>
            
            <WorkflowConnector 
              isActive={currentPhase !== 'idle' && enabledAgents.length > 0}
              isComplete={enabledAgents.length > 0 && isAgentComplete(enabledAgents[0]?.type)}
            />

            {/* Agent Nodes */}
            {enabledAgents.length === 0 ? (
              <div className="text-center py-12 px-8">
                <div className="p-4 rounded-full bg-muted/50 w-fit mx-auto mb-4">
                  <Plus className="h-8 w-8 text-muted-foreground/50" />
                </div>
                <p className="text-sm font-medium text-muted-foreground">No agents in pipeline</p>
                <p className="text-xs text-muted-foreground/70 mt-1">
                  Click "Add Agent" to build your workflow
                </p>
              </div>
            ) : (
              enabledAgents.map((agent, index) => (
                <div key={agent.id} className="flex flex-col items-center">
                  <WorkflowNode
                    agent={agent}
                    onToggle={handleToggle}
                    onRemove={handleRemove}
                    isActive={isAgentActive(agent.type)}
                    isComplete={isAgentComplete(agent.type)}
                    canRemove={!isProcessing}
                  />
                  
                  {index < enabledAgents.length - 1 && (
                    <WorkflowConnector
                      isActive={isAgentComplete(agent.type) && isAgentActive(enabledAgents[index + 1]?.type)}
                      isComplete={isAgentComplete(enabledAgents[index + 1]?.type)}
                      isEnabled={enabledAgents[index + 1]?.enabled}
                    />
                  )}
                </div>
              ))
            )}

            {enabledAgents.length > 0 && (
              <>
                <WorkflowConnector 
                  isComplete={currentPhase === 'complete'}
                  isActive={currentPhase === 'refining'}
                />
                
                {/* End Node */}
                <div className={cn(
                  "flex items-center justify-center w-14 h-14 rounded-2xl border-2 font-bold text-sm transition-all",
                  currentPhase === 'complete' 
                    ? "bg-gradient-to-br from-[hsl(var(--agent-complete))]/20 to-[hsl(var(--agent-complete))]/5 border-[hsl(var(--agent-complete))] text-[hsl(var(--agent-complete))]" 
                    : "bg-muted/50 border-muted-foreground/20 text-muted-foreground"
                )}>
                  OUT
                </div>
              </>
            )}
          </div>

          {/* Hint when no goal */}
          {enabledAgents.length > 0 && currentPhase === 'idle' && !goal && (
            <div className="mt-6 text-center">
              <p className="text-sm text-muted-foreground">
                ↑ Enter a goal above to run this pipeline
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Agent Library Sidebar */}
      <Collapsible open={showLibrary} onOpenChange={setShowLibrary}>
        <CollapsibleContent className="w-64 shrink-0">
          <AgentLibrary
            availableAgents={availableTypes}
            onAddAgent={handleAddAgent}
          />
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
}
