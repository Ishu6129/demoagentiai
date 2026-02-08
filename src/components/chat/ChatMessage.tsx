import { ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { Bot, User, Brain, Zap, AlertTriangle, Sparkles, CheckCircle2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

type MessageRole = 'user' | 'planner' | 'executor' | 'critic' | 'refiner' | 'system';

interface ChatMessageProps {
  role: MessageRole;
  content: ReactNode;
  isLoading?: boolean;
  timestamp?: Date;
  status?: 'pending' | 'active' | 'complete';
}

const roleConfig: Record<MessageRole, { icon: typeof Bot; label: string; color: string; bgColor: string }> = {
  user: { 
    icon: User, 
    label: 'You', 
    color: 'text-primary',
    bgColor: 'bg-primary/10'
  },
  planner: { 
    icon: Brain, 
    label: 'Planner Agent', 
    color: 'text-[hsl(var(--agent-planner))]',
    bgColor: 'bg-[hsl(var(--agent-planner))]/10'
  },
  executor: { 
    icon: Zap, 
    label: 'Executor Agent', 
    color: 'text-[hsl(var(--agent-executor))]',
    bgColor: 'bg-[hsl(var(--agent-executor))]/10'
  },
  critic: { 
    icon: AlertTriangle, 
    label: 'Critic Agent', 
    color: 'text-[hsl(var(--agent-critic))]',
    bgColor: 'bg-[hsl(var(--agent-critic))]/10'
  },
  refiner: { 
    icon: Sparkles, 
    label: 'Refiner Agent', 
    color: 'text-[hsl(var(--agent-refiner))]',
    bgColor: 'bg-[hsl(var(--agent-refiner))]/10'
  },
  system: { 
    icon: CheckCircle2, 
    label: 'System', 
    color: 'text-[hsl(var(--agent-complete))]',
    bgColor: 'bg-[hsl(var(--agent-complete))]/10'
  }
};

export function ChatMessage({ role, content, isLoading, timestamp, status }: ChatMessageProps) {
  const config = roleConfig[role];
  const Icon = config.icon;

  return (
    <div className={cn(
      "flex gap-3 p-4 rounded-xl transition-all animate-fade-in",
      role === 'user' ? 'bg-muted/50' : config.bgColor
    )}>
      {/* Avatar */}
      <div className={cn(
        "flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center",
        config.bgColor,
        config.color
      )}>
        <Icon className="h-4 w-4" />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0 space-y-2">
        <div className="flex items-center gap-2">
          <span className={cn("font-semibold text-sm", config.color)}>
            {config.label}
          </span>
          {status === 'active' && (
            <Badge variant="outline" className="text-xs animate-pulse border-primary/50 text-primary">
              Processing...
            </Badge>
          )}
          {status === 'complete' && (
            <Badge variant="outline" className="text-xs border-[hsl(var(--agent-complete))]/50 text-[hsl(var(--agent-complete))]">
              ✓ Complete
            </Badge>
          )}
          {timestamp && (
            <span className="text-xs text-muted-foreground ml-auto">
              {timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
          )}
        </div>

        <div className="text-sm text-foreground/90 prose prose-sm dark:prose-invert max-w-none">
          {isLoading ? (
            <div className="flex items-center gap-1">
              <span className="w-2 h-2 bg-current rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
              <span className="w-2 h-2 bg-current rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
              <span className="w-2 h-2 bg-current rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
            </div>
          ) : (
            content
          )}
        </div>
      </div>
    </div>
  );
}
