
import { DailyOverviewPoint, MonthlyOverviewPoint } from "@/services/temp-humidity";
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
  console.log("Sample isReal flags:", data.slice(0, 3).map(d => d.isReal));
  
  // If we have no real data and monthly data is available, 
  // calculate hourly averages from the monthly data
  let processedData = data;
  if (!hasRealData && monthlyData && monthlyData.length > 0) {
    console.log("No real daily data available, calculating hourly averages from monthly data");
    processedData = calculateHourlyAveragesFromMonth(monthlyData);
    console.log("Generated hourly averages:", processedData.slice(0, 3));
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
        showSimulated={!hasRealData || realDataPointsCount < totalDataPoints} 
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
