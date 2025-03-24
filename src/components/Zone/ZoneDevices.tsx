
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useQuery } from "@tanstack/react-query";
import { fetchDevicesForZone } from "@/services/devices";
import { Badge } from "@/components/ui/badge";
import { Smartphone, Wifi, AlertTriangle, Thermometer, Droplets, Wind, Battery, Lightbulb } from "lucide-react";
import { getStatusColor } from "@/utils/formatting";
import { format } from "date-fns";
import { 
  Tooltip, 
  TooltipContent, 
  TooltipTrigger 
} from "@/components/ui/tooltip";

interface ZoneDevicesProps {
  zoneId: number;
}

export const ZoneDevices = ({ zoneId }: ZoneDevicesProps) => {
  const { data: devices, isLoading, error } = useQuery({
    queryKey: ["zone-devices-list", zoneId],
    queryFn: () => fetchDevicesForZone(zoneId),
    enabled: !!zoneId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  console.log(`Devices for zone ${zoneId}:`, devices);

  // Format date
  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return "N/A";
    try {
      return format(new Date(dateString), "MMM d, yyyy");
    } catch (e) {
      return dateString;
    }
  };

  // Get sensor display value with unit
  const getSensorValue = (sensor: any) => {
    if (!sensor) return "N/A";
    
    const value = sensor.lastReceivedDataValue;
    const unit = sensor.unit || "";
    
    if (value === undefined || value === null) return "N/A";
    
    return `${value}${unit}`;
  };

  // Get icon for sensor type
  const getSensorIcon = (sensorName: string) => {
    if (sensorName.includes("temperature")) return <Thermometer className="h-4 w-4" />;
    if (sensorName.includes("humidity")) return <Droplets className="h-4 w-4" />;
    if (sensorName.includes("co2")) return <Wind className="h-4 w-4" />;
    if (sensorName.includes("vdd") || sensorName.includes("battery")) return <Battery className="h-4 w-4" />;
    if (sensorName.includes("light")) return <Lightbulb className="h-4 w-4" />;
    return null;
  };

  return (
    <Card className="col-span-2">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2">
          <Wifi className="h-5 w-5 text-primary" />
          Devices in Zone {zoneId}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="flex items-center gap-4 p-4 border rounded-md">
                <Skeleton className="h-8 w-8 rounded-full" />
                <div className="space-y-2">
                  <Skeleton className="h-5 w-40" />
                  <Skeleton className="h-4 w-24" />
                </div>
                <div className="ml-auto">
                  <Skeleton className="h-6 w-20" />
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-8 text-muted-foreground">
            <AlertTriangle className="mx-auto h-8 w-8 mb-2 text-yellow-500" />
            <p>Error loading devices. Please try again later.</p>
          </div>
        ) : !devices || devices.length === 0 ? (
          <div className="text-center py-8 border rounded-md bg-muted/30">
            <p className="text-muted-foreground">No devices found in zone {zoneId}</p>
          </div>
        ) : (
          <div className="grid gap-3">
            {devices.map((device) => (
              <div 
                key={device.id} 
                className="border rounded-md overflow-hidden"
              >
                <div className="flex items-center p-3 hover:bg-muted/30 transition-colors">
                  <div className="mr-3 bg-primary/10 p-2 rounded-full">
                    <Smartphone className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="font-medium truncate">{device.name}</h3>
                      <Badge variant="outline" className={getStatusColor(device.status || "Unknown")}>
                        {device.status || "Unknown"}
                      </Badge>
                    </div>
                    <div className="flex gap-4 text-sm text-muted-foreground">
                      <span>ID: {device.id}</span>
                      <span>Added: {formatDate(device.createdAt)}</span>
                      {device.modelId && <span>Model: {device.modelId.name || "Unknown"}</span>}
                    </div>
                  </div>
                </div>

                {device.sensors && device.sensors.length > 0 && (
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 p-3 border-t bg-muted/10">
                    {device.sensors
                      .filter(sensor => !sensor.name.includes("rssi") && !sensor.name.includes("snr"))
                      .map(sensor => {
                        const sensorName = sensor.name.split('/').pop() || '';
                        const sensorValue = getSensorValue(sensor);
                        
                        return (
                          <div key={sensor.sensorToken} className="flex items-center gap-2 p-2 rounded bg-white">
                            {getSensorIcon(sensorName)}
                            <div>
                              <div className="text-xs font-medium capitalize">
                                {sensorName.replace('_', ' ')}
                              </div>
                              <div className="text-sm font-bold">
                                {sensorValue}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
