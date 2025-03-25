
import { useMemo } from "react";
import { sensorTypes } from "@/utils/sensorThresholds";

export function useThresholds(yAxisMin: number, yAxisMax: number) {
  return useMemo(() => {
    const temperatureConfig = sensorTypes.temperature;
    
    // Filter out the thresholds we want to display
    const relevantThresholds = temperatureConfig.thresholds
      .filter(threshold => threshold >= yAxisMin && threshold <= yAxisMax)
      .filter(threshold => threshold !== 28); // Exclude 28°C threshold
      
    return {
      temperatureConfig,
      relevantThresholds
    };
  }, [yAxisMin, yAxisMax]);
}
