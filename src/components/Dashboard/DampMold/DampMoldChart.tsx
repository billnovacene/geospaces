
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TimeRangeSelector } from "./Chart/TimeRangeSelector";
import { ChartConfig } from "./Chart/ChartConfig";
import { getXAxisKey } from "./Chart/mockDataUtils";
import { useDampMold } from "./context/DampMoldContext";

export function DampMoldChart() {
  const [selectedRange, setSelectedRange] = useState("day");
  const { data } = useDampMold();
  
  // Use real data from database, no mock data
  const chartData = data?.daily || [];
  
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
        {chartData.length > 0 ? (
          <ChartConfig 
            chartData={chartData}
            xAxisKey={xAxisKey}
          />
        ) : (
          <div className="h-full flex items-center justify-center text-muted-foreground">
            No data available. Please add sensor data to view this chart.
          </div>
        )}
      </CardContent>
    </Card>
  );
}
