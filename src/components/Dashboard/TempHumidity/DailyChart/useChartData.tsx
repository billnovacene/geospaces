
import { useMemo } from "react";
import { DailyOverviewPoint } from "@/services/temp-humidity";
import { getSensorValueColor } from "@/utils/sensorThresholds";

export function useChartData(data: DailyOverviewPoint[]) {
  return useMemo(() => {
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

    return {
      realDataPointsCount,
      totalDataPoints,
      hasRealData,
      enhancedData,
      yAxisMin,
      yAxisMax
    };
  }, [data]);
}
