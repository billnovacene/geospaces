
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
  const chartDescription = "Risk assessment based on temperature and humidity using industry standards. Points show measurements with color indicating risk level: green (<60% RH), amber (60-69% RH), red (≥70% RH). Temperature below 16°C increases risk.";
  
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
              <div className="mt-4 p-3 border border-blue-100 bg-blue-50 rounded-md">
                <p className="text-xs text-blue-700 font-medium">Mould Risk Scoring</p>
                <ul className="text-xs text-blue-700 mt-1 list-disc pl-4 space-y-1">
                  <li>RH &lt;60%: Low risk (green)</li>
                  <li>RH 60-69%: Moderate risk (amber)</li>
                  <li>RH ≥70%: High risk (red)</li>
                  <li>Temperature &lt;16°C adds additional risk</li>
                </ul>
              </div>
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
