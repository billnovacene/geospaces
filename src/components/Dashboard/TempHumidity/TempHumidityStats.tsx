
import { StatCard } from "@/components/Dashboard/TempHumidity/StatCard";
import { LiveDataMetrics } from "@/components/Dashboard/TempHumidity/LiveDataMetrics";
import { StatsData } from "@/services/interfaces/temp-humidity";
import { Skeleton } from "@/components/ui/skeleton";
import { LoaderCircle } from "lucide-react";

interface TempHumidityStatsProps {
  stats: StatsData;
  isLoading?: boolean;
}

export function TempHumidityStats({
  stats,
  isLoading = false
}: TempHumidityStatsProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-2">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-white border rounded-lg p-4 relative overflow-hidden">
            <div className="animate-pulse">
              <Skeleton className="h-4 w-28 mb-3" />
              <div className="flex items-center justify-between">
                <Skeleton className="h-8 w-16" />
                <Skeleton className="h-6 w-6 rounded-full" />
              </div>
              <Skeleton className="h-3 w-20 mt-3" />
            </div>
          </div>
        ))}
        <div className="bg-white border rounded-lg p-4 flex flex-col items-center justify-center">
          <LoaderCircle className="h-6 w-6 animate-spin text-blue-600 mb-2" />
          <span className="text-sm text-gray-500">Calculating metrics...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-2">
      <StatCard 
        title="Avg Temperature" 
        value={stats.avgTemp.toFixed(1)} 
        unit="°C" 
        status={stats.status.avgTemp} 
        sensorType="temperature" 
        sensorValue={stats.avgTemp}
        lastSeen={stats.lastSeen}
        icon="avg"
      />
      <StatCard 
        title="Min Temperature" 
        value={stats.minTemp.toFixed(1)} 
        unit="°C" 
        status={stats.status.minTemp} 
        sensorType="temperature" 
        sensorValue={stats.minTemp}
        lastSeen={stats.lastSeen}
        icon="min"
        trend="down"
      />
      <StatCard 
        title="Max Temperature" 
        value={stats.maxTemp.toFixed(1)} 
        unit="°C" 
        status={stats.status.maxTemp} 
        sensorType="temperature" 
        sensorValue={stats.maxTemp}
        lastSeen={stats.lastSeen}
        icon="max"
        trend="up"
      />
      <StatCard 
        title="Avg Humidity" 
        value={Math.round(stats.avgHumidity)} 
        unit="%" 
        status={stats.status.avgHumidity} 
        sensorType="humidity" 
        sensorValue={stats.avgHumidity}
        lastSeen={stats.lastSeen}
        icon="humidity"
      />
      <LiveDataMetrics />
    </div>
  );
}
