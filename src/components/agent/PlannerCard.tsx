import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Brain, CheckCircle, Circle, Loader2 } from 'lucide-react';
import { PlannerOutput, SubTask } from '@/types/agent';
import { cn } from '@/lib/utils';

interface PlannerCardProps {
  output: PlannerOutput | null;
  isActive: boolean;
}

function TaskStatusIcon({ status }: { status: SubTask['status'] }) {
  switch (status) {
    case 'completed':
      return <CheckCircle className="h-4 w-4 text-green-500" />;
    case 'active':
      return <Loader2 className="h-4 w-4 text-yellow-500 animate-spin" />;
    default:
      return <Circle className="h-4 w-4 text-muted-foreground" />;
  }
}

export function PlannerCard({ output, isActive }: PlannerCardProps) {
  if (!output) return null;

  return (
    <Card className={cn(
      "transition-all duration-300",
      isActive && "ring-2 ring-blue-500 shadow-lg shadow-blue-500/20"
    )}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-base">
            <Brain className="h-5 w-5 text-blue-500" />
            Planner Module
          </CardTitle>
          <Badge variant={isActive ? "default" : "secondary"} className={cn(
            isActive && "bg-blue-500 hover:bg-blue-600"
          )}>
            {isActive ? "Processing" : "Complete"}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground italic">
          "{output.reasoning}"
        </p>
        
        <div className="space-y-2">
          <h4 className="text-sm font-medium">Task Decomposition:</h4>
          <div className="space-y-2">
            {output.subTasks.map((task, index) => (
              <div
                key={task.id}
                className={cn(
                  "flex items-start gap-3 p-3 rounded-lg transition-all duration-300",
                  task.status === 'active' && "bg-yellow-500/10 border border-yellow-500/30",
                  task.status === 'completed' && "bg-green-500/10 border border-green-500/30",
                  task.status === 'pending' && "bg-muted/50"
                )}
              >
                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-xs font-mono text-muted-foreground">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <TaskStatusIcon status={task.status} />
                </div>
                <span className={cn(
                  "text-sm",
                  task.status === 'completed' && "text-green-700 dark:text-green-400",
                  task.status === 'active' && "text-yellow-700 dark:text-yellow-400 font-medium"
                )}>
                  {task.title}
                </span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
