import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { AgentDashboard } from '@/components/agent/AgentDashboard';

const Index = () => {
  return (
    <DashboardLayout>
      <AgentDashboard />
    </DashboardLayout>
  );
};

export default Index;
