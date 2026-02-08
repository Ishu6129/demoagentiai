import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { Send, Sparkles, FileSearch, Code, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface GoalInputProps {
  onSubmit: (goal: string) => void;
  isProcessing: boolean;
  exampleGoals: { internship: string; fibonacci: string };
}

export function GoalInput({ onSubmit, isProcessing, exampleGoals }: GoalInputProps) {
  const [goal, setGoal] = useState('');
  const [isFocused, setIsFocused] = useState(false);

  const handleSubmit = () => {
    if (goal.trim() && !isProcessing) {
      onSubmit(goal.trim());
      setGoal('');
    }
  };

  const handleExampleClick = (exampleGoal: string) => {
    if (!isProcessing) {
      onSubmit(exampleGoal);
    }
  };

  return (
    <Card className={cn(
      "transition-all duration-300 border-2",
      isFocused ? "border-primary/40 shadow-lg shadow-primary/5" : "border-border/50",
      isProcessing && "opacity-75"
    )}>
      <CardContent className="p-4">
        <div className="space-y-3">
          {/* Main Input Area */}
          <div className="relative">
            <div className="absolute top-3 left-3">
              <Sparkles className={cn(
                "h-5 w-5 transition-colors",
                isFocused ? "text-primary" : "text-muted-foreground"
              )} />
            </div>
            <Textarea
              placeholder="What would you like me to help you with?"
              value={goal}
              onChange={(e) => setGoal(e.target.value)}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              className={cn(
                "min-h-[80px] pl-10 pr-14 resize-none border-0 bg-transparent",
                "text-base placeholder:text-muted-foreground/60",
                "focus-visible:ring-0 focus-visible:ring-offset-0"
              )}
              disabled={isProcessing}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
                  e.preventDefault();
                  handleSubmit();
                }
              }}
            />
            <Button
              size="icon"
              className={cn(
                "absolute bottom-3 right-3 h-9 w-9 rounded-lg transition-all",
                goal.trim() && !isProcessing ? "bg-primary hover:bg-primary/90" : "bg-muted"
              )}
              onClick={handleSubmit}
              disabled={!goal.trim() || isProcessing}
            >
              {isProcessing ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
            </Button>
          </div>

          {/* Divider */}
          <div className="flex items-center gap-3">
            <div className="flex-1 h-px bg-border/50" />
            <span className="text-xs text-muted-foreground">Try an example</span>
            <div className="flex-1 h-px bg-border/50" />
          </div>

          {/* Example Buttons */}
          <div className="flex flex-wrap gap-2 justify-center">
            <Button
              variant="outline"
              size="sm"
              className={cn(
                "gap-2 rounded-full px-4 transition-all",
                "hover:bg-[hsl(var(--agent-critic))]/10 hover:border-[hsl(var(--agent-critic))]/50 hover:text-[hsl(var(--agent-critic))]"
              )}
              onClick={() => handleExampleClick(exampleGoals.internship)}
              disabled={isProcessing}
            >
              <FileSearch className="h-4 w-4" />
              Verify Internship Posting
            </Button>
            <Button
              variant="outline"
              size="sm"
              className={cn(
                "gap-2 rounded-full px-4 transition-all",
                "hover:bg-[hsl(var(--agent-planner))]/10 hover:border-[hsl(var(--agent-planner))]/50 hover:text-[hsl(var(--agent-planner))]"
              )}
              onClick={() => handleExampleClick(exampleGoals.fibonacci)}
              disabled={isProcessing}
            >
              <Code className="h-4 w-4" />
              Generate Fibonacci Code
            </Button>
          </div>

          {/* Keyboard Shortcut Hint */}
          <p className="text-xs text-center text-muted-foreground/60">
            Press <kbd className="px-1.5 py-0.5 rounded bg-muted text-[10px] font-mono">Ctrl</kbd> + <kbd className="px-1.5 py-0.5 rounded bg-muted text-[10px] font-mono">Enter</kbd> to submit
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
