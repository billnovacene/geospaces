
import { StatCard } from "@/components/Dashboard/TempHumidity/StatCard";
import { LiveDataMetrics } from "@/components/Dashboard/TempHumidity/LiveDataMetrics";

interface StatsData {
  avgTemp: number;
  minTemp: number;
  maxTemp: number;
  avgHumidity: number;
  lastSeen?: string;
  status: {
    avgTemp: 'good' | 'caution' | 'warning';
    minTemp: 'good' | 'caution' | 'warning';
    maxTemp: 'good' | 'caution' | 'warning';
    avgHumidity: 'good' | 'caution' | 'warning';
  };
}

interface TempHumidityStatsProps {
  stats: StatsData;
}

export function TempHumidityStats({
  stats
}: TempHumidityStatsProps) {
  return (
    <div className="grid grid-cols-5 gap-2">
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
