
import { MonthlyOverview } from "@/components/Dashboard/TempHumidity/MonthlyOverview";
import { DailyOverview } from "@/components/Dashboard/TempHumidity/DailyOverview";
import { MonthlyOverviewPoint, DailyOverviewPoint, StatsData } from "@/services/interfaces/temp-humidity";
import { useState } from "react";

interface DashboardContentProps {
  data: {
    daily: DailyOverviewPoint[];
    monthly: MonthlyOverviewPoint[];
    stats?: StatsData; // Make stats optional to match TempHumidityResponse
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
  onStatsCalculated?: (stats: Partial<StatsData>) => void;
}

export function DashboardContent({ 
  data, 
  contextName = "All Locations", 
  isMockData = false,
  isLoadingMonthly = false,
  isLoadingDaily = false,
  onStatsCalculated
}: DashboardContentProps) {
  // Track calculated stats from progressive data loading
  const [calculatedMonthlyStats, setCalculatedMonthlyStats] = useState({
    minTemp: "0",
    maxTemp: "0"
  });
  
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
    
    if (temps.length === 0) {
      // If no daily data, use monthly stats
      return calculateMonthlyStats();
    }
    
    return {
      minTemp: Math.min(...temps).toFixed(1),
      maxTemp: Math.max(...temps).toFixed(1)
    };
  };
  
  // Handle monthly stats calculation from progressive loading
  const handleMonthlyStatsCalculated = (stats: { avgTemp: number; minTemp: number; maxTemp: number; avgHumidity: number }) => {
    setCalculatedMonthlyStats({
      minTemp: stats.minTemp.toFixed(1),
      maxTemp: stats.maxTemp.toFixed(1)
    });
    
    // Pass stats up to parent component for metrics panel
    if (onStatsCalculated) {
      onStatsCalculated({
        avgTemp: stats.avgTemp,
        minTemp: stats.minTemp,
        maxTemp: stats.maxTemp,
        avgHumidity: stats.avgHumidity,
        status: {
          avgTemp: getTemperatureStatus(stats.avgTemp),
          minTemp: getTemperatureStatus(stats.minTemp),
          maxTemp: getTemperatureStatus(stats.maxTemp),
          avgHumidity: getHumidityStatus(stats.avgHumidity)
        }
      });
    }
  };
  
  // Helper function to determine temperature status
  const getTemperatureStatus = (temp: number): 'good' | 'caution' | 'warning' => {
    if (temp >= 17 && temp <= 22) return 'good';
    if ((temp >= 10 && temp < 17) || (temp > 22 && temp <= 30)) return 'caution';
    return 'warning';
  };
  
  // Helper function to determine humidity status
  const getHumidityStatus = (humidity: number): 'good' | 'caution' | 'warning' => {
    if (humidity >= 40 && humidity <= 60) return 'good';
    if ((humidity >= 30 && humidity < 40) || (humidity > 60 && humidity <= 70)) return 'caution';
    return 'warning';
  };
  
  const monthlyStats = calculateMonthlyStats();
  const dailyStats = calculateDailyStats();
  
  // Use calculated stats from progressive loading if available, otherwise use pre-calculated
  const displayMonthlyStats = calculatedMonthlyStats.maxTemp !== "0" ? 
    calculatedMonthlyStats : monthlyStats;
  
  // Check if we have real temperature data in the daily dataset
  const hasRealDailyData = data.daily.some(point => point.isReal?.temperature === true);
  const realDailyDataCount = data.daily.filter(point => point.isReal?.temperature === true).length;

  // Log data about real vs simulated data for debugging
  console.log(`DashboardContent rendering: Has real daily data: ${hasRealDailyData}, isMockData: ${isMockData}`);
  console.log(`DashboardContent: Real data points: ${realDailyDataCount}/${data.daily.length} (${(realDailyDataCount/data.daily.length*100).toFixed(1)}%)`);
  console.log(`DashboardContent: Available sensors: ${data?.sourceData?.temperatureSensors?.length || 0} temperature, ${data?.sourceData?.humiditySensors?.length || 0} humidity`);
  console.log(`DashboardContent: Monthly data points: ${data.monthly.length}`);

  return (
    <>
      {/* Daily Overview - moved to top */}
      <DailyOverview 
        data={data.daily}
        monthlyData={data.monthly}
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
        stats={displayMonthlyStats}
        isLoading={isLoadingMonthly}
      />
    </>
  );
}
