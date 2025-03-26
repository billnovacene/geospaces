
import React from "react";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { ChartConfig } from "./Chart/ChartConfig";
import { generateMockData, getXAxisKey } from "./Chart/mockDataUtils";

interface DailyOverviewSectionProps {
  timeRange: string;
  setTimeRange: (value: string) => void;
}

export function DailyOverviewSection({ timeRange, setTimeRange }: DailyOverviewSectionProps) {
  // Generate appropriate mock data based on the timeRange
  const chartData = generateMockData(timeRange);
  const xAxisKey = getXAxisKey(timeRange);

  const chartDescription = "Lowest temps rarely dip below 8°C, highest near 22°C. Humidity remains about 47%, showing steady indoor conditions with minor fluctuations linked to weather or occupancy.";

  return (
    <Card className="border-0 shadow-sm w-full">
      <CardHeader className="pb-2 w-full">
        <CardTitle className="text-xl font-medium text-gray-900">Daily Overview</CardTitle>
      </CardHeader>
      <CardContent className="w-full">
        <div className="mt-2 w-full">
          {/* Chart layout with description on the left */}
          <div className="flex flex-col md:flex-row gap-6 w-full">
            <div className="w-full md:w-1/4">
              <p className="text-sm text-gray-700">{chartDescription}</p>
            </div>
            <div className="w-full md:w-3/4">
              <div className="h-[250px] relative z-0 w-full">
                <ChartConfig 
                  chartData={chartData} 
                  xAxisKey={xAxisKey}
                />
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
