
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { DailyChart } from "@/components/Dashboard/TempHumidity/DailyChart";
import { DailyOverviewPoint } from "@/services/interfaces/temp-humidity";

interface DailyOverviewProps {
  data: DailyOverviewPoint[];
  isMockData: boolean;
  contextName: string;
  stats: {
    minTemp: string;
    maxTemp: string;
  };
  hasRealDailyData: boolean;
}

export function DailyOverview({ 
  data, 
  isMockData, 
  contextName, 
  stats, 
  hasRealDailyData 
}: DailyOverviewProps) {
  return (
    <div className="mb-12">
      <Card className="shadow-sm border-0">
        <CardContent className="p-8">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 lg:gap-8 items-center">
            <div className="col-span-1">
              <h2 className="text-xl font-medium mb-4">Daily Overview - {contextName}</h2>
              <p className="text-sm text-gray-600">
                Today's temperatures range from {stats.minTemp}°C to {stats.maxTemp}°C.
                {hasRealDailyData 
                  ? " Data is from actual sensor readings."
                  : " The current view uses simulated data where sensor readings are unavailable."}
              </p>
            </div>
            
            <div className="col-span-1 lg:col-span-3">
              <DailyChart data={data} isMockData={isMockData} />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
