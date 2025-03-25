
import { TempHumidityStats } from "@/components/Dashboard/TempHumidity/TempHumidityStats";
import { StatsData } from "@/services/interfaces/temp-humidity";

interface DashboardStatsSectionProps {
  stats: StatsData;
  isLoading: boolean;
  loadingStage: 'initial' | 'daily' | 'stats' | 'monthly' | 'complete';
}

export function DashboardStatsSection({ stats, isLoading, loadingStage }: DashboardStatsSectionProps) {
  // Only show stats when not in initial or daily loading stages
  if (isLoading || loadingStage === 'initial' || loadingStage === 'daily') {
    return null;
  }

  return (
    <div className="mb-8">
      <h3 className="text-lg font-medium mb-3">Live Metrics</h3>
      <TempHumidityStats 
        stats={stats} 
        isLoading={loadingStage === 'stats'} 
      />
    </div>
  );
}
