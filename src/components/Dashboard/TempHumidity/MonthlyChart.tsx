
import React, { useState } from "react";
import { MonthlyOverviewPoint } from "@/services/temp-humidity";
import { MonthlyChartControls } from "./MonthlyChartControls";
import { MonthlyChartLegend } from "./MonthlyChartLegend";
import { MonthlyTemperatureChart } from "./MonthlyTemperatureChart";
import { DownloadButton } from "./DownloadButton";
import { 
  enhanceMonthlyChartData, 
  calculateMonthlyChartRange, 
  filterRelevantMonthlyThresholds,
  getTemperatureLegendItems
} from "./utils/monthlyChartUtils";

interface MonthlyChartProps {
  data: MonthlyOverviewPoint[];
}

export function MonthlyChart({
  data
}: MonthlyChartProps) {
  const [month, setMonth] = useState("March");
  
  // Enhance data with colors
  const enhancedData = enhanceMonthlyChartData(data);
  
  // Calculate chart range
  const { yAxisMin, yAxisMax } = calculateMonthlyChartRange(data);
  
  // Get temperature config and relevant thresholds
  const legendItems = getTemperatureLegendItems();
  
  // Get relevant thresholds for display
  const relevantThresholds = filterRelevantMonthlyThresholds(
    [10, 17, 22, 30], // Temperature thresholds
    yAxisMin,
    yAxisMax
  );

  const handleMonthChange = (newMonth: string) => {
    setMonth(newMonth);
    // Additional logic for changing month could be added here
  };
  
  const handleViewChange = (view: string) => {
    // Logic for changing view (days, weeks, etc.)
    console.log("View changed to:", view);
  };
  
  const handleDownload = () => {
    // Logic for downloading data
    console.log("Downloading data...");
  };

  return (
    <div className="w-full h-full flex flex-col">
      {/* Chart controls */}
      <MonthlyChartControls 
        month={month} 
        onMonthChange={handleMonthChange}
        onViewChange={handleViewChange}
      />
      
      {/* Legend */}
      <MonthlyChartLegend items={legendItems} />
      
      {/* Chart */}
      <MonthlyTemperatureChart 
        data={enhancedData}
        yAxisMin={yAxisMin}
        yAxisMax={yAxisMax}
        relevantThresholds={relevantThresholds}
      />
      
      {/* Download button */}
      <div className="flex justify-between items-center pt-4 border-t mt-4">
        <div></div>
        <DownloadButton 
          onDownload={handleDownload}
          tooltipContent="Download the monthly temperature data as CSV"
        />
      </div>
    </div>
  );
}
