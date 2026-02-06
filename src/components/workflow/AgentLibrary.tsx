import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Brain, Zap, Eye, Sparkles, Plus, Blocks } from 'lucide-react';
import { cn } from '@/lib/utils';
import { WorkflowAgent, AgentType } from '@/types/workflow';

interface AgentLibraryProps {
  availableAgents: AgentType[];
  onAddAgent: (type: AgentType) => void;
}

const agentInfo: Record<AgentType, {
  name: string;
  description: string;
  icon: typeof Brain;
  color: string;
}> = {
  planner: {
    name: 'Planner',
    description: 'Decomposes goals into tasks',
    icon: Brain,
    color: 'agent-planner'
  },
  executor: {
    name: 'Executor',
    description: 'Runs each sub-task',
    icon: Zap,
    color: 'agent-executor'
  },
  critic: {
    name: 'Critic',
    description: 'Evaluates the results',
    icon: Eye,
    color: 'agent-critic'
  },
  refiner: {
    name: 'Refiner',
    description: 'Improves the output',
    icon: Sparkles,
    color: 'agent-refiner'
  }
};

export function AgentLibrary({ availableAgents, onAddAgent }: AgentLibraryProps) {
  return (
    <Card className="h-fit">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm flex items-center gap-2">
          <Blocks className="h-4 w-4 text-primary" />
          Agent Library
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {(Object.keys(agentInfo) as AgentType[]).map((type) => {
          const info = agentInfo[type];
          const Icon = info.icon;
          const isAvailable = availableAgents.includes(type);

          return (
            <div
              key={type}
              className={cn(
                "flex items-center gap-3 p-2 rounded-lg border transition-all",
                isAvailable 
                  ? "border-dashed border-muted-foreground/30 hover:border-primary/50 hover:bg-accent/50 cursor-pointer" 
                  : "opacity-40 cursor-not-allowed"
              )}
              onClick={() => isAvailable && onAddAgent(type)}
            >
              <div className={cn(
                "p-2 rounded-lg",
                `bg-${info.color}/10`
              )}>
                <Icon className={cn("h-4 w-4", `text-${info.color}`)} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium">{info.name}</p>
                <p className="text-xs text-muted-foreground truncate">
                  {info.description}
                </p>
              </div>
              {isAvailable ? (
                <Plus className="h-4 w-4 text-muted-foreground" />
              ) : (
                <Badge variant="outline" className="text-xs">In Use</Badge>
              )}
            </div>
          );
        })}
        
        <p className="text-xs text-muted-foreground text-center pt-2">
          Click to add agents to your workflow
        </p>
      </CardContent>
    </Card>
  );
}
