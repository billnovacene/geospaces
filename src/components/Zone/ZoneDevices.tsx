
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useQuery } from "@tanstack/react-query";
import { fetchDevicesForZone } from "@/services/devices";
import { Badge } from "@/components/ui/badge";
import { Smartphone, Wifi, AlertTriangle, Thermometer, Droplets, Wind, Battery, Lightbulb, Signal, Clock } from "lucide-react";
import { getStatusColor } from "@/utils/formatting";
import { format } from "date-fns";

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

  // Format time
  const formatTime = (dateString: string | undefined) => {
    if (!dateString) return "N/A";
    try {
      return format(new Date(dateString), "h:mm a");
    } catch (e) {
      return "";
    }
  };

  // Get formatted date-time
  const formatDateTime = (dateString: string | undefined) => {
    if (!dateString) return "N/A";
    
    const date = formatDate(dateString);
    const time = formatTime(dateString);
    
    return `${date}, ${time}`;
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
    if (sensorName.includes("temperature")) return <Thermometer className="h-4 w-4 text-orange-500" />;
    if (sensorName.includes("humidity")) return <Droplets className="h-4 w-4 text-blue-500" />;
    if (sensorName.includes("co2")) return <Wind className="h-4 w-4 text-purple-500" />;
    if (sensorName.includes("vdd") || sensorName.includes("battery")) return <Battery className="h-4 w-4 text-green-500" />;
    if (sensorName.includes("light")) return <Lightbulb className="h-4 w-4 text-yellow-500" />;
    if (sensorName.includes("rssi") || sensorName.includes("snr")) return <Signal className="h-4 w-4 text-slate-500" />;
    return null;
  };

  // Get last received data time
  const getLastDataTime = (sensor: any) => {
    if (!sensor || !sensor.lastReceivedDataTime) return null;
    return formatDateTime(sensor.lastReceivedDataTime);
  };

  // Group sensors by device
  const getSensorGroups = (sensors: any[]) => {
    if (!sensors || sensors.length === 0) return [];
    
    const groups = {
      'Environmental': sensors.filter(s => 
        s.name.includes('temperature') || 
        s.name.includes('humidity') || 
        s.name.includes('co2')),
      'Power': sensors.filter(s => 
        s.name.includes('vdd') || 
        s.name.includes('battery')),
      'Light': sensors.filter(s => 
        s.name.includes('light')),
      'Signal': sensors.filter(s => 
        s.name.includes('rssi') || 
        s.name.includes('snr')),
      'Other': sensors.filter(s => 
        !s.name.includes('temperature') && 
        !s.name.includes('humidity') && 
        !s.name.includes('co2') && 
        !s.name.includes('vdd') && 
        !s.name.includes('battery') && 
        !s.name.includes('light') &&
        !s.name.includes('rssi') && 
        !s.name.includes('snr'))
    };
    
    // Remove empty groups
    return Object.entries(groups).filter(([_, sensors]) => sensors.length > 0);
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
          <div className="grid gap-4">
            {devices.map((device) => (
              <div 
                key={device.id} 
                className="border rounded-md overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200"
              >
                <div className="bg-gradient-to-r from-slate-50 to-slate-100 p-4 border-b">
                  <div className="flex items-center">
                    <div className="mr-3 bg-primary/10 p-2 rounded-full">
                      <Smartphone className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="font-medium text-lg">{device.name}</h3>
                        <Badge variant="outline" className={getStatusColor(device.status || "Unknown")}>
                          {device.status || "Unknown"}
                        </Badge>
                      </div>
                      <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mt-1">
                        <span className="flex items-center">ID: {device.id}</span>
                        {device.modelId && <span className="flex items-center">Model: {device.modelId.name || "Unknown"}</span>}
                        <span className="flex items-center gap-1">
                          <Clock className="h-3.5 w-3.5" />
                          Added: {formatDate(device.createdAt)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {device.sensors && device.sensors.length > 0 && (
                  <div className="p-4 bg-white">
                    {getSensorGroups(device.sensors).map(([groupName, sensors]) => (
                      <div key={groupName} className="mb-4 last:mb-0">
                        <h4 className="text-sm font-medium text-muted-foreground mb-2 px-1">{groupName}</h4>
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                          {sensors.map(sensor => {
                            const sensorName = sensor.name.split('/').pop() || '';
                            const sensorValue = getSensorValue(sensor);
                            const lastDataTime = getLastDataTime(sensor);
                            
                            return (
                              <div key={sensor.sensorToken} className="flex items-center gap-2 p-3 rounded border bg-slate-50 hover:bg-slate-100 transition-colors">
                                <div className="p-1.5 bg-white rounded-full shadow-sm">
                                  {getSensorIcon(sensorName) || <div className="h-4 w-4" />}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div className="text-xs font-medium capitalize truncate">
                                    {sensorName.replace(/_/g, ' ')}
                                  </div>
                                  <div className="text-sm font-bold">
                                    {sensorValue}
                                  </div>
                                  {lastDataTime && (
                                    <div className="text-[10px] text-muted-foreground truncate">
                                      Last update: {lastDataTime}
                                    </div>
                                  )}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    ))}
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
