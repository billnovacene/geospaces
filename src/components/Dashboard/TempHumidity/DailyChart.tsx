
import { DailyOverviewPoint, MonthlyOverviewPoint } from "@/services/interfaces/temp-humidity";
import { useState } from "react";
import { subDays, addDays } from "date-fns";
import { sensorTypes } from "@/utils/sensorThresholds";
import { ChartHeader } from "./ChartHeader";
import { ChartLegend } from "./ChartLegend";
import { TemperatureBarChart } from "./TemperatureBarChart";
import { ChartControls } from "./ChartControls";
import { 
  enhanceDailyChartData, 
  calculateChartRange, 
  filterRelevantThresholds 
} from "./utils/chartUtils";
import { calculateHourlyAveragesFromMonth } from "./utils/monthlyAverageUtils";
import { toast } from "sonner";

interface DailyChartProps {
  data: DailyOverviewPoint[];
  monthlyData?: MonthlyOverviewPoint[];
  isMockData?: boolean;
}

export function DailyChart({ data, monthlyData = [], isMockData = false }: DailyChartProps) {
  const [selectedDate, setSelectedDate] = useState(new Date());
  
  // Count real data points - ensuring we check isReal.temperature properly
  const realDataPointsCount = data.filter(point => point.isReal?.temperature === true).length;
  const totalDataPoints = data.length;
  const hasRealData = realDataPointsCount > 0;
  
  console.log(`Daily chart rendering: ${realDataPointsCount}/${totalDataPoints} real data points, hasRealData: ${hasRealData}, isMockData: ${isMockData}`);
  
  // If we have no real data and monthly data is available, 
  // calculate hourly averages from the monthly data which only uses real data
  let processedData = data;
  
  if (!hasRealData && monthlyData && monthlyData.length > 0) {
    console.log("No real daily data available, calculating hourly averages from monthly data (API-based only)");
    processedData = calculateHourlyAveragesFromMonth(monthlyData);
    
    // If we still don't have data, notify the user
    if (processedData.every(point => point.temperature === null)) {
      toast.error("No real data is available from the API for this view", {
        description: "Please check your API connection or try another zone."
      });
    }
  }
  
  // Process data for chart rendering
  const enhancedData = enhanceDailyChartData(processedData);
  const { yAxisMin, yAxisMax } = calculateChartRange(processedData);
  const temperatureConfig = sensorTypes.temperature;
  const relevantThresholds = filterRelevantThresholds(
    temperatureConfig.thresholds, 
    yAxisMin, 
    yAxisMax
  );

  // Navigation handlers
  const handlePrevDay = () => {
    setSelectedDate(prev => subDays(prev, 1));
  };
  
  const handleNextDay = () => {
    const newDate = addDays(selectedDate, 1);
    if (newDate <= new Date()) {
      setSelectedDate(newDate);
    }
  };

  return (
    <div className="w-full h-full">
      <ChartHeader 
        realDataPointsCount={realDataPointsCount}
        totalDataPoints={totalDataPoints}
        hasRealData={hasRealData}
        selectedDate={selectedDate}
      />
      
      <ChartLegend 
        colors={temperatureConfig.colors} 
        showSimulated={false} // Never show simulated data label
      />
      
      <TemperatureBarChart 
        data={enhancedData}
        yAxisMin={yAxisMin}
        yAxisMax={yAxisMax}
        relevantThresholds={relevantThresholds}
      />
      
      <ChartControls
        selectedDate={selectedDate}
        onPrevDay={handlePrevDay}
        onNextDay={handleNextDay}
      />
    </div>
  );
}
