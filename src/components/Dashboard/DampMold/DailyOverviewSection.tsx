
import React from "react";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface DailyOverviewSectionProps {
  timeRange: string;
}

export function DailyOverviewSection({ timeRange }: DailyOverviewSectionProps) {
  return (
    <Card className="border-0 shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-xl font-bold text-gray-900">Daily Overview</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-gray-700 mb-6">
          Lowest temps rarely dip below <span className="font-semibold">8°C</span>, 
          highest near <span className="font-semibold">22°C</span>. Humidity remains 
          about <span className="font-semibold">47%</span>, showing steady indoor 
          conditions with minor fluctuations linked to weather or occupancy.
        </p>
        
        {/* Second chart section (bar chart) */}
        <Tabs defaultValue={timeRange} className="w-auto mb-4">
          <TabsList className="bg-gray-100 p-1">
            <TabsTrigger value="today" className="data-[state=active]:bg-white">Today</TabsTrigger>
            <TabsTrigger value="month" className="data-[state=active]:bg-white">Month</TabsTrigger>
          </TabsList>
        </Tabs>
        
        <div className="h-[300px] mt-6">
          {/* Day selector and bar chart */}
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

          {/* Placeholder for bar chart */}
          <div className="h-[250px] bg-gray-50 flex items-center justify-center">
            {/* This would be replaced with the actual bar chart component */}
            <div className="text-gray-400">Bar chart visualization will be displayed here</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
