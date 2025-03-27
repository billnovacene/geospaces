
import React from "react";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { ChartConfig } from "./Chart/ChartConfig";
import { generateMockData, getXAxisKey } from "./Chart/mockDataUtils";
import { ScatterChartConfig } from "./Chart/ScatterChartConfig";

interface DailyOverviewSectionProps {
  timeRange: string;
  setTimeRange: (value: string) => void;
}

export function DailyOverviewSection({
  timeRange,
  setTimeRange
}: DailyOverviewSectionProps) {
  // Generate appropriate mock data based on the timeRange
  const chartData = generateMockData(timeRange);
  const xAxisKey = getXAxisKey(timeRange);
  const chartDescription = "Risk assessment based on temperature and humidity conditions. Points show real-time measurements with color indicating risk level: green (low), amber (moderate), red (high risk).";
  
  return <Card className="border-0 shadow-sm w-full bg-white">
      <CardHeader className="pb-2 w-full">
        <div className="flex flex-row items-center justify-between">
          <CardTitle className="text-xl font-medium text-gray-900">Daily Overview</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="w-full">
        <div className="mt-2 w-full">
          {/* Chart layout with description on the left - using same alignment pattern as header */}
          <div className="flex flex-col md:flex-row gap-6 w-full">
            <div className="w-full md:w-1/4">
              <p className="text-sm text-gray-700">{chartDescription}</p>
            </div>
            <div className="w-full md:w-3/4">
              <div className="h-[250px] relative z-0 w-full">
                <ScatterChartConfig chartData={chartData} xAxisKey={xAxisKey} />
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>;
}
