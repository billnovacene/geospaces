
import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Thermometer, Cloud, AlertCircle, ArrowDown, ArrowUp, RefreshCw } from "lucide-react";
import { getSensorValueColor } from "@/utils/sensorThresholds";
import { useParams } from "react-router-dom";
import { useTempHumidityData } from "@/hooks/useTempHumidityData";
import { Button } from "@/components/ui/button";

export function LiveDataMetrics() {
  const { zoneId, siteId } = useParams<{ zoneId: string; siteId: string }>();
  const { data, isLoading, error, apiConnectionFailed, refetch } = useTempHumidityData();
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  
  // Update last updated time when data refreshes
  useEffect(() => {
    if (data) {
      setLastUpdated(new Date());
    }
  }, [data]);
  
  // Handle refresh action
  const handleRefresh = () => {
    refetch();
    setLastUpdated(new Date());
  };
  
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
      <Card className="overflow-hidden border-0 h-full rounded-none shadow-sm">
        <CardContent className="p-0 h-full flex flex-col">
          <div className="px-2 pt-2 flex justify-between items-center">
            <span className="text-sm font-medium">Live Temperature</span>
            <Badge variant="outline" className="bg-blue-50 text-blue-600 border-blue-200">
              Loading
            </Badge>
          </div>
          
          <div className="px-3 py-4 flex-grow flex items-center justify-center">
            <div className="flex items-center">
              <RefreshCw className="h-5 w-5 text-blue-500 animate-spin mr-2" />
              <span className="text-sm text-blue-600">Fetching data...</span>
            </div>
          </div>
          
          <div className="h-1 w-full bg-gradient-to-r from-blue-200 to-blue-300" />
        </CardContent>
      </Card>
    );
  }
  
  if (error || apiConnectionFailed) {
    return (
      <Card className="overflow-hidden border-0 h-full rounded-none shadow-sm">
        <CardContent className="p-0 h-full flex flex-col">
          <div className="px-2 pt-2 flex justify-between items-center">
            <span className="text-sm font-medium">Live Temperature</span>
            <Badge variant="outline" className="bg-red-50 text-red-600 border-red-200">Error</Badge>
          </div>
          
          <div className="px-2 py-3 flex-grow flex flex-col gap-3 items-center justify-center">
            <div className="flex items-center gap-2 text-red-600">
              <AlertCircle size={18} />
              <span className="text-sm font-medium">API connection failed</span>
            </div>
            
            <Button variant="outline" size="sm" onClick={handleRefresh} className="mt-2">
              <RefreshCw className="h-3.5 w-3.5 mr-1" />
              Retry
            </Button>
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
            <span className="text-sm font-medium">Live Temperature</span>
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
              {zoneId ? `Zone ${zoneId}` : siteId ? `Site ${siteId}` : 'This location'} has no 
              temperature sensors<br />or no recent readings
            </p>
            
            <Button variant="outline" size="sm" onClick={handleRefresh} className="mt-2">
              <RefreshCw className="h-3.5 w-3.5 mr-1" />
              Refresh Data
            </Button>
          </div>
          
          <div className="h-1 w-full bg-gradient-to-r from-gray-200 to-gray-300" />
        </CardContent>
      </Card>
    );
  }
  
  // We have real temperature data
  const temperatureColor = getSensorValueColor('temperature', latestTemperature);
  const formattedTime = lastUpdated.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  
  return (
    <Card className="overflow-hidden border-0 h-full rounded-none shadow-sm">
      <CardContent className="p-0 h-full flex flex-col">
        <div className="px-2 pt-2 flex justify-between items-center">
          <span className="text-sm font-medium">Live Temperature</span>
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
        
        <div className="flex items-center justify-between px-3 pb-1 text-xs text-gray-500">
          <span>Updated: {formattedTime}</span>
          <Button variant="ghost" size="sm" className="h-6 w-6 p-0" onClick={handleRefresh}>
            <RefreshCw className="h-3 w-3" />
          </Button>
        </div>
        
        <div className={`h-1 w-full ${temperatureColor.bg}`} />
      </CardContent>
    </Card>
  );
}
