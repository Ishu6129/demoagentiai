import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { FileSearch, Code, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const examples = [
  {
    id: 'internship',
    title: 'Internship Verification',
    description: 'Analyze if an internship posting is fake or legitimate using multi-step verification.',
    icon: FileSearch,
    tags: ['Analysis', 'Verification', 'Red Flag Detection'],
    goal: 'Analyze if this internship posting is fake or legitimate'
  },
  {
    id: 'fibonacci',
    title: 'Fibonacci Code Generator',
    description: 'Generate optimized code to calculate Fibonacci sequences with proper error handling.',
    icon: Code,
    tags: ['Code Generation', 'Optimization', 'Documentation'],
    goal: 'Write code to find the Fibonacci sequence of a given number'
  }
];

const Examples = () => {
  const navigate = useNavigate();

  const handleTryExample = (goal: string) => {
    // Store the goal in sessionStorage to be picked up by the dashboard
    sessionStorage.setItem('pendingGoal', goal);
    navigate('/');
  };

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="space-y-2">
          <h2 className="text-2xl font-bold">Example Use Cases</h2>
          <p className="text-muted-foreground">
            Explore how the Autonomous Agentic AI processes different types of goals 
            through the Planner-Executor-Critic architecture.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {examples.map((example) => {
            const Icon = example.icon;
            return (
              <Card key={example.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start gap-4">
                    <div className="p-3 rounded-lg bg-primary/10">
                      <Icon className="h-6 w-6 text-primary" />
                    </div>
                    <div className="flex-1">
                      <CardTitle className="text-lg">{example.title}</CardTitle>
                      <CardDescription className="mt-1">
                        {example.description}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex flex-wrap gap-2">
                    {example.tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  <Button 
                    className="w-full gap-2" 
                    onClick={() => handleTryExample(example.goal)}
                  >
                    Try This Example
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Examples;
