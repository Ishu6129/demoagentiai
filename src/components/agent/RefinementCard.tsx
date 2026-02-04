import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { RefreshCw, CheckCircle, ArrowRight } from 'lucide-react';
import { RefinementOutput } from '@/types/agent';
import { cn } from '@/lib/utils';

interface RefinementCardProps {
  output: RefinementOutput | null;
  isActive: boolean;
  isComplete: boolean;
}

export function RefinementCard({ output, isActive, isComplete }: RefinementCardProps) {
  if (!output) return null;

  return (
    <Card className={cn(
      "transition-all duration-300",
      isActive && "ring-2 ring-purple-500 shadow-lg shadow-purple-500/20",
      isComplete && "ring-2 ring-green-500 shadow-lg shadow-green-500/20"
    )}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-base">
            {isComplete ? (
              <CheckCircle className="h-5 w-5 text-green-500" />
            ) : (
              <RefreshCw className={cn("h-5 w-5 text-purple-500", isActive && "animate-spin")} />
            )}
            {isComplete ? "Final Output" : "Refinement Module"}
          </CardTitle>
          <Badge 
            variant={isComplete ? "default" : "secondary"} 
            className={cn(
              isActive && "bg-purple-500 hover:bg-purple-600",
              isComplete && "bg-green-500 hover:bg-green-600"
            )}
          >
            {isComplete ? "Complete" : isActive ? "Refining" : "Pending"}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Improvements Applied */}
        <div className="space-y-2">
          <h4 className="text-sm font-medium flex items-center gap-2">
            <ArrowRight className="h-4 w-4 text-green-500" />
            Improvements Applied:
          </h4>
          <ul className="space-y-1">
            {output.improvements.map((improvement, index) => (
              <li 
                key={index}
                className="text-sm text-muted-foreground flex items-start gap-2"
              >
                <span className="text-green-500">✓</span>
                {improvement}
              </li>
            ))}
          </ul>
        </div>

        {/* Before/After Comparison */}
        <Tabs defaultValue="refined" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="original">Original</TabsTrigger>
            <TabsTrigger value="refined">Refined</TabsTrigger>
          </TabsList>
          <TabsContent value="original">
            <div className="rounded-lg bg-muted/50 p-4 max-h-[400px] overflow-auto">
              <pre className="text-sm whitespace-pre-wrap font-mono">{output.original}</pre>
            </div>
          </TabsContent>
          <TabsContent value="refined">
            <div className="rounded-lg bg-zinc-900 text-zinc-100 p-4 max-h-[400px] overflow-auto">
              <pre className="text-sm whitespace-pre-wrap font-mono">{output.refined}</pre>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
