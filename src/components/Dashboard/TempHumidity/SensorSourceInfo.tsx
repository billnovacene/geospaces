
import { Card, CardContent } from "@/components/ui/card";
import { SensorSourceData } from "@/services/interfaces/temp-humidity";
import { format, parseISO } from "date-fns";
import { Thermometer, Droplets } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

interface SensorSourceInfoProps {
  sourceData: SensorSourceData;
  isLoading?: boolean;
}

export function SensorSourceInfo({ sourceData, isLoading = false }: SensorSourceInfoProps) {
  if (isLoading) {
    return (
      <Card className="border-0 shadow-sm">
        <CardContent className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <Skeleton className="h-5 w-5" />
            <Skeleton className="h-6 w-48" />
          </div>
          
          <div className="grid gap-3 animate-pulse">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
        </CardContent>
      </Card>
    );
  }
  
  const totalSensors = sourceData.temperatureSensors.length + sourceData.humiditySensors.length;
  
  if (totalSensors === 0) {
    return (
      <Card className="border-0 shadow-sm">
        <CardContent className="p-6">
          <p className="text-sm text-gray-500">No sensor data available for this location.</p>
        </CardContent>
      </Card>
    );
  }
  
  const formatTime = (isoTime: string) => {
    try {
      return format(parseISO(isoTime), 'MMM d, yyyy h:mm a');
    } catch (e) {
      return 'Unknown';
    }
  };
  
  return (
    <Card className="border-0 shadow-sm">
      <CardContent className="p-6">
        <h3 className="text-sm font-medium mb-4 flex items-center gap-2">
          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary/10">
            <Thermometer className="h-3 w-3 text-primary" />
          </span>
          Sensor Data Sources ({totalSensors} sensors)
        </h3>
        
        <div className="space-y-4">
          {sourceData.temperatureSensors.map((sensor) => (
            <div key={sensor.id} className="rounded-md border p-3 bg-primary/5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Thermometer className="h-4 w-4 text-primary" />
                  <span className="font-medium text-sm">{sensor.name}</span>
                </div>
                <span className="text-xs text-gray-500">
                  Last updated: {formatTime(sensor.lastUpdated)}
                </span>
              </div>
              <p className="text-xs text-gray-600 mt-1">Device: {sensor.deviceName}</p>
            </div>
          ))}
          
          {sourceData.humiditySensors.map((sensor) => (
            <div key={sensor.id} className="rounded-md border p-3 bg-blue-50">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Droplets className="h-4 w-4 text-blue-500" />
                  <span className="font-medium text-sm">{sensor.name}</span>
                </div>
                <span className="text-xs text-gray-500">
                  Last updated: {formatTime(sensor.lastUpdated)}
                </span>
              </div>
              <p className="text-xs text-gray-600 mt-1">Device: {sensor.deviceName}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
