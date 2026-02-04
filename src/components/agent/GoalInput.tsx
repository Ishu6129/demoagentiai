import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Send, Sparkles, FileSearch, Code } from 'lucide-react';

interface GoalInputProps {
  onSubmit: (goal: string) => void;
  isProcessing: boolean;
  exampleGoals: { internship: string; fibonacci: string };
}

export function GoalInput({ onSubmit, isProcessing, exampleGoals }: GoalInputProps) {
  const [goal, setGoal] = useState('');

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
    <Card className="border-2 border-primary/20 bg-card/50 backdrop-blur">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Sparkles className="h-5 w-5 text-primary" />
          Enter Your Goal
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="relative">
          <Textarea
            placeholder="Describe your high-level goal... (e.g., 'Analyze if this job posting is legitimate')"
            value={goal}
            onChange={(e) => setGoal(e.target.value)}
            className="min-h-[100px] pr-12 resize-none bg-background"
            disabled={isProcessing}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && e.ctrlKey) {
                handleSubmit();
              }
            }}
          />
          <Button
            size="icon"
            className="absolute bottom-3 right-3"
            onClick={handleSubmit}
            disabled={!goal.trim() || isProcessing}
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>

        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">Or try an example:</p>
          <div className="flex flex-wrap gap-2">
            <Button
              variant="outline"
              size="sm"
              className="gap-2"
              onClick={() => handleExampleClick(exampleGoals.internship)}
              disabled={isProcessing}
            >
              <FileSearch className="h-4 w-4" />
              Verify Internship
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="gap-2"
              onClick={() => handleExampleClick(exampleGoals.fibonacci)}
              disabled={isProcessing}
            >
              <Code className="h-4 w-4" />
              Fibonacci Code
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
