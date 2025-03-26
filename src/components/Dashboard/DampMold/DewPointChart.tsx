
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DewPointChartControls } from "./components/DewPointChartControls";
import { DewPointLineChart } from "./components/DewPointLineChart";
import { DewPointAreaChart } from "./components/DewPointAreaChart";
import { generateDewPointData } from "./utils/dewPointDataGenerator";

interface DewPointChartProps {
  data: any;
}

export function DewPointChart({ data }: DewPointChartProps) {
  const [selectedRange, setSelectedRange] = useState("day");
  const [chartType, setChartType] = useState("line");
  
  // Get data either from props or generate mock data
  const chartData = data?.dewPointData || generateDewPointData(selectedRange);
  
  // Configure x-axis based on selected time range
  const getXAxisKey = () => {
    if (selectedRange === "day") return "hour";
    return "day";
  };
  
  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg font-medium">Dew Point Analysis</CardTitle>
        <DewPointChartControls 
          selectedRange={selectedRange}
          setSelectedRange={setSelectedRange}
          chartType={chartType}
          setChartType={setChartType}
        />
      </CardHeader>
      <CardContent className="relative z-10">
        <div className="pb-4">
          <p className="text-sm text-gray-500">
            Dew point analysis shows the relationship between surface temperature and dew point temperature.
            When these values are close, condensation risk increases significantly.
          </p>
        </div>
        
        <div className="h-[250px]">
          {chartType === "line" ? (
            <DewPointLineChart chartData={chartData} xAxisKey={getXAxisKey()} />
          ) : (
            <DewPointAreaChart chartData={chartData} xAxisKey={getXAxisKey()} />
          )}
        </div>
      </CardContent>
    </Card>
  );
}
