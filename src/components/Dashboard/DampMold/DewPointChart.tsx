
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DewPointChartControls } from "./components/DewPointChartControls";
import { DewPointLineChart } from "./components/DewPointLineChart";
import { DewPointAreaChart } from "./components/DewPointAreaChart";
import { useTheme } from "@/components/ThemeProvider";
import { useDampMold } from "./context/DampMoldContext";

export function DewPointChart() {
  const [selectedRange, setSelectedRange] = useState("day");
  const [chartType, setChartType] = useState("line");
  const { activeTheme } = useTheme();
  const { data } = useDampMold();
  
  const isDarkMode = activeTheme === "dark";

  // Transform real data for the dew point chart if available
  const transformDataForDewPointChart = () => {
    if (!data?.daily || data.daily.length === 0) {
      return [];
    }
    
    return data.daily.map(point => {
      // Calculate dew point if not provided
      const dewPoint = point.dewPoint !== undefined ? point.dewPoint : 
        (point.temperature - ((100 - point.humidity) / 5));
      
      return {
        hour: new Date(point.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        day: new Date(point.time).toLocaleDateString(),
        temperature: point.temperature,
        humidity: point.humidity,
        dewPoint: parseFloat(dewPoint.toFixed(1))
      };
    });
  };

  // Use transformed real data
  const chartData = transformDataForDewPointChart();

  // Configure x-axis based on selected time range
  const getXAxisKey = () => {
    if (selectedRange === "day") return "hour";
    return "day";
  };

  return (
    <Card className="shadow-none">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-medium dark:text-white">Dew Point Analysis</CardTitle>
        <DewPointChartControls 
          selectedRange={selectedRange} 
          setSelectedRange={setSelectedRange} 
          chartType={chartType} 
          setChartType={setChartType} 
        />
      </CardHeader>
      <CardContent>
        {chartData.length > 0 ? (
          chartType === "line" ? (
            <DewPointLineChart chartData={chartData} xAxisKey={getXAxisKey()} isDarkMode={isDarkMode} />
          ) : (
            <DewPointAreaChart chartData={chartData} xAxisKey={getXAxisKey()} isDarkMode={isDarkMode} />
          )
        ) : (
          <div className="h-[300px] flex items-center justify-center text-muted-foreground">
            No data available. Please add sensor data to view dew point analysis.
          </div>
        )}
      </CardContent>
    </Card>
  );
}
