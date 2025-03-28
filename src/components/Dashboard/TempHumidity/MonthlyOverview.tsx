
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { MonthlyChart } from "@/components/Dashboard/TempHumidity/MonthlyChart";
import { MonthlyOverviewPoint } from "@/services/interfaces/temp-humidity";
import { LoaderCircle } from "lucide-react";

interface MonthlyOverviewProps {
  data: MonthlyOverviewPoint[];
  contextName: string;
  stats: {
    minTemp: string;
    maxTemp: string;
  };
  operatingHours?: {
    startTime: string;
    endTime: string;
  };
  isLoading?: boolean;
  onStatsCalculated?: (stats: { avgTemp: number; minTemp: number; maxTemp: number; avgHumidity: number }) => void;
}

export function MonthlyOverview({ 
  data, 
  contextName, 
  stats,
  isLoading = false,
  onStatsCalculated
}: MonthlyOverviewProps) {
  return (
    <div className="mb-16">
      <Card className="shadow-sm border-0">
        <CardContent className="p-8">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 lg:gap-8 items-center">
            <div className="col-span-1">
              <h2 className="text-xl font-medium mb-4">Monthly Overview - {contextName}</h2>
              <p className="text-sm text-gray-600 mb-3">
                The monthly data shows peak temps around {stats.maxTemp}°C with minimums
                near {stats.minTemp}°C during operating hours. Data has been filtered to only 
                include measurements within operating hours.
              </p>
              
              {isLoading && (
                <div className="flex items-center gap-2 text-blue-600 mt-4">
                  <LoaderCircle className="h-4 w-4 animate-spin" />
                  <span className="text-sm font-medium">Calculating monthly metrics...</span>
                </div>
              )}
            </div>
            <div className="col-span-1 lg:col-span-3">
              {isLoading ? (
                <div className="flex items-center justify-center h-[300px] bg-gray-50 rounded-lg">
                  <div className="flex flex-col items-center gap-2">
                    <LoaderCircle className="h-8 w-8 animate-spin text-blue-600" />
                    <span className="text-sm text-gray-500">Loading monthly temperature data...</span>
                  </div>
                </div>
              ) : (
                <MonthlyChart 
                  data={data} 
                  onStatsCalculated={onStatsCalculated}
                />
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
