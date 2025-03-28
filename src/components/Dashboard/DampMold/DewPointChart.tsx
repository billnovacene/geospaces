
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DewPointChartControls } from "./components/DewPointChartControls";
import { DewPointLineChart } from "./components/DewPointLineChart";
import { DewPointAreaChart } from "./components/DewPointAreaChart";
import { generateDewPointData } from "./utils/dewPointDataGenerator";
import { useTheme } from "@/components/ThemeProvider";

interface DewPointChartProps {
  data: any;
}

export function DewPointChart({
  data
}: DewPointChartProps) {
  const [selectedRange, setSelectedRange] = useState("day");
  const [chartType, setChartType] = useState("line");
  const { activeTheme } = useTheme();
  const isDarkMode = activeTheme === "dark";

  // Get data either from props or generate mock data
  const chartData = data?.dewPointData || generateDewPointData(selectedRange);

  // Configure x-axis based on selected time range
  const getXAxisKey = () => {
    if (selectedRange === "day") return "hour";
    return "day";
  };

  return (
    <Card className="w-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-medium dark:text-white">Dew Point Analysis</CardTitle>
        <DewPointChartControls 
          selectedRange={selectedRange} 
          setSelectedRange={setSelectedRange} 
          chartType={chartType} 
          setChartType={setChartType} 
        />
      </CardHeader>
      <CardContent className="w-full pb-8">
        <div className="flex flex-col md:flex-row gap-8 w-full">
          <div className="w-full md:w-1/4 pr-4">
            <p className="text-sm text-gray-700 dark:text-gray-300">
              This chart shows the current day's dew point analysis and temperature readings, 
              helping identify potential condensation risks in real-time.
            </p>
          </div>
          <div className="w-full md:w-3/4 h-[300px]">
            {chartType === "line" ? (
              <DewPointLineChart chartData={chartData} xAxisKey={getXAxisKey()} isDarkMode={isDarkMode} />
            ) : (
              <DewPointAreaChart chartData={chartData} xAxisKey={getXAxisKey()} isDarkMode={isDarkMode} />
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
