
import { DailyOverviewPoint } from "@/services/temp-humidity";
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

interface DailyChartProps {
  data: DailyOverviewPoint[];
  isMockData?: boolean;
}

export function DailyChart({ data, isMockData = false }: DailyChartProps) {
  const [selectedDate, setSelectedDate] = useState(new Date());
  
  // Count real data points
  const realDataPointsCount = data.filter(point => point.isReal?.temperature === true).length;
  const totalDataPoints = data.length;
  const hasRealData = realDataPointsCount > 0;
  
  console.log(`Daily chart rendering: ${realDataPointsCount}/${totalDataPoints} real data points, hasRealData: ${hasRealData}, isMockData: ${isMockData}`);
  
  // Process data for chart rendering
  const enhancedData = enhanceDailyChartData(data);
  const { yAxisMin, yAxisMax } = calculateChartRange(data);
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
