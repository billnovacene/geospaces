
import React from "react";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
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
    <Card className="border-0 shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-xl font-bold text-gray-900">Daily Overview</CardTitle>
      </CardHeader>
      <CardContent>
        {/* Tabs for switching between today and month views */}
        <Tabs defaultValue={timeRange} className="w-auto mb-4" onValueChange={setTimeRange}>
          <TabsList className="bg-gray-100 p-1">
            <TabsTrigger value="today" className="data-[state=active]:bg-white">Today</TabsTrigger>
            <TabsTrigger value="month" className="data-[state=active]:bg-white">Month</TabsTrigger>
          </TabsList>
        </Tabs>
        
        <div className="mt-6">
          {/* Day selector and chart */}
          <div className="flex items-center justify-between text-sm mb-4">
            <Button variant="outline" size="sm" className="flex items-center gap-1">
              <ChevronLeft className="h-4 w-4" />
              15th Dec
            </Button>
            <div className="text-gray-500">
              08:00 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 12:00 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 18:00
            </div>
            <Button variant="outline" size="sm" className="flex items-center gap-1">
              16th Dec
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>

          {/* Chart for daily overview with description */}
          <ChartConfig 
            chartData={chartData} 
            xAxisKey={xAxisKey} 
            description={chartDescription}
          />
        </div>
      </CardContent>
    </Card>
  );
}
