import React, { useState, useEffect } from "react";
import { MonthlyOverviewPoint } from "@/services/temp-humidity";
import { MonthlyChartControls } from "./MonthlyChartControls";
import { MonthlyChartLegend } from "./MonthlyChartLegend";
import { MonthlyTemperatureChart } from "./MonthlyTemperatureChart";
import { DownloadButton } from "./DownloadButton";
import { 
  enhanceMonthlyChartData, 
  calculateMonthlyChartRange, 
  filterRelevantMonthlyThresholds,
  getTemperatureLegendItems,
  getProgressiveMonthlyData,
  calculateStatsFromLoadedData
} from "./utils/monthlyChartUtils";
import { generateMockData } from "@/services/sensors/mock-data-generator";

interface MonthlyChartProps {
  data: MonthlyOverviewPoint[];
  onStatsCalculated?: (stats: { avgTemp: number; minTemp: number; maxTemp: number; avgHumidity: number }) => void;
}

export function MonthlyChart({
  data = [], // Default to empty array
  onStatsCalculated
}: MonthlyChartProps) {
  // Always generate mock data if no data is available
  const processedData = data.length === 0 
    ? generateMockData().monthly 
    : data;

  const [month, setMonth] = useState("March");
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [visibleData, setVisibleData] = useState<MonthlyOverviewPoint[]>([]);
  
  // Progressive loading effect for monthly data
  useEffect(() => {
    if (!processedData || processedData.length === 0) return;
    
    // Reset progress when data changes
    setLoadingProgress(0);
    setVisibleData([]);
    
    // Simulate progressive loading - day by day for monthly data
    const interval = setInterval(() => {
      setLoadingProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        const newValue = prev + (100 / processedData.length); // Increment by one day's worth each time
        return Math.min(newValue, 100);
      });
    }, 200); // Update slightly slower for monthly data (every 200ms)
    
    return () => clearInterval(interval);
  }, [processedData]);
  
  // Update visible data based on loading progress
  useEffect(() => {
    if (!processedData || processedData.length === 0) return;
    
    const progressiveData = getProgressiveMonthlyData(processedData, loadingProgress);
    setVisibleData(progressiveData);
    
    // Calculate stats from currently loaded data and report upstream
    if (onStatsCalculated && progressiveData.length > 0) {
      const stats = calculateStatsFromLoadedData(progressiveData);
      onStatsCalculated(stats);
    }
  }, [loadingProgress, processedData, onStatsCalculated]);
  
  // Enhanced data with colors
  const enhancedData = enhanceMonthlyChartData(processedData);
  
  // Calculate chart range (use full dataset for consistent ranges)
  const { yAxisMin, yAxisMax } = calculateMonthlyChartRange(processedData);
  
  // Get temperature config and relevant thresholds
  const legendItems = getTemperatureLegendItems();
  
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
  
  // Show loading indicator during progressive loading
  const isProgressivelyLoading = loadingProgress < 100;

  return (
    <div className="w-full h-full flex flex-col">
      {/* Chart controls */}
      <MonthlyChartControls 
        month={month} 
        onMonthChange={handleMonthChange}
        onViewChange={handleViewChange}
      />
      
      {isProgressivelyLoading && (
        <div className="mb-2">
          <div className="h-1 bg-gray-200 rounded-full overflow-hidden">
            <div 
              className="h-full bg-blue-500 transition-all duration-300 ease-in-out" 
              style={{ width: `${loadingProgress}%` }}
            />
          </div>
          <p className="text-xs text-gray-500 mt-1 text-right">
            Loading monthly data: {Math.round(loadingProgress)}% ({visibleData.length} of {processedData.length} days)
          </p>
        </div>
      )}
      
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
