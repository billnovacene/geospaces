
import React from "react";

interface LegendItem {
  color: string;
  label: string;
}

interface MonthlyChartLegendProps {
  items: LegendItem[];
}

export function MonthlyChartLegend({ items }: MonthlyChartLegendProps) {
  return (
    <div className="flex justify-end gap-6 mb-4">
      {items.map((item, index) => (
        <div key={index} className="flex items-center gap-2">
          <div className="h-3 w-3 rounded-sm" style={{ backgroundColor: item.color }}></div>
          <span className="text-xs">{item.label}</span>
        </div>
      ))}
    </div>
  );
}
