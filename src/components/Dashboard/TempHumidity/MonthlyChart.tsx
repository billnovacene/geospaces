
import { useState } from "react";
import { MonthlyOverviewPoint } from "@/services/temp-humidity";
import { sensorTypes, getSensorValueColor } from "@/utils/sensorThresholds";
import { MonthlyBarChart } from "@/components/Dashboard/TempHumidity/MonthlyBarChart";
import { MonthlyChartControls } from "@/components/Dashboard/TempHumidity/MonthlyChartControls";
import { MonthlyChartLegend } from "@/components/Dashboard/TempHumidity/MonthlyChartLegend";
import { MonthlyChartFooter } from "@/components/Dashboard/TempHumidity/MonthlyChartFooter";

interface MonthlyChartProps {
  data: MonthlyOverviewPoint[];
  isCachedData?: boolean;
  onRefresh?: () => void;
}

export function MonthlyChart({ data, isCachedData = false, onRefresh }: MonthlyChartProps) {
  const [month, setMonth] = useState("March");
  
  const temperatureConfig = sensorTypes.temperature;
  
  // Enhance data with color information
  const enhancedData = data.map(point => {
    const barColor = getSensorValueColor("temperature", point.avgTemp);
    
    return {
      ...point,
      barColor,
    };
  });

  // Calculate Y-axis boundaries
  const actualMinTemp = Math.min(...data.map(d => d.minTemp));
  const actualMaxTemp = Math.max(...data.map(d => d.maxTemp));
  
  const yAxisMin = Math.floor(actualMinTemp - 2);
  const yAxisMax = Math.ceil(actualMaxTemp + 2);
  
  // Filter out the thresholds we want to display
  const relevantThresholds = temperatureConfig.thresholds
    .filter(threshold => threshold >= yAxisMin && threshold <= yAxisMax)
    .filter(threshold => threshold !== 28); // Exclude 28°C threshold

  return (
    <div className="w-full h-full flex flex-col">
      <MonthlyChartControls month={month} />
      <MonthlyChartLegend temperatureConfig={temperatureConfig} />
      
      <MonthlyBarChart 
        data={enhancedData}
        yAxisMin={yAxisMin}
        yAxisMax={yAxisMax}
        relevantThresholds={relevantThresholds}
      />
      
      <MonthlyChartFooter 
        onRefresh={onRefresh}
        isCachedData={isCachedData}
      />
    </div>
  );
}
