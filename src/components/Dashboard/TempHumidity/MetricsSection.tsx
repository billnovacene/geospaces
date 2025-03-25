
import { TempHumidityStats } from "@/components/Dashboard/TempHumidity/TempHumidityStats";
import { SensorSourceInfo } from "@/components/Dashboard/TempHumidity/SensorSourceInfo";
import { StatsData, SensorSourceData } from "@/services/interfaces/temp-humidity";

interface MetricsSectionProps {
  stats: StatsData;
  sourceData: SensorSourceData;
  isUsingMockData: boolean;
}

export function MetricsSection({ stats, sourceData, isUsingMockData }: MetricsSectionProps) {
  return (
    <>
      <div className="mb-8">
        <h3 className="text-lg font-medium mb-3">Live Metrics</h3>
        <TempHumidityStats stats={stats} />
      </div>
      
      <div className="mb-8">
        <SensorSourceInfo 
          sourceData={sourceData} 
          isLoading={false}
          isMockData={isUsingMockData}
        />
      </div>
    </>
  );
}
