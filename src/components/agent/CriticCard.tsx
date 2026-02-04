import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { MessageSquare, CheckCircle, AlertTriangle, XCircle } from 'lucide-react';
import { CriticOutput, CritiqueItem } from '@/types/agent';
import { cn } from '@/lib/utils';

interface CriticCardProps {
  output: CriticOutput | null;
  isActive: boolean;
}

function SeverityIcon({ severity }: { severity: CritiqueItem['severity'] }) {
  switch (severity) {
    case 'pass':
      return <CheckCircle className="h-4 w-4 text-green-500" />;
    case 'warning':
      return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
    case 'critical':
      return <XCircle className="h-4 w-4 text-red-500" />;
  }
}

function SeverityBadge({ severity }: { severity: CritiqueItem['severity'] }) {
  return (
    <Badge
      variant="outline"
      className={cn(
        "text-xs",
        severity === 'pass' && "border-green-500 text-green-500",
        severity === 'warning' && "border-yellow-500 text-yellow-500",
        severity === 'critical' && "border-red-500 text-red-500"
      )}
    >
      {severity}
    </Badge>
  );
}

export function CriticCard({ output, isActive }: CriticCardProps) {
  if (!output) return null;

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-500';
    if (score >= 60) return 'text-yellow-500';
    return 'text-red-500';
  };

  return (
    <Card className={cn(
      "transition-all duration-300",
      isActive && "ring-2 ring-orange-500 shadow-lg shadow-orange-500/20"
    )}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-base">
            <MessageSquare className="h-5 w-5 text-orange-500" />
            Critic Module
          </CardTitle>
          <Badge variant={isActive ? "default" : "secondary"} className={cn(
            isActive && "bg-orange-500 hover:bg-orange-600"
          )}>
            {isActive ? "Analyzing" : "Review Complete"}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Quality Score */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Quality Score</span>
            <span className={cn("text-lg font-bold", getScoreColor(output.overallScore))}>
              {output.overallScore}/100
            </span>
          </div>
          <Progress value={output.overallScore} className="h-2" />
        </div>

        {/* Critiques */}
        <div className="space-y-3">
          <h4 className="text-sm font-medium">Feedback Items:</h4>
          {output.critiques.map((critique) => (
            <div
              key={critique.id}
              className={cn(
                "p-3 rounded-lg border",
                critique.severity === 'pass' && "bg-green-500/5 border-green-500/20",
                critique.severity === 'warning' && "bg-yellow-500/5 border-yellow-500/20",
                critique.severity === 'critical' && "bg-red-500/5 border-red-500/20"
              )}
            >
              <div className="flex items-start gap-3">
                <SeverityIcon severity={critique.severity} />
                <div className="flex-1 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">{critique.issue}</span>
                    <SeverityBadge severity={critique.severity} />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    💡 {critique.suggestion}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
