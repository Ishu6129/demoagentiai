import { useState, useCallback } from 'react';
import {
  AgentState,
  AgentPhase,
  MemoryEntry,
  PlannerOutput,
  ExecutorOutput,
  CriticOutput,
  RefinementOutput
} from '@/types/agent';
import {
  EXAMPLE_GOALS,
  internshipPlannerOutput,
  internshipExecutorOutputs,
  internshipCriticOutput,
  internshipRefinementOutput,
  fibonacciPlannerOutput,
  fibonacciExecutorOutputs,
  fibonacciCriticOutput,
  fibonacciRefinementOutput
} from '@/data/mockResponses';

const PHASE_DELAY = 1500; // Delay between phases for visualization
const TASK_DELAY = 800; // Delay between task completions

const initialState: AgentState = {
  goal: '',
  phase: 'idle',
  plannerOutput: null,
  executorOutputs: [],
  criticOutput: null,
  refinementOutput: null
};

export function useAgent() {
  const [state, setState] = useState<AgentState>(initialState);
  const [memory, setMemory] = useState<MemoryEntry[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

  const getMockData = (goal: string) => {
    const isInternship = goal.toLowerCase().includes('internship') || 
                         goal.toLowerCase().includes('fake') ||
                         goal.toLowerCase().includes('legitimate');
    
    return {
      planner: isInternship ? internshipPlannerOutput : fibonacciPlannerOutput,
      executor: isInternship ? internshipExecutorOutputs : fibonacciExecutorOutputs,
      critic: isInternship ? internshipCriticOutput : fibonacciCriticOutput,
      refinement: isInternship ? internshipRefinementOutput : fibonacciRefinementOutput
    };
  };

  const setPhase = (phase: AgentPhase) => {
    setState(prev => ({ ...prev, phase }));
  };

  const runPlanner = async (plannerOutput: PlannerOutput) => {
    setPhase('planning');
    await delay(PHASE_DELAY);
    
    // Animate subtasks appearing one by one
    const tasks = [...plannerOutput.subTasks];
    for (let i = 0; i < tasks.length; i++) {
      tasks[i] = { ...tasks[i], status: 'pending' };
      setState(prev => ({
        ...prev,
        plannerOutput: { ...plannerOutput, subTasks: [...tasks] }
      }));
      await delay(TASK_DELAY / 2);
    }
  };

  const runExecutor = async (plannerOutput: PlannerOutput, executorOutputs: ExecutorOutput[]) => {
    setPhase('executing');
    await delay(PHASE_DELAY / 2);

    for (let i = 0; i < executorOutputs.length; i++) {
      // Mark current task as active
      const updatedTasks = plannerOutput.subTasks.map((task, idx) => ({
        ...task,
        status: idx < i ? 'completed' : idx === i ? 'active' : 'pending'
      } as const));
      
      setState(prev => ({
        ...prev,
        plannerOutput: { ...plannerOutput, subTasks: updatedTasks }
      }));
      
      await delay(TASK_DELAY);
      
      // Add executor output
      setState(prev => ({
        ...prev,
        executorOutputs: [...prev.executorOutputs, executorOutputs[i]]
      }));
      
      // Mark task as completed
      updatedTasks[i] = { ...updatedTasks[i], status: 'completed' };
      setState(prev => ({
        ...prev,
        plannerOutput: { ...plannerOutput, subTasks: updatedTasks }
      }));
    }
  };

  const runCritic = async (criticOutput: CriticOutput) => {
    setPhase('critiquing');
    await delay(PHASE_DELAY);
    
    // Add critiques one by one
    for (let i = 0; i < criticOutput.critiques.length; i++) {
      setState(prev => ({
        ...prev,
        criticOutput: {
          ...criticOutput,
          critiques: criticOutput.critiques.slice(0, i + 1)
        }
      }));
      await delay(TASK_DELAY / 2);
    }
    
    // Show final score
    setState(prev => ({
      ...prev,
      criticOutput
    }));
  };

  const runRefinement = async (refinementOutput: RefinementOutput) => {
    setPhase('refining');
    await delay(PHASE_DELAY);
    
    setState(prev => ({
      ...prev,
      refinementOutput
    }));
    
    await delay(PHASE_DELAY);
    setPhase('complete');
  };

  const processGoal = useCallback(async (goal: string) => {
    if (isProcessing || !goal.trim()) return;
    
    setIsProcessing(true);
    setState({ ...initialState, goal });
    
    const mockData = getMockData(goal);
    
    try {
      // Phase 1: Planning
      await runPlanner(mockData.planner);
      
      // Phase 2: Executing
      await runExecutor(mockData.planner, mockData.executor);
      
      // Phase 3: Critiquing
      await runCritic(mockData.critic);
      
      // Phase 4: Refining
      await runRefinement(mockData.refinement);
      
      // Add to memory
      const memoryEntry: MemoryEntry = {
        id: Date.now().toString(),
        timestamp: new Date(),
        goal,
        result: 'Completed successfully',
        phase: 'complete'
      };
      
      setMemory(prev => [memoryEntry, ...prev]);
      
    } catch (error) {
      console.error('Agent processing error:', error);
    } finally {
      setIsProcessing(false);
    }
  }, [isProcessing]);

  const reset = useCallback(() => {
    setState(initialState);
    setIsProcessing(false);
  }, []);

  const clearMemory = useCallback(() => {
    setMemory([]);
  }, []);

  return {
    state,
    memory,
    isProcessing,
    processGoal,
    reset,
    clearMemory,
    exampleGoals: EXAMPLE_GOALS
  };
}
