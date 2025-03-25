
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
  const realDataPointsCount = data.filter(point => point.isReal?.temperature === true).length;
  const totalDataPoints = data.length;
  const hasRealData = realDataPointsCount > 0;
  
  console.log(`Daily chart: ${realDataPointsCount}/${totalDataPoints} real data points, hasRealData: ${hasRealData}, isMockData: ${isMockData}`);
  
  // Log each point's real/simulated status for debugging
  data.forEach((point, idx) => {
    const isRealPoint = point.isReal?.temperature === true;
    if (idx < 5 || isRealPoint) { // Only log first 5 points and any real points
      console.log(`Point ${idx} (${point.time}): temperature=${point.temperature?.toFixed(1)}, isReal=${isRealPoint}`);
    }
  });
  
  const enhancedData = data.map(point => {
    // Use real colors for real data, grey for simulated
    const isRealDataPoint = point.isReal?.temperature === true;
    
    const barColor = isRealDataPoint 
      ? getSensorValueColor("temperature", point.temperature)
      : "#E5E7EB"; // Gray for simulated data
    
    return {
      ...point,
      barColor,
      // Create a label for the tooltip
      label: isRealDataPoint ? "Real data" : "Simulated data"
    };
  });

  // Calculate actual min and max temps from the data
  const tempValues = data.filter(d => d.temperature !== null && d.temperature !== undefined).map(d => d.temperature);
  const actualMinTemp = tempValues.length > 0 ? Math.min(...tempValues) : 10;
  const actualMaxTemp = tempValues.length > 0 ? Math.max(...tempValues) : 30;
  
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
        showSimulated={!hasRealData || realDataPointsCount < totalDataPoints} 
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
