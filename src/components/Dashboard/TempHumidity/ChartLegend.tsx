
import React from "react";

interface ChartLegendProps {
  colors: string[];
  showSimulated?: boolean;
}

export function ChartLegend({ colors, showSimulated = false }: ChartLegendProps) {
  return (
    <div className="flex justify-end gap-6 mb-4">
      <div className="flex items-center gap-2">
        <div className="h-3 w-3 rounded-sm" style={{ backgroundColor: colors[2] }}></div>
        <span className="text-xs">Good (17-22°C)</span>
      </div>
      <div className="flex items-center gap-2">
        <div className="h-3 w-3 rounded-sm" style={{ backgroundColor: colors[1] }}></div>
        <span className="text-xs">Cool/Warm (10-17°C, 22-30°C)</span>
      </div>
      <div className="flex items-center gap-2">
        <div className="h-3 w-3 rounded-sm" style={{ backgroundColor: colors[0] }}></div>
        <span className="text-xs">Too Cold/Hot (&lt;10°C, &gt;30°C)</span>
      </div>
      {showSimulated && (
        <div className="flex items-center gap-2">
          <div className="h-3 w-3 rounded-sm bg-gray-200"></div>
          <span className="text-xs">Simulated data</span>
        </div>
      )}
    </div>
  );
}
