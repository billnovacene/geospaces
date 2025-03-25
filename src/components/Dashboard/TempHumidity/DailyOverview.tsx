
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { DailyChart } from "@/components/Dashboard/TempHumidity/DailyChart";
import { DailyOverviewPoint } from "@/services/temp-humidity";
import { LoaderCircle } from "lucide-react";

interface DailyOverviewProps {
  data: DailyOverviewPoint[];
  isMockData: boolean;
  contextName: string;
  stats: {
    minTemp: string;
    maxTemp: string;
  };
  hasRealDailyData: boolean;
  operatingHours?: {
    startTime: string;
    endTime: string;
  };
  isLoading?: boolean;
}

export function DailyOverview({ 
  data, 
  isMockData, 
  contextName, 
  stats, 
  hasRealDailyData,
  operatingHours,
  isLoading = false
}: DailyOverviewProps) {
  // Count real data points for accurate percentage calculation
  const realDataCount = data.filter(d => d.isReal?.temperature === true).length;
  const totalCount = data.length;
  const realDataPercentage = totalCount > 0 ? ((realDataCount / totalCount) * 100).toFixed(0) : "0";
  
  console.log(`DailyOverview rendering: isMockData=${isMockData}, hasRealDailyData=${hasRealDailyData}, real points=${realDataCount}/${totalCount} (${realDataPercentage}%)`);
  
  // Debug log to verify data integrity
  if (realDataCount > 0) {
    console.log("Real data found! First 3 real data points:", 
      data.filter(d => d.isReal?.temperature === true).slice(0, 3)
    );
  } else {
    console.warn("No real data points found in the daily overview data");
  }
  
  return (
    <div className="mb-12">
      <Card className="shadow-sm border-0">
        <CardContent className="p-8">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 lg:gap-8 items-center">
            <div className="col-span-1">
              <h2 className="text-xl font-medium mb-4">Daily Overview - {contextName}</h2>
              <p className="text-sm text-gray-600 mb-3">
                Today's temperatures range from {stats.minTemp}°C to {stats.maxTemp}°C during operating hours.
                {realDataCount > 0 
                  ? ` ${realDataPercentage}% of data comes from actual sensor readings.`
                  : " The current view uses simulated data where sensor readings are unavailable."}
              </p>
              
              {operatingHours && (
                <p className="text-xs text-gray-500 mb-3">
                  Data filtered to operating hours: {operatingHours.startTime.split('T')[1].substring(0, 5)} - {operatingHours.endTime.split('T')[1].substring(0, 5)}
                </p>
              )}
              
              {isLoading && (
                <div className="flex items-center gap-2 text-blue-600 mt-4">
                  <LoaderCircle className="h-4 w-4 animate-spin" />
                  <span className="text-sm font-medium">Loading daily data...</span>
                </div>
              )}
              
              {realDataCount === 0 && !isLoading && (
                <div className="p-2 bg-amber-50 border border-amber-200 rounded-md mt-2">
                  <p className="text-xs text-amber-700">
                    No real-time sensor data is available for today. Showing simulated data instead.
                  </p>
                </div>
              )}
            </div>
            
            <div className="col-span-1 lg:col-span-3">
              {isLoading ? (
                <div className="flex items-center justify-center h-[300px] bg-gray-50 rounded-lg">
                  <div className="flex flex-col items-center gap-2">
                    <LoaderCircle className="h-8 w-8 animate-spin text-blue-600" />
                    <span className="text-sm text-gray-500">Loading today's temperature data...</span>
                  </div>
                </div>
              ) : (
                <DailyChart data={data} isMockData={isMockData && !hasRealDailyData} />
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
