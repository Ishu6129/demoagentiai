import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Brain, Zap, Eye, Sparkles, Plus, Blocks } from 'lucide-react';
import { cn } from '@/lib/utils';
import { AgentType } from '@/types/workflow';

interface AgentLibraryProps {
  availableAgents: AgentType[];
  onAddAgent: (type: AgentType) => void;
}

const agentInfo: Record<AgentType, {
  name: string;
  description: string;
  icon: typeof Brain;
  colorVar: string;
}> = {
  planner: {
    name: 'Planner',
    description: 'Decomposes goals into tasks',
    icon: Brain,
    colorVar: '--agent-planner'
  },
  executor: {
    name: 'Executor',
    description: 'Runs each sub-task',
    icon: Zap,
    colorVar: '--agent-executor'
  },
  critic: {
    name: 'Critic',
    description: 'Evaluates the results',
    icon: Eye,
    colorVar: '--agent-critic'
  },
  refiner: {
    name: 'Refiner',
    description: 'Improves the output',
    icon: Sparkles,
    colorVar: '--agent-refiner'
  }
};

export function AgentLibrary({ availableAgents, onAddAgent }: AgentLibraryProps) {
  return (
    <Card className="h-fit border-0 bg-muted/30">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-medium flex items-center gap-2">
          <div className="p-1.5 rounded-md bg-primary/10">
            <Blocks className="h-4 w-4 text-primary" />
          </div>
          Available Agents
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
                "flex items-center gap-3 p-3 rounded-xl border transition-all",
                isAvailable 
                  ? "border-dashed border-muted-foreground/20 hover:border-primary/50 hover:bg-accent/50 cursor-pointer group" 
                  : "opacity-40 cursor-not-allowed bg-muted/20"
              )}
              onClick={() => isAvailable && onAddAgent(type)}
            >
              <div 
                className="p-2 rounded-lg transition-transform group-hover:scale-110"
                style={{ 
                  backgroundColor: `hsl(var(${info.colorVar}) / 0.1)` 
                }}
              >
                <Icon 
                  className="h-4 w-4" 
                  style={{ color: `hsl(var(${info.colorVar}))` }}
                />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium">{info.name}</p>
                <p className="text-xs text-muted-foreground truncate">
                  {info.description}
                </p>
              </div>
              {isAvailable ? (
                <div className="p-1.5 rounded-full bg-primary/10 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Plus className="h-3.5 w-3.5 text-primary" />
                </div>
              ) : (
                <Badge variant="secondary" className="text-xs">Added</Badge>
              )}
            </div>
          );
        })}
        
        <p className="text-xs text-muted-foreground text-center pt-2 pb-1">
          Click to add to your pipeline
        </p>
      </CardContent>
    </Card>
  );
}
