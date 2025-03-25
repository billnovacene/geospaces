
import { MonthlyOverview } from "@/components/Dashboard/TempHumidity/MonthlyOverview";
import { DailyOverview } from "@/components/Dashboard/TempHumidity/DailyOverview";
import { MonthlyOverviewPoint, DailyOverviewPoint, StatsData } from "@/services/interfaces/temp-humidity";

interface DashboardContentProps {
  data: {
    daily: DailyOverviewPoint[];
    monthly: MonthlyOverviewPoint[];
    stats: StatsData;
    operatingHours?: {
      startTime: string;
      endTime: string;
    };
    sourceData?: {
      temperatureSensors: Array<{id: string; name: string}>;
      humiditySensors: Array<{id: string; name: string}>;
    };
  };
  contextName?: string;
  isMockData?: boolean;
  operatingHours?: {
    startTime: string;
    endTime: string;
  };
  isLoadingMonthly?: boolean;
  isLoadingDaily?: boolean;
}

export function DashboardContent({ 
  data, 
  contextName = "All Locations", 
  isMockData = false,
  isLoadingMonthly = false,
  isLoadingDaily = false
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
  
  // Calculate the daily min/max temperatures using only real data if available
  const calculateDailyStats = () => {
    if (!data.daily || data.daily.length === 0) {
      return { minTemp: "0", maxTemp: "0" };
    }
    
    // Filter out null values and only include real data if available
    const realDataPoints = data.daily.filter(point => 
      point.temperature !== null && 
      point.temperature !== undefined && 
      point.isReal?.temperature === true
    );
    
    // If we have real data points, use those for min/max calculations
    const usePoints = realDataPoints.length > 0 ? realDataPoints : data.daily;
    const temps = usePoints
      .filter(point => point.temperature !== null && point.temperature !== undefined)
      .map(point => point.temperature);
    
    if (temps.length === 0) return { minTemp: "0", maxTemp: "0" };
    
    return {
      minTemp: Math.min(...temps).toFixed(1),
      maxTemp: Math.max(...temps).toFixed(1)
    };
  };
  
  const monthlyStats = calculateMonthlyStats();
  const dailyStats = calculateDailyStats();
  
  // Check if we have real temperature data in the daily dataset
  const hasRealDailyData = data.daily.some(point => point.isReal?.temperature === true);
  const realDailyDataCount = data.daily.filter(point => point.isReal?.temperature === true).length;

  // Log data about real vs simulated data for debugging
  console.log(`DashboardContent: Has real daily data: ${hasRealDailyData}, isMockData: ${isMockData}`);
  console.log(`DashboardContent: Real data points: ${realDailyDataCount}/${data.daily.length} (${(realDailyDataCount/data.daily.length*100).toFixed(1)}%)`);
  console.log(`DashboardContent: Source sensors: ${data?.sourceData?.temperatureSensors?.length || 0} temperature, ${data?.sourceData?.humiditySensors?.length || 0} humidity`);

  return (
    <>
      {/* Daily Overview - moved to top */}
      <DailyOverview 
        data={data.daily}
        isMockData={isMockData}
        contextName={contextName}
        stats={dailyStats}
        hasRealDailyData={hasRealDailyData}
        operatingHours={data.operatingHours}
        isLoading={isLoadingDaily}
      />

      {/* Monthly Overview */}
      <MonthlyOverview 
        data={data.monthly}
        contextName={contextName}
        stats={monthlyStats}
        isLoading={isLoadingMonthly}
      />
    </>
  );
}
