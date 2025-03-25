
import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Thermometer, Cloud, AlertCircle, ArrowDown, ArrowUp } from "lucide-react";
import { getSensorValueColor } from "@/utils/sensorThresholds";
import { useParams } from "react-router-dom";
import { useTempHumidityData } from "@/hooks/useTempHumidityData";

export function LiveDataMetrics() {
  const { zoneId } = useParams<{ zoneId: string }>();
  const { data, isLoading, error, apiConnectionFailed } = useTempHumidityData();
  
  // Check if we have real-time data
  const hasRealTemperatureData = data?.daily?.some(point => point.isReal?.temperature === true);
  const latestTemperature = data?.daily?.find(point => point.isReal?.temperature === true)?.temperature;
  
  // Get temperature trend (if available)
  const realDataPoints = data?.daily?.filter(point => point.isReal?.temperature === true) || [];
  const hasTrend = realDataPoints.length >= 2;
  const temperatureTrend = hasTrend 
    ? (realDataPoints[realDataPoints.length - 1].temperature > realDataPoints[realDataPoints.length - 2].temperature)
      ? 'rising' : 'falling'
    : null;
  
  if (isLoading) {
    return (
      <Card className="overflow-hidden border-0 h-full rounded-none shadow-sm animate-pulse">
        <CardContent className="p-0 h-full">
          <div className="px-2 pt-2 flex justify-between items-center">
            <span className="text-sm font-medium">Zone Temperature</span>
            <div className="bg-gray-200 h-5 w-16 rounded"></div>
          </div>
          <div className="h-full flex items-center justify-center p-4">
            <div className="bg-gray-200 h-10 w-full rounded"></div>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  if (error || apiConnectionFailed) {
    return (
      <Card className="overflow-hidden border-0 h-full rounded-none shadow-sm">
        <CardContent className="p-0 h-full flex flex-col">
          <div className="px-2 pt-2 flex justify-between items-center">
            <span className="text-sm font-medium">Zone Temperature</span>
            <Badge variant="outline" className="bg-red-50 text-red-600 border-red-200">Error</Badge>
          </div>
          
          <div className="px-2 py-3 flex-grow flex flex-col gap-3 items-center justify-center">
            <div className="flex items-center gap-2 text-red-600">
              <AlertCircle size={18} />
              <span className="text-sm font-medium">API connection failed</span>
            </div>
            
            <p className="text-xs text-center text-muted-foreground mt-1">
              Unable to retrieve temperature data from the API
            </p>
          </div>
          
          <div className="h-1 w-full bg-gradient-to-r from-red-200 to-red-300" />
        </CardContent>
      </Card>
    );
  }
  
  if (!hasRealTemperatureData) {
    return (
      <Card className="overflow-hidden border-0 h-full rounded-none shadow-sm">
        <CardContent className="p-0 h-full flex flex-col">
          <div className="px-2 pt-2 flex justify-between items-center">
            <span className="text-sm font-medium">Zone Temperature</span>
            <Badge variant="outline" className="bg-amber-50 text-amber-600 border-amber-200">
              No Data
            </Badge>
          </div>
          
          <div className="px-2 py-3 flex-grow flex flex-col gap-3 items-center justify-center">
            <div className="flex items-center gap-2 text-amber-600">
              <AlertCircle size={18} />
              <span className="text-sm font-medium">
                No real-time data available
              </span>
            </div>
            
            <p className="text-xs text-center text-muted-foreground mt-1">
              Zone {zoneId} has no temperature sensors<br />or no recent readings
            </p>
          </div>
          
          <div className="h-1 w-full bg-gradient-to-r from-gray-200 to-gray-300" />
        </CardContent>
      </Card>
    );
  }
  
  // We have real temperature data
  const temperatureColor = getSensorValueColor('temperature', latestTemperature);
  
  return (
    <Card className="overflow-hidden border-0 h-full rounded-none shadow-sm">
      <CardContent className="p-0 h-full flex flex-col">
        <div className="px-2 pt-2 flex justify-between items-center">
          <span className="text-sm font-medium">Zone Temperature</span>
          <Badge variant="outline" className="bg-green-50 text-green-600 border-green-200">
            Live
          </Badge>
        </div>
        
        <div className="px-3 py-4 flex-grow flex items-center justify-center">
          <div className="flex items-center gap-2">
            <Thermometer className={`h-6 w-6 ${temperatureColor.text}`} />
            <span className={`text-2xl font-bold ${temperatureColor.text}`}>
              {latestTemperature !== null && latestTemperature !== undefined 
                ? latestTemperature.toFixed(1)
                : '--'} °C
            </span>
            
            {temperatureTrend && (
              <span className={`ml-1 ${temperatureTrend === 'rising' ? 'text-red-500' : 'text-blue-500'}`}>
                {temperatureTrend === 'rising' 
                  ? <ArrowUp className="h-4 w-4" /> 
                  : <ArrowDown className="h-4 w-4" />}
              </span>
            )}
          </div>
        </div>
        
        <div className={`h-1 w-full ${temperatureColor.bg}`} />
      </CardContent>
    </Card>
  );
}
