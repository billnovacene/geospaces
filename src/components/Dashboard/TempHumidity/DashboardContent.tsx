
import { MonthlyOverview } from "@/components/Dashboard/TempHumidity/MonthlyOverview";
import { DailyOverview } from "@/components/Dashboard/TempHumidity/DailyOverview";
import { MonthlyOverviewPoint, DailyOverviewPoint, StatsData } from "@/services/interfaces/temp-humidity";

interface DashboardContentProps {
  data: {
    daily: DailyOverviewPoint[];
    monthly: MonthlyOverviewPoint[];
    stats: StatsData;
  };
  contextName?: string;
  isMockData?: boolean;
  isCachedData?: boolean;
  onRefresh?: () => void;
}

export function DashboardContent({ 
  data, 
  contextName = "All Locations", 
  isMockData = false,
  isCachedData = false,
  onRefresh
}: DashboardContentProps) {
  // Calculate the min/max temperatures from monthly data
  const calculateMonthlyStats = () => {
    if (!data.monthly || data.monthly.length === 0) {
      return { minTemp: "0", maxTemp: "0" };
    }
    
    const minTemps = data.monthly.map(point => point.minTemp);
    const maxTemps = data.monthly.map(point => point.maxTemp);
    
    return {
      minTemp: Math.min(...minTemps).toFixed(1),
      maxTemp: Math.max(...maxTemps).toFixed(1)
    };
  };
  
  // Calculate the daily min/max temperatures
  const calculateDailyStats = () => {
    if (!data.daily || data.daily.length === 0) {
      return { minTemp: "0", maxTemp: "0" };
    }
    
    const temps = data.daily.map(point => point.temperature);
    
    return {
      minTemp: Math.min(...temps).toFixed(1),
      maxTemp: Math.max(...temps).toFixed(1)
    };
  };
  
  const monthlyStats = calculateMonthlyStats();
  const dailyStats = calculateDailyStats();
  
  // Check if we have real temperature data in the daily dataset
  const hasRealDailyData = data.daily.some(point => point.isReal?.temperature);

  return (
    <>
      {/* Monthly Overview */}
      <MonthlyOverview 
        data={data.monthly}
        contextName={contextName}
        stats={monthlyStats}
        isCachedData={isCachedData}
        onRefresh={onRefresh}
      />

      {/* Daily Overview */}
      <DailyOverview 
        data={data.daily}
        isMockData={isMockData}
        contextName={contextName}
        stats={dailyStats}
        hasRealDailyData={hasRealDailyData}
      />
    </>
  );
}
