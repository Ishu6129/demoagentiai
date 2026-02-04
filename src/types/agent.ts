export type AgentPhase = 'idle' | 'planning' | 'executing' | 'critiquing' | 'refining' | 'complete';

export interface SubTask {
  id: number;
  title: string;
  status: 'pending' | 'active' | 'completed';
}

export interface PlannerOutput {
  subTasks: SubTask[];
  reasoning: string;
}

export interface ExecutorOutput {
  taskId: number;
  result: string;
  type: 'analysis' | 'code' | 'text';
}

export interface CritiqueItem {
  id: number;
  issue: string;
  severity: 'pass' | 'warning' | 'critical';
  suggestion: string;
}

export interface CriticOutput {
  critiques: CritiqueItem[];
  overallScore: number;
}

export interface RefinementOutput {
  original: string;
  refined: string;
  improvements: string[];
}

export interface AgentState {
  goal: string;
  phase: AgentPhase;
  plannerOutput: PlannerOutput | null;
  executorOutputs: ExecutorOutput[];
  criticOutput: CriticOutput | null;
  refinementOutput: RefinementOutput | null;
}

export interface MemoryEntry {
  id: string;
  timestamp: Date;
  goal: string;
  result: string;
  phase: AgentPhase;
}
