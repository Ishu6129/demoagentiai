import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Brain, Zap, Eye, Sparkles, GripVertical, X, CheckCircle2, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { WorkflowAgent } from '@/types/workflow';

interface WorkflowNodeProps {
  agent: WorkflowAgent;
  onToggle: (id: string) => void;
  onRemove: (id: string) => void;
  isActive?: boolean;
  isComplete?: boolean;
  canRemove?: boolean;
}

const iconMap = {
  Brain,
  Zap,
  Eye,
  Sparkles
};

const colorStyles = {
  planner: {
    border: 'border-agent-planner',
    bg: 'bg-agent-planner/10',
    text: 'text-agent-planner',
    ring: 'ring-agent-planner',
    shadow: 'shadow-agent-planner/30'
  },
  executor: {
    border: 'border-agent-executor',
    bg: 'bg-agent-executor/10',
    text: 'text-agent-executor',
    ring: 'ring-agent-executor',
    shadow: 'shadow-agent-executor/30'
  },
  critic: {
    border: 'border-agent-critic',
    bg: 'bg-agent-critic/10',
    text: 'text-agent-critic',
    ring: 'ring-agent-critic',
    shadow: 'shadow-agent-critic/30'
  },
  refiner: {
    border: 'border-agent-refiner',
    bg: 'bg-agent-refiner/10',
    text: 'text-agent-refiner',
    ring: 'ring-agent-refiner',
    shadow: 'shadow-agent-refiner/30'
  }
};

export function WorkflowNode({ 
  agent, 
  onToggle, 
  onRemove, 
  isActive = false,
  isComplete = false,
  canRemove = true 
}: WorkflowNodeProps) {
  const Icon = iconMap[agent.icon as keyof typeof iconMap] || Brain;
  const colors = colorStyles[agent.color as keyof typeof colorStyles] || colorStyles.planner;

  return (
    <Card className={cn(
      "relative p-4 w-48 transition-all duration-300 group",
      agent.enabled ? "opacity-100" : "opacity-50",
      isActive && [colors.ring, "ring-2", "shadow-lg", colors.shadow],
      isComplete && "border-agent-complete/50"
    )}>
      {/* Drag Handle */}
      <div className="absolute left-1 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-50 cursor-grab">
        <GripVertical className="h-4 w-4 text-muted-foreground" />
      </div>

      {/* Remove Button */}
      {canRemove && (
        <Button
          variant="ghost"
          size="icon"
          className="absolute -right-2 -top-2 h-6 w-6 rounded-full bg-background border shadow-sm opacity-0 group-hover:opacity-100 transition-opacity"
          onClick={() => onRemove(agent.id)}
        >
          <X className="h-3 w-3" />
        </Button>
      )}

      {/* Status Badge */}
      {isActive && (
        <Badge 
          className={cn(
            "absolute -top-2 left-1/2 -translate-x-1/2 gap-1",
            colors.bg, colors.text, "border", colors.border
          )}
        >
          <Loader2 className="h-3 w-3 animate-spin" />
          Active
        </Badge>
      )}
      
      {isComplete && !isActive && (
        <Badge 
          className="absolute -top-2 left-1/2 -translate-x-1/2 gap-1 bg-agent-complete/10 text-agent-complete border-agent-complete/30"
        >
          <CheckCircle2 className="h-3 w-3" />
          Done
        </Badge>
      )}

      <div className="flex flex-col items-center gap-3">
        {/* Icon */}
        <div className={cn(
          "p-3 rounded-xl transition-all",
          colors.bg,
          isActive && "animate-pulse"
        )}>
          <Icon className={cn("h-6 w-6", colors.text)} />
        </div>

        {/* Name & Description */}
        <div className="text-center">
          <h4 className="font-semibold text-sm">{agent.name}</h4>
          <p className="text-xs text-muted-foreground mt-0.5">
            {agent.description}
          </p>
        </div>

        {/* Enable/Disable Toggle */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground">
            {agent.enabled ? 'Enabled' : 'Disabled'}
          </span>
          <Switch 
            checked={agent.enabled} 
            onCheckedChange={() => onToggle(agent.id)}
            className="scale-75"
          />
        </div>
      </div>

      {/* Connection Points */}
      <div className="absolute left-1/2 -translate-x-1/2 -bottom-3 w-3 h-3 rounded-full bg-border border-2 border-background" />
      <div className="absolute left-1/2 -translate-x-1/2 -top-3 w-3 h-3 rounded-full bg-border border-2 border-background" />
    </Card>
  );
}
