import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Database, Trash2, Clock, CheckCircle2, ArrowRight } from 'lucide-react';
import { MemoryEntry } from '@/types/agent';
import { cn } from '@/lib/utils';

interface MemoryPanelProps {
  memory: MemoryEntry[];
  onClear: () => void;
}

export function MemoryPanel({ memory, onClear }: MemoryPanelProps) {
  const formatTime = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffMins < 1440) return `${Math.floor(diffMins / 60)}h ago`;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const isInternshipGoal = (goal: string) => {
    return goal.toLowerCase().includes('internship') || 
           goal.toLowerCase().includes('fake') ||
           goal.toLowerCase().includes('legitimate');
  };

  return (
    <Card className="h-full border-0 bg-muted/30">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-sm font-medium">
            <div className="p-1.5 rounded-md bg-primary/10">
              <Database className="h-4 w-4 text-primary" />
            </div>
            History
            {memory.length > 0 && (
              <Badge variant="secondary" className="text-xs">
                {memory.length}
              </Badge>
            )}
          </CardTitle>
          {memory.length > 0 && (
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={onClear}
              className="h-8 w-8 text-muted-foreground hover:text-destructive"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <ScrollArea className="h-[calc(100vh-240px)]">
          {memory.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-48 text-center">
              <div className="p-3 rounded-full bg-muted mb-3">
                <Database className="h-6 w-6 text-muted-foreground/50" />
              </div>
              <p className="text-sm font-medium text-muted-foreground">
                No history yet
              </p>
              <p className="text-xs text-muted-foreground/70 mt-1">
                Your completed tasks will appear here
              </p>
            </div>
          ) : (
            <div className="space-y-2 pr-2">
              {memory.map((entry, index) => (
                <div
                  key={entry.id}
                  className={cn(
                    "group p-3 rounded-xl border transition-all cursor-pointer",
                    "hover:border-primary/30 hover:bg-accent/50",
                    "bg-background/60 backdrop-blur-sm",
                    index === 0 && "ring-1 ring-primary/20"
                  )}
                >
                  {/* Header */}
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <div className="flex items-center gap-1.5">
                      <CheckCircle2 className="h-3.5 w-3.5 text-[hsl(var(--agent-complete))]" />
                      <span className="text-xs font-medium text-[hsl(var(--agent-complete))]">
                        Completed
                      </span>
                    </div>
                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {formatTime(entry.timestamp)}
                    </span>
                  </div>

                  {/* Goal */}
                  <p className="text-sm font-medium line-clamp-2 mb-2 group-hover:text-primary transition-colors">
                    {entry.goal}
                  </p>

                  {/* Result Preview */}
                  <div className={cn(
                    "text-xs rounded-lg px-2.5 py-2 border-l-2",
                    isInternshipGoal(entry.goal) 
                      ? "bg-destructive/5 border-l-destructive text-destructive" 
                      : "bg-[hsl(var(--agent-complete))]/5 border-l-[hsl(var(--agent-complete))] text-[hsl(var(--agent-complete))]"
                  )}>
                    <div className="flex items-center gap-1.5">
                      <ArrowRight className="h-3 w-3 shrink-0" />
                      <span className="line-clamp-1">{entry.result}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
