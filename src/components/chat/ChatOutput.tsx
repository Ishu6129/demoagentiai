import { useEffect, useRef } from 'react';
import { ChatMessage } from './ChatMessage';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { AgentState, AgentPhase } from '@/types/agent';
import { CheckCircle2, Copy, FileCode } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

interface ChatOutputProps {
  state: AgentState;
  enabledAgents: string[];
}

export function ChatOutput({ state, enabledAgents }: ChatOutputProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const activeRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to active message
  useEffect(() => {
    if (activeRef.current) {
      activeRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [state.phase, state.executorOutputs.length, state.criticOutput?.critiques.length]);

  const getPhaseIndex = (phase: AgentPhase) => {
    const phases: AgentPhase[] = ['idle', 'planning', 'executing', 'critiquing', 'refining', 'complete'];
    return phases.indexOf(phase);
  };

  const isComplete = (phase: AgentPhase) => getPhaseIndex(state.phase) > getPhaseIndex(phase);
  const isActive = (phase: AgentPhase) => state.phase === phase;

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard!');
  };

  const renderCodeBlock = (code: string) => (
    <div className="relative group">
      <pre className="bg-secondary rounded-lg p-4 overflow-x-auto text-xs font-mono">
        <code>{code}</code>
      </pre>
      <Button
        variant="ghost"
        size="icon"
        className="absolute top-2 right-2 h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity"
        onClick={() => copyToClipboard(code)}
      >
        <Copy className="h-3 w-3" />
      </Button>
    </div>
  );

  const renderMarkdownContent = (content: string) => {
    // Simple markdown-like rendering
    const lines = content.split('\n');
    return lines.map((line, i) => {
      if (line.startsWith('# ')) {
        return <h1 key={i} className="text-lg font-bold mt-4 mb-2">{line.slice(2)}</h1>;
      }
      if (line.startsWith('## ')) {
        return <h2 key={i} className="text-base font-semibold mt-3 mb-2">{line.slice(3)}</h2>;
      }
      if (line.startsWith('### ')) {
        return <h3 key={i} className="text-sm font-semibold mt-2 mb-1">{line.slice(4)}</h3>;
      }
      if (line.startsWith('- ') || line.startsWith('* ')) {
        return <li key={i} className="ml-4 list-disc">{line.slice(2)}</li>;
      }
      if (line.startsWith('---')) {
        return <Separator key={i} className="my-3" />;
      }
      if (line.startsWith('|')) {
        return <div key={i} className="font-mono text-xs bg-muted/50 px-2 py-1 rounded">{line}</div>;
      }
      if (line.match(/^\d+\./)) {
        return <li key={i} className="ml-4 list-decimal">{line.replace(/^\d+\.\s*/, '')}</li>;
      }
      if (line.startsWith('🚩') || line.startsWith('⚠️') || line.startsWith('❌') || line.startsWith('✓')) {
        return <div key={i} className="py-1">{line}</div>;
      }
      if (line.trim() === '') {
        return <div key={i} className="h-2" />;
      }
      return <p key={i} className="py-0.5">{line}</p>;
    });
  };

  return (
    <ScrollArea className="h-[calc(100vh-320px)]" ref={scrollRef}>
      <div className="space-y-3 pr-4">
        {/* User Goal Message */}
        <ChatMessage
          role="user"
          content={<p className="font-medium">"{state.goal}"</p>}
          timestamp={new Date()}
          status="complete"
        />

        {/* Planner Agent */}
        {enabledAgents.includes('planner') && (
          <div ref={isActive('planning') ? activeRef : undefined}>
            <ChatMessage
              role="planner"
              isLoading={isActive('planning') && !state.plannerOutput}
              status={isActive('planning') ? 'active' : isComplete('planning') ? 'complete' : 'pending'}
              content={
                state.plannerOutput && (
                  <div className="space-y-3">
                    <p className="text-muted-foreground italic">{state.plannerOutput.reasoning}</p>
                    <div className="space-y-2">
                      <p className="font-medium text-sm">Breaking down into {state.plannerOutput.subTasks.length} sub-tasks:</p>
                      {state.plannerOutput.subTasks.map((task, i) => (
                        <div key={task.id} className={cn(
                          "flex items-center gap-2 p-2 rounded-lg transition-all",
                          task.status === 'completed' && "bg-[hsl(var(--agent-complete))]/10",
                          task.status === 'active' && "bg-primary/10 border border-primary/30",
                          task.status === 'pending' && "bg-muted/30"
                        )}>
                          <span className={cn(
                            "flex items-center justify-center w-5 h-5 rounded-full text-xs font-medium",
                            task.status === 'completed' ? "bg-[hsl(var(--agent-complete))] text-white" : "bg-muted text-muted-foreground"
                          )}>
                            {task.status === 'completed' ? <CheckCircle2 className="h-3 w-3" /> : i + 1}
                          </span>
                          <span className={cn(
                            "text-sm",
                            task.status === 'completed' && "line-through text-muted-foreground"
                          )}>
                            {task.title}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )
              }
            />
          </div>
        )}

        {/* Executor Agent - Multiple messages */}
        {enabledAgents.includes('executor') && state.executorOutputs.map((output, i) => (
          <div 
            key={output.taskId} 
            ref={isActive('executing') && i === state.executorOutputs.length - 1 ? activeRef : undefined}
          >
            <ChatMessage
              role="executor"
              status="complete"
              content={
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="text-xs">
                      Task {output.taskId}
                    </Badge>
                    {output.type === 'code' && (
                      <Badge variant="outline" className="text-xs">
                        <FileCode className="h-3 w-3 mr-1" />
                        Code
                      </Badge>
                    )}
                  </div>
                  {output.type === 'code' ? (
                    renderCodeBlock(output.result)
                  ) : (
                    <div className="space-y-1">
                      {renderMarkdownContent(output.result)}
                    </div>
                  )}
                </div>
              }
            />
          </div>
        ))}

        {/* Executor Loading */}
        {enabledAgents.includes('executor') && isActive('executing') && state.plannerOutput && 
         state.executorOutputs.length < state.plannerOutput.subTasks.length && (
          <ChatMessage role="executor" isLoading status="active" content={null} />
        )}

        {/* Critic Agent */}
        {enabledAgents.includes('critic') && (isActive('critiquing') || isComplete('critiquing')) && (
          <div ref={isActive('critiquing') ? activeRef : undefined}>
            <ChatMessage
              role="critic"
              isLoading={isActive('critiquing') && !state.criticOutput}
              status={isActive('critiquing') ? 'active' : isComplete('critiquing') ? 'complete' : 'pending'}
              content={
                state.criticOutput && (
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-medium">Quality Score:</span>
                      <div className="flex items-center gap-2">
                        <div className="h-2 w-32 bg-muted rounded-full overflow-hidden">
                          <div 
                            className={cn(
                              "h-full rounded-full transition-all",
                              state.criticOutput.overallScore >= 70 ? "bg-[hsl(var(--agent-complete))]" :
                              state.criticOutput.overallScore >= 50 ? "bg-[hsl(var(--agent-executor))]" :
                              "bg-destructive"
                            )}
                            style={{ width: `${state.criticOutput.overallScore}%` }}
                          />
                        </div>
                        <span className="text-sm font-bold">{state.criticOutput.overallScore}%</span>
                      </div>
                    </div>
                    <div className="space-y-2">
                      {state.criticOutput.critiques.map((critique) => (
                        <div 
                          key={critique.id}
                          className={cn(
                            "p-2 rounded-lg border-l-2",
                            critique.severity === 'pass' && "border-l-[hsl(var(--agent-complete))] bg-[hsl(var(--agent-complete))]/5",
                            critique.severity === 'warning' && "border-l-[hsl(var(--agent-executor))] bg-[hsl(var(--agent-executor))]/5",
                            critique.severity === 'critical' && "border-l-destructive bg-destructive/5"
                          )}
                        >
                          <div className="flex items-start justify-between gap-2">
                            <span className="text-sm font-medium">{critique.issue}</span>
                            <Badge 
                              variant="outline" 
                              className={cn(
                                "text-xs shrink-0",
                                critique.severity === 'pass' && "border-[hsl(var(--agent-complete))] text-[hsl(var(--agent-complete))]",
                                critique.severity === 'warning' && "border-[hsl(var(--agent-executor))] text-[hsl(var(--agent-executor))]",
                                critique.severity === 'critical' && "border-destructive text-destructive"
                              )}
                            >
                              {critique.severity}
                            </Badge>
                          </div>
                          <p className="text-xs text-muted-foreground mt-1">{critique.suggestion}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )
              }
            />
          </div>
        )}

        {/* Refiner Agent */}
        {enabledAgents.includes('refiner') && (isActive('refining') || isComplete('refining')) && (
          <div ref={isActive('refining') ? activeRef : undefined}>
            <ChatMessage
              role="refiner"
              isLoading={isActive('refining') && !state.refinementOutput}
              status={isActive('refining') ? 'active' : isComplete('refining') ? 'complete' : 'pending'}
              content={
                state.refinementOutput && (
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 flex-wrap">
                      {state.refinementOutput.improvements.map((improvement, i) => (
                        <Badge key={i} variant="secondary" className="text-xs">
                          ✓ {improvement}
                        </Badge>
                      ))}
                    </div>
                    <Card className="border-[hsl(var(--agent-refiner))]/30 bg-[hsl(var(--agent-refiner))]/5">
                      <CardContent className="p-4">
                        <div className="space-y-1">
                          {renderMarkdownContent(state.refinementOutput.refined)}
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                )
              }
            />
          </div>
        )}

        {/* Final System Message */}
        {state.phase === 'complete' && (
          <ChatMessage
            role="system"
            status="complete"
            content={
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-[hsl(var(--agent-complete))]" />
                <span className="font-medium">Workflow completed successfully!</span>
                <span className="text-muted-foreground text-sm">
                  All {enabledAgents.length} agents finished processing.
                </span>
              </div>
            }
          />
        )}
      </div>
    </ScrollArea>
  );
}
