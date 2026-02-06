import { useState, useCallback } from 'react';
import { WorkflowAgent, DEFAULT_AGENTS, AgentType } from '@/types/workflow';
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

const PHASE_DELAY = 1500;
const TASK_DELAY = 800;

const initialState: AgentState = {
  goal: '',
  phase: 'idle',
  plannerOutput: null,
  executorOutputs: [],
  criticOutput: null,
  refinementOutput: null
};

export function useWorkflow() {
  const [agents, setAgents] = useState<WorkflowAgent[]>(DEFAULT_AGENTS);
  const [state, setState] = useState<AgentState>(initialState);
  const [memory, setMemory] = useState<MemoryEntry[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [skippedAgents, setSkippedAgents] = useState<AgentType[]>([]);

  const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

  const getEnabledAgents = useCallback(() => {
    return agents.filter(a => a.enabled).sort((a, b) => a.position - b.position);
  }, [agents]);

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

  const isAgentEnabled = useCallback((type: AgentType) => {
    return agents.find(a => a.type === type)?.enabled ?? false;
  }, [agents]);

  const setPhase = (phase: AgentPhase) => {
    setState(prev => ({ ...prev, phase }));
  };

  const runPlanner = async (plannerOutput: PlannerOutput) => {
    if (!isAgentEnabled('planner')) {
      setSkippedAgents(prev => [...prev, 'planner']);
      return;
    }
    
    setPhase('planning');
    await delay(PHASE_DELAY);
    
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
    if (!isAgentEnabled('executor')) {
      setSkippedAgents(prev => [...prev, 'executor']);
      return;
    }
    
    setPhase('executing');
    await delay(PHASE_DELAY / 2);

    for (let i = 0; i < executorOutputs.length; i++) {
      const updatedTasks = plannerOutput.subTasks.map((task, idx) => ({
        ...task,
        status: idx < i ? 'completed' : idx === i ? 'active' : 'pending'
      } as const));
      
      setState(prev => ({
        ...prev,
        plannerOutput: { ...plannerOutput, subTasks: updatedTasks }
      }));
      
      await delay(TASK_DELAY);
      
      setState(prev => ({
        ...prev,
        executorOutputs: [...prev.executorOutputs, executorOutputs[i]]
      }));
      
      updatedTasks[i] = { ...updatedTasks[i], status: 'completed' };
      setState(prev => ({
        ...prev,
        plannerOutput: { ...plannerOutput, subTasks: updatedTasks }
      }));
    }
  };

  const runCritic = async (criticOutput: CriticOutput) => {
    if (!isAgentEnabled('critic')) {
      setSkippedAgents(prev => [...prev, 'critic']);
      return;
    }
    
    setPhase('critiquing');
    await delay(PHASE_DELAY);
    
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
    
    setState(prev => ({
      ...prev,
      criticOutput
    }));
  };

  const runRefinement = async (refinementOutput: RefinementOutput) => {
    if (!isAgentEnabled('refiner')) {
      setSkippedAgents(prev => [...prev, 'refiner']);
      setPhase('complete');
      return;
    }
    
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
    
    const enabledAgents = getEnabledAgents();
    if (enabledAgents.length === 0) return;
    
    setIsProcessing(true);
    setSkippedAgents([]);
    setState({ ...initialState, goal });
    
    const mockData = getMockData(goal);
    
    try {
      await runPlanner(mockData.planner);
      await runExecutor(mockData.planner, mockData.executor);
      await runCritic(mockData.critic);
      await runRefinement(mockData.refinement);
      
      const memoryEntry: MemoryEntry = {
        id: Date.now().toString(),
        timestamp: new Date(),
        goal,
        result: 'Completed successfully',
        phase: 'complete'
      };
      
      setMemory(prev => [memoryEntry, ...prev]);
      
    } catch (error) {
      console.error('Workflow processing error:', error);
    } finally {
      setIsProcessing(false);
    }
  }, [isProcessing, getEnabledAgents, isAgentEnabled]);

  const reset = useCallback(() => {
    setState(initialState);
    setIsProcessing(false);
    setSkippedAgents([]);
  }, []);

  const clearMemory = useCallback(() => {
    setMemory([]);
  }, []);

  return {
    agents,
    setAgents,
    state,
    memory,
    isProcessing,
    skippedAgents,
    processGoal,
    reset,
    clearMemory,
    exampleGoals: EXAMPLE_GOALS
  };
}
