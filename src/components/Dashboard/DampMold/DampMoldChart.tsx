
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TimeRangeSelector } from "./Chart/TimeRangeSelector";
import { ChartConfig } from "./Chart/ChartConfig";
import { generateMockData, getXAxisKey } from "./Chart/mockDataUtils";

interface DampMoldChartProps {
  data: any;
}

export function DampMoldChart({ data }: DampMoldChartProps) {
  const [selectedRange, setSelectedRange] = useState("day");
  
  // Use real data or generate mock data
  const chartData = data?.dampMoldData || generateMockData(selectedRange);
  
  // Get the appropriate x-axis key for the selected time range
  const xAxisKey = getXAxisKey(selectedRange);
  
  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg font-medium">Damp Conditions Analysis</CardTitle>
        <TimeRangeSelector 
          selectedRange={selectedRange}
          setSelectedRange={setSelectedRange}
        />
      </CardHeader>
      <CardContent className="h-[400px]">
        <ChartConfig 
          chartData={chartData}
          xAxisKey={xAxisKey}
        />
      </CardContent>
    </Card>
  );
}
