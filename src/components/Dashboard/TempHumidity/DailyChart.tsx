
import { DailyOverviewPoint } from "@/services/temp-humidity";
import { useState } from "react";
import { subDays, addDays } from "date-fns";
import { sensorTypes, getSensorValueColor } from "@/utils/sensorThresholds";
import { ChartHeader } from "./ChartHeader";
import { ChartLegend } from "./ChartLegend";
import { TemperatureBarChart } from "./TemperatureBarChart";
import { DateNavigator } from "./DateNavigator";

interface DailyChartProps {
  data: DailyOverviewPoint[];
  isMockData?: boolean;
}

export function DailyChart({ data, isMockData = false }: DailyChartProps) {
  const [selectedDate, setSelectedDate] = useState(new Date());
  
  const handlePrevDay = () => {
    setSelectedDate(prev => subDays(prev, 1));
  };
  
  const handleNextDay = () => {
    const newDate = addDays(selectedDate, 1);
    if (newDate <= new Date()) {
      setSelectedDate(newDate);
    }
  };
  
  const temperatureConfig = sensorTypes.temperature;
  
  // Count real data points
  const realDataPointsCount = data.filter(point => point.isReal?.temperature).length;
  const totalDataPoints = data.length;
  const hasRealData = realDataPointsCount > 0;
  
  const enhancedData = data.map(point => {
    const barColor = point.isReal?.temperature 
      ? getSensorValueColor("temperature", point.temperature)
      : "#E5E7EB"; // Gray for simulated data
    
    return {
      ...point,
      barColor,
      // Create a label for the tooltip
      label: point.isReal?.temperature ? "Real data" : "Simulated data"
    };
  });

  const actualMinTemp = Math.min(...data.map(d => d.temperature));
  const actualMaxTemp = Math.max(...data.map(d => d.temperature));
  
  const yAxisMin = Math.floor(actualMinTemp - 2);
  const yAxisMax = Math.ceil(actualMaxTemp + 2);

  // Filter out the thresholds we want to display
  const relevantThresholds = temperatureConfig.thresholds
    .filter(threshold => threshold >= yAxisMin && threshold <= yAxisMax)
    .filter(threshold => threshold !== 28); // Exclude 28°C threshold

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
        showSimulated={!hasRealData} 
      />
      
      <TemperatureBarChart 
        data={enhancedData}
        yAxisMin={yAxisMin}
        yAxisMax={yAxisMax}
        relevantThresholds={relevantThresholds}
      />
      
      <DateNavigator 
        selectedDate={selectedDate}
        onPrevDay={handlePrevDay}
        onNextDay={handleNextDay}
      />
    </div>
  );
}
