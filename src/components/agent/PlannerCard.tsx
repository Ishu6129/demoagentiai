import { AgentModuleCard } from './AgentModuleCard';
import { Brain, CheckCircle2, Circle, Loader2 } from 'lucide-react';
import { PlannerOutput, SubTask } from '@/types/agent';
import { cn } from '@/lib/utils';

interface PlannerCardProps {
  output: PlannerOutput | null;
  isActive: boolean;
  isComplete: boolean;
  isPending: boolean;
}

function TaskStatusIcon({ status }: { status: SubTask['status'] }) {
  switch (status) {
    case 'completed':
      return <CheckCircle2 className="h-4 w-4 text-agent-complete" />;
    case 'active':
      return <Loader2 className="h-4 w-4 text-agent-executor animate-spin" />;
    default:
      return <Circle className="h-4 w-4 text-muted-foreground" />;
  }
}

export function PlannerCard({ output, isActive, isComplete, isPending }: PlannerCardProps) {
  const completedTasks = output?.subTasks.filter(t => t.status === 'completed').length || 0;
  const totalTasks = output?.subTasks.length || 0;

  return (
    <AgentModuleCard
      title="Planner Module"
      icon={<Brain className="h-5 w-5 text-agent-planner" />}
      color="planner"
      isActive={isActive}
      isComplete={isComplete}
      isPending={isPending}
      processingLabel="Decomposing goal..."
      statusLabel={`${totalTasks} tasks`}
    >
      {output ? (
        <div className="space-y-4">
          <div className="p-3 rounded-lg bg-agent-planner/5 border border-agent-planner/10">
            <p className="text-sm text-muted-foreground italic leading-relaxed">
              "{output.reasoning}"
            </p>
          </div>
          
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-semibold">Task Decomposition</h4>
              {completedTasks > 0 && (
                <span className="text-xs text-muted-foreground">
                  {completedTasks}/{totalTasks} complete
                </span>
              )}
            </div>
            
            <div className="space-y-2">
              {output.subTasks.map((task, index) => (
                <div
                  key={task.id}
                  className={cn(
                    "flex items-start gap-3 p-3 rounded-lg transition-all duration-300 border",
                    task.status === 'active' && "bg-agent-executor/10 border-agent-executor/30 shadow-sm",
                    task.status === 'completed' && "bg-agent-complete/5 border-agent-complete/20",
                    task.status === 'pending' && "bg-muted/30 border-transparent"
                  )}
                >
                  <div className="flex items-center gap-2.5 shrink-0">
                    <span className={cn(
                      "w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold",
                      task.status === 'completed' && "bg-agent-complete/20 text-agent-complete",
                      task.status === 'active' && "bg-agent-executor/20 text-agent-executor",
                      task.status === 'pending' && "bg-muted text-muted-foreground"
                    )}>
                      {index + 1}
                    </span>
                    <TaskStatusIcon status={task.status} />
                  </div>
                  <span className={cn(
                    "text-sm leading-relaxed",
                    task.status === 'completed' && "text-agent-complete",
                    task.status === 'active' && "text-foreground font-medium",
                    task.status === 'pending' && "text-muted-foreground"
                  )}>
                    {task.title}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="h-24 flex items-center justify-center text-muted-foreground text-sm">
          Waiting for goal input...
        </div>
      )}
    </AgentModuleCard>
  );
}
