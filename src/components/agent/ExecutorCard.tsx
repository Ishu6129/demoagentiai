import { AgentModuleCard } from './AgentModuleCard';
import { Badge } from '@/components/ui/badge';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Cog, FileCode, FileText, Search, ChevronDown } from 'lucide-react';
import { ExecutorOutput } from '@/types/agent';
import { cn } from '@/lib/utils';
import { useState } from 'react';

interface ExecutorCardProps {
  outputs: ExecutorOutput[];
  isActive: boolean;
  isComplete: boolean;
  isPending: boolean;
}

function OutputTypeIcon({ type }: { type: ExecutorOutput['type'] }) {
  switch (type) {
    case 'code':
      return <FileCode className="h-4 w-4 text-agent-refiner" />;
    case 'analysis':
      return <Search className="h-4 w-4 text-agent-planner" />;
    default:
      return <FileText className="h-4 w-4 text-muted-foreground" />;
  }
}

function TaskOutput({ output, isLatest }: { output: ExecutorOutput; isLatest: boolean }) {
  const [isOpen, setIsOpen] = useState(isLatest);

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <div className={cn(
        "rounded-lg border transition-all",
        isLatest && isOpen && "border-agent-executor/30 bg-agent-executor/5",
        !isLatest && "border-border"
      )}>
        <CollapsibleTrigger className="w-full p-3 flex items-center justify-between hover:bg-muted/50 rounded-lg transition-colors">
          <div className="flex items-center gap-3">
            <div className={cn(
              "w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold",
              "bg-agent-executor/20 text-agent-executor"
            )}>
              {output.taskId}
            </div>
            <OutputTypeIcon type={output.type} />
            <span className="text-sm font-medium">Task {output.taskId} Result</span>
            <Badge variant="outline" className="text-xs">
              {output.type}
            </Badge>
          </div>
          <ChevronDown className={cn(
            "h-4 w-4 text-muted-foreground transition-transform",
            isOpen && "rotate-180"
          )} />
        </CollapsibleTrigger>
        
        <CollapsibleContent>
          <div className={cn(
            "mx-3 mb-3 rounded-lg p-4 text-sm",
            output.type === 'code' 
              ? "bg-secondary font-mono overflow-x-auto" 
              : "bg-muted/50"
          )}>
            <pre className="whitespace-pre-wrap">{output.result}</pre>
          </div>
        </CollapsibleContent>
      </div>
    </Collapsible>
  );
}

export function ExecutorCard({ outputs, isActive, isComplete, isPending }: ExecutorCardProps) {
  return (
    <AgentModuleCard
      title="Executor Module"
      icon={<Cog className={cn("h-5 w-5 text-agent-executor", isActive && "animate-spin")} />}
      color="executor"
      isActive={isActive}
      isComplete={isComplete}
      isPending={isPending}
      processingLabel={`Executing task ${outputs.length + 1}...`}
      statusLabel={`${outputs.length} executed`}
    >
      {outputs.length > 0 ? (
        <div className="space-y-3">
          {outputs.map((output, idx) => (
            <TaskOutput 
              key={output.taskId} 
              output={output} 
              isLatest={idx === outputs.length - 1 && isActive}
            />
          ))}
        </div>
      ) : (
        <div className="h-24 flex items-center justify-center text-muted-foreground text-sm">
          Waiting for planner to complete...
        </div>
      )}
    </AgentModuleCard>
  );
}
