export type AgentType = 'planner' | 'executor' | 'critic' | 'refiner';

export interface WorkflowAgent {
  id: string;
  type: AgentType;
  name: string;
  description: string;
  icon: string;
  color: string;
  enabled: boolean;
  position: number;
}

export interface WorkflowConnection {
  from: string;
  to: string;
}

export interface WorkflowConfig {
  agents: WorkflowAgent[];
  connections: WorkflowConnection[];
}

export const DEFAULT_AGENTS: WorkflowAgent[] = [
  {
    id: 'planner',
    type: 'planner',
    name: 'Planner',
    description: 'Breaks down goals into sub-tasks',
    icon: 'Brain',
    color: 'planner',
    enabled: true,
    position: 0
  },
  {
    id: 'executor',
    type: 'executor',
    name: 'Executor',
    description: 'Executes each sub-task',
    icon: 'Zap',
    color: 'executor',
    enabled: true,
    position: 1
  },
  {
    id: 'critic',
    type: 'critic',
    name: 'Critic',
    description: 'Evaluates and critiques outputs',
    icon: 'Eye',
    color: 'critic',
    enabled: true,
    position: 2
  },
  {
    id: 'refiner',
    type: 'refiner',
    name: 'Refiner',
    description: 'Improves based on feedback',
    icon: 'Sparkles',
    color: 'refiner',
    enabled: true,
    position: 3
  }
];
