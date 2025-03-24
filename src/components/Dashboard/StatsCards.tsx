
import { useStatsData } from "./hooks/useStatsData";
import { MainStats } from "./MainStats";
import { EnvironmentalMetrics } from "./EnvironmentalMetrics";

export function StatsCards() {
  // Use our custom hook to get all the stats data
  const { stats, isLoading } = useStatsData();

  return (
    <div className="space-y-8">
      {/* Main stats */}
      <MainStats 
        totalSites={stats.totalSites}
        totalDevices={stats.totalDevices}
        offlineDevices={stats.offlineDevices}
        isLoading={isLoading}
      />

      {/* Environmental metrics with small charts */}
      <EnvironmentalMetrics
        averageTemp={stats.averageTemp}
        averageHumidity={stats.averageHumidity}
        averageCO2={stats.averageCO2}
        tempData={stats.tempData}
        humidityData={stats.humidityData}
        co2Data={stats.co2Data}
        isLoading={isLoading}
      />
    </div>
  );
}
