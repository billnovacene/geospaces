
import React from "react";
import { SensorTypeConfig } from "@/utils/sensorThresholds";

interface MonthlyChartLegendProps {
  temperatureConfig: SensorTypeConfig;
}

export function MonthlyChartLegend({ temperatureConfig }: MonthlyChartLegendProps) {
  return (
    <div className="flex justify-end gap-6 mb-4">
      <div className="flex items-center gap-2">
        <div className="h-3 w-3 rounded-sm" style={{ backgroundColor: temperatureConfig.colors[2] }}></div>
        <span className="text-xs">Good (17-22°C)</span>
      </div>
      <div className="flex items-center gap-2">
        <div className="h-3 w-3 rounded-sm" style={{ backgroundColor: temperatureConfig.colors[1] }}></div>
        <span className="text-xs">Cool/Warm (10-17°C, 22-30°C)</span>
      </div>
      <div className="flex items-center gap-2">
        <div className="h-3 w-3 rounded-sm" style={{ backgroundColor: temperatureConfig.colors[0] }}></div>
        <span className="text-xs">Too Cold/Hot (&lt;10°C, &gt;30°C)</span>
      </div>
    </div>
  );
}
