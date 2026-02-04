import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Cog, FileCode, FileText, Search } from 'lucide-react';
import { ExecutorOutput } from '@/types/agent';
import { cn } from '@/lib/utils';

interface ExecutorCardProps {
  outputs: ExecutorOutput[];
  isActive: boolean;
}

function OutputTypeIcon({ type }: { type: ExecutorOutput['type'] }) {
  switch (type) {
    case 'code':
      return <FileCode className="h-4 w-4 text-purple-500" />;
    case 'analysis':
      return <Search className="h-4 w-4 text-blue-500" />;
    default:
      return <FileText className="h-4 w-4 text-muted-foreground" />;
  }
}

export function ExecutorCard({ outputs, isActive }: ExecutorCardProps) {
  if (outputs.length === 0) return null;

  return (
    <Card className={cn(
      "transition-all duration-300",
      isActive && "ring-2 ring-yellow-500 shadow-lg shadow-yellow-500/20"
    )}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-base">
            <Cog className={cn("h-5 w-5 text-yellow-500", isActive && "animate-spin")} />
            Executor Module
          </CardTitle>
          <Badge variant={isActive ? "default" : "secondary"} className={cn(
            isActive && "bg-yellow-500 hover:bg-yellow-600 text-black"
          )}>
            {isActive ? `Executing Task ${outputs.length}` : `${outputs.length} Tasks Done`}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <Accordion type="multiple" className="w-full" defaultValue={outputs.map(o => `task-${o.taskId}`)}>
          {outputs.map((output) => (
            <AccordionItem key={output.taskId} value={`task-${output.taskId}`}>
              <AccordionTrigger className="hover:no-underline">
                <div className="flex items-center gap-2">
                  <OutputTypeIcon type={output.type} />
                  <span className="text-sm font-medium">
                    Task {output.taskId} Output
                  </span>
                  <Badge variant="outline" className="text-xs">
                    {output.type}
                  </Badge>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className={cn(
                  "rounded-lg p-4 text-sm",
                  output.type === 'code' 
                    ? "bg-zinc-900 text-zinc-100 font-mono overflow-x-auto" 
                    : "bg-muted/50"
                )}>
                  <pre className="whitespace-pre-wrap">{output.result}</pre>
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </CardContent>
    </Card>
  );
}
