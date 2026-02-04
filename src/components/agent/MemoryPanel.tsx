import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Database, Trash2, Clock } from 'lucide-react';
import { MemoryEntry } from '@/types/agent';
import { cn } from '@/lib/utils';

interface MemoryPanelProps {
  memory: MemoryEntry[];
  onClear: () => void;
}

export function MemoryPanel({ memory, onClear }: MemoryPanelProps) {
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit'
    });
  };

  return (
    <Card className="h-full">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-base">
            <Database className="h-5 w-5 text-primary" />
            Session Memory
          </CardTitle>
          {memory.length > 0 && (
            <Button variant="ghost" size="sm" onClick={onClear}>
              <Trash2 className="h-4 w-4" />
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[300px] pr-4">
          {memory.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center py-8">
              <Database className="h-12 w-12 text-muted-foreground/30 mb-3" />
              <p className="text-sm text-muted-foreground">
                No entries yet
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Submit a goal to see it here
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {memory.map((entry) => (
                <div
                  key={entry.id}
                  className="p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
                >
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <Badge variant="outline" className={cn(
                      "text-xs",
                      entry.phase === 'complete' && "border-green-500 text-green-500"
                    )}>
                      {entry.phase}
                    </Badge>
                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {formatTime(entry.timestamp)}
                    </span>
                  </div>
                  <p className="text-sm font-medium line-clamp-2">
                    {entry.goal}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {entry.result}
                  </p>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
