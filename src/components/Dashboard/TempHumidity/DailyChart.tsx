
import React, { useState, useEffect } from "react";
import { DailyOverviewPoint, MonthlyOverviewPoint } from "@/services/temp-humidity";
import { sensorTypes } from "@/utils/sensorThresholds";
import { ChartHeader } from "./ChartHeader";
import { ChartLegend } from "./ChartLegend";
import { TemperatureBarChart } from "./TemperatureBarChart";
import { ChartControls } from "./ChartControls";
import { 
  enhanceDailyChartData, 
  calculateChartRange, 
  filterRelevantThresholds,
  getProgressiveData
} from "./utils/chartUtils";
import { calculateHourlyAveragesFromMonth } from "./utils/monthlyAverageUtils";
import { generateMockData } from "@/services/sensors/mock-data-generator";
import { toast } from "sonner";
import { subDays, addDays } from "date-fns";

interface DailyChartProps {
  data: DailyOverviewPoint[];
  monthlyData?: MonthlyOverviewPoint[];
  isMockData?: boolean;
}

export function DailyChart({ 
  data = [], 
  monthlyData = [], 
  isMockData = false 
}: DailyChartProps) {
  // Always generate mock data if no data is available
  const processedData = data.length === 0 
    ? generateMockData().daily 
    : data;

  const [selectedDate, setSelectedDate] = useState(new Date());
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [visibleData, setVisibleData] = useState<DailyOverviewPoint[]>([]);
  
  // Count real data points
  const realDataPointsCount = processedData.filter(point => point.isReal?.temperature === true).length;
  const totalDataPoints = processedData.length;
  const hasRealData = realDataPointsCount > 0;
  
  // Make sure we display whether using simulated data
  const isUsingSimulatedData = !hasRealData || isMockData;
  
  console.log(`Daily chart rendering: ${realDataPointsCount}/${totalDataPoints} real data points, hasRealData: ${hasRealData}, isMockData: ${isMockData}, isUsingSimulatedData: ${isUsingSimulatedData}`);
  
  // If there's no real data or if requested to use mock data,
  // ensure we mark all data points as simulated for correct coloring
  const enhancedData = enhanceDailyChartData(
    isUsingSimulatedData ? 
      // Mark all data as simulated for consistent RAG coloring
      processedData.map(point => ({
        ...point,
        isReal: { temperature: false, humidity: false }
      })) : 
      processedData
  );
  
  const { yAxisMin, yAxisMax } = calculateChartRange(processedData);
  const temperatureConfig = sensorTypes.temperature;
  const relevantThresholds = filterRelevantThresholds(
    temperatureConfig.thresholds, 
    yAxisMin, 
    yAxisMax
  );

  // Progressive loading effect
  useEffect(() => {
    if (!processedData || processedData.length === 0) return;
    
    // Reset progress when data changes
    setLoadingProgress(0);
    setVisibleData([]);
    
    // Simulate progressive loading
    const interval = setInterval(() => {
      setLoadingProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 5; // Increment by 5% each time
      });
    }, 100); // Update every 100ms
    
    return () => clearInterval(interval);
  }, [processedData]);
  
  // Update visible data based on loading progress
  useEffect(() => {
    if (!processedData || processedData.length === 0) return;
    
    const progressiveData = getProgressiveData(processedData, loadingProgress);
    setVisibleData(progressiveData);
  }, [loadingProgress, processedData]);

  return (
    <div className="w-full h-full">
      <ChartHeader 
        realDataPointsCount={realDataPointsCount}
        totalDataPoints={totalDataPoints}
        hasRealData={hasRealData}
        selectedDate={selectedDate}
        isUsingSimulatedData={isUsingSimulatedData}
      />
      
      <ChartLegend 
        colors={temperatureConfig.colors} 
        showSimulated={isUsingSimulatedData} 
      />
      
      <TemperatureBarChart 
        data={enhancedData}
        yAxisMin={yAxisMin}
        yAxisMax={yAxisMax}
        relevantThresholds={relevantThresholds}
      />
      
      <ChartControls
        selectedDate={selectedDate}
        onPrevDay={() => setSelectedDate(prev => subDays(prev, 1))}
        onNextDay={() => {
          const newDate = addDays(selectedDate, 1);
          if (newDate <= new Date()) {
            setSelectedDate(newDate);
          }
        }}
      />
    </div>
  );
}
