
import { useState } from "react";
import { DailyOverviewPoint } from "@/services/temp-humidity";
import { ChartHeader } from "../ChartHeader";
import { ChartLegend } from "../ChartLegend";
import { TemperatureBarChart } from "../TemperatureBarChart";
import { DateSelector } from "./DateSelector";
import { useChartData } from "./useChartData";
import { useThresholds } from "./useThresholds";

interface DailyChartProps {
  data: DailyOverviewPoint[];
  isMockData?: boolean;
}

export function DailyChart({ data, isMockData = false }: DailyChartProps) {
  const [selectedDate, setSelectedDate] = useState(new Date());
  
  const {
    realDataPointsCount,
    totalDataPoints,
    hasRealData,
    enhancedData,
    yAxisMin,
    yAxisMax
  } = useChartData(data);
  
  const { temperatureConfig, relevantThresholds } = useThresholds(yAxisMin, yAxisMax);

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
      
      <DateSelector 
        selectedDate={selectedDate}
        setSelectedDate={setSelectedDate}
      />
    </div>
  );
}
