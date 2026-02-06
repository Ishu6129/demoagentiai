import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { WorkflowNode } from './WorkflowNode';
import { WorkflowConnector } from './WorkflowConnector';
import { AgentLibrary } from './AgentLibrary';
import { WorkflowAgent, AgentType, DEFAULT_AGENTS } from '@/types/workflow';
import { Play, RotateCcw, Settings2, ChevronRight, Target } from 'lucide-react';
import { cn } from '@/lib/utils';
import { AgentPhase } from '@/types/agent';

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
      <Card className="flex-1">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base flex items-center gap-2">
              <Settings2 className="h-5 w-5 text-primary" />
              Workflow Pipeline
            </CardTitle>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowLibrary(!showLibrary)}
              >
                {showLibrary ? 'Hide' : 'Add Agents'}
              </Button>
              {currentPhase !== 'idle' && (
                <Button variant="outline" size="sm" onClick={onReset}>
                  <RotateCcw className="h-4 w-4 mr-1" />
                  Reset
                </Button>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Goal Display */}
          {goal && (
            <div className="mb-6 p-3 rounded-lg bg-primary/5 border border-primary/20">
              <div className="flex items-center gap-2 text-sm">
                <Target className="h-4 w-4 text-primary" />
                <span className="font-medium">Goal:</span>
                <span className="text-muted-foreground truncate">{goal}</span>
              </div>
            </div>
          )}

          {/* Workflow Nodes */}
          <div className="flex flex-col items-center">
            {/* Start Node */}
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 border-2 border-primary text-primary font-semibold">
              IN
            </div>
            
            <WorkflowConnector 
              isActive={currentPhase !== 'idle' && enabledAgents.length > 0}
              isComplete={enabledAgents.length > 0 && isAgentComplete(enabledAgents[0]?.type)}
            />

            {/* Agent Nodes */}
            {enabledAgents.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <p className="text-sm">No agents in pipeline</p>
                <p className="text-xs mt-1">Add agents from the library</p>
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
                  "flex items-center justify-center w-12 h-12 rounded-full border-2 font-semibold transition-all",
                  currentPhase === 'complete' 
                    ? "bg-agent-complete/10 border-agent-complete text-agent-complete" 
                    : "bg-muted border-muted-foreground/30 text-muted-foreground"
                )}>
                  OUT
                </div>
              </>
            )}
          </div>

          {/* Run Button */}
          {enabledAgents.length > 0 && currentPhase === 'idle' && !goal && (
            <div className="mt-6 text-center">
              <p className="text-sm text-muted-foreground">
                Enter a goal above to run the workflow
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Agent Library Sidebar */}
      {showLibrary && (
        <div className="w-64 shrink-0">
          <AgentLibrary
            availableAgents={availableTypes}
            onAddAgent={handleAddAgent}
          />
        </div>
      )}
    </div>
  );
}
