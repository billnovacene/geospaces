import { StatCard } from "@/components/Dashboard/TempHumidity/StatCard";
interface StatsData {
  avgTemp: number;
  minTemp: number;
  maxTemp: number;
  avgHumidity: number;
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
  return <div className="grid grid-cols-5 gap-2">
      <StatCard title="Avg Temp Work" value={stats.avgTemp} unit="°C" status={stats.status.avgTemp} large />
      <StatCard title="Avg Temp Work" value={stats.avgTemp} unit="°C" status={stats.status.avgTemp} large />
      <StatCard title="Avg RH% Work" value={Math.round(stats.avgHumidity)} unit="RH%" status={stats.status.avgHumidity} large />
      <StatCard title="Min temp" value={stats.minTemp} unit="°C" status={stats.status.minTemp} large />
      <StatCard title="Max Temp" value={stats.maxTemp} unit="°C" status={stats.status.maxTemp} large />
    </div>;
}