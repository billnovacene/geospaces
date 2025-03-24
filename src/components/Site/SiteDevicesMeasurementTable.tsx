
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchSiteDevices } from "@/services/devices";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { TooltipWrapper } from "@/components/UI/TooltipWrapper";
import { AlertTriangle, ChevronUp, ChevronDown, SignalHigh, SignalMedium, SignalLow, ArrowUpRight } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface SiteDevicesMeasurementTableProps {
  siteId: number;
}

// Helper function to determine signal icon based on status
const getSignalIcon = (status: string) => {
  if (status === "Active") {
    return <SignalHigh className="h-5 w-5 text-green-500" />;
  } else if (status === "Warning") {
    return <SignalMedium className="h-5 w-5 text-yellow-500" />;
  } else {
    return <SignalLow className="h-5 w-5 text-gray-400" />;
  }
};

// Helper function to determine status indicator
const getStatusIndicator = (value: number, thresholds: {warning: number, critical: number}) => {
  if (value >= thresholds.critical) {
    return <AlertTriangle className="h-5 w-5 text-red-500" />;
  } else if (value >= thresholds.warning) {
    return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
  }
  return null;
};

// Helper function to format time ago
const formatTimeAgo = (timestamp: string) => {
  if (!timestamp) return "N/A";
  
  try {
    return `${formatDistanceToNow(new Date(timestamp), { addSuffix: false })} ago`;
  } catch (e) {
    return "N/A";
  }
};

export const SiteDevicesMeasurementTable = ({ siteId }: SiteDevicesMeasurementTableProps) => {
  // Sorting state
  const [sortField, setSortField] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  // Handle sorting
  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  // Get sort icon
  const getSortIcon = (field: string) => {
    if (sortField !== field) return null;
    return sortDirection === 'asc' ? 
      <ChevronUp className="h-4 w-4" /> : 
      <ChevronDown className="h-4 w-4" />;
  };

  const { data: devices, isLoading, error } = useQuery({
    queryKey: ["site-devices", siteId],
    queryFn: () => fetchSiteDevices(siteId),
    enabled: !!siteId,
    staleTime: 5 * 60 * 1000,
  });

  // Filter and prepare measurement data
  const prepareDeviceData = (devices) => {
    if (!devices) return [];
    
    return devices.map(device => {
      // Extract sensor data
      const co2Sensor = device.sensors?.find(s => s.name?.toLowerCase().includes('co2'));
      const tempSensor = device.sensors?.find(s => s.name?.toLowerCase().includes('temp'));
      const humiditySensor = device.sensors?.find(s => s.name?.toLowerCase().includes('humid'));
      
      const co2Value = co2Sensor?.lastReceivedDataValue;
      const tempValue = tempSensor?.lastReceivedDataValue;
      const humidityValue = humiditySensor?.lastReceivedDataValue;
      
      const co2Time = co2Sensor?.lastReceivedDataTime;
      const tempTime = tempSensor?.lastReceivedDataTime;
      const humidityTime = humiditySensor?.lastReceivedDataTime;

      // Determine status based on sensor values
      const hasCriticalValue = 
        (co2Value && co2Value > 1000) || 
        (tempValue && (tempValue > 28 || tempValue < 16)) || 
        (humidityValue && (humidityValue > 70 || humidityValue < 20));
        
      const hasWarningValue = 
        (co2Value && co2Value > 800) || 
        (tempValue && (tempValue > 26 || tempValue < 18)) || 
        (humidityValue && (humidityValue > 60 || humidityValue < 30));

      const derivedStatus = hasCriticalValue ? "Inactive" : (hasWarningValue ? "Warning" : "Active");
      
      return {
        id: device.id,
        name: device.name,
        location: device.zoneName || 'Unknown',
        status: derivedStatus,
        co2: {
          value: co2Value,
          time: co2Time,
          unit: 'ppm',
          statusIndicator: co2Value ? getStatusIndicator(co2Value, {warning: 800, critical: 1000}) : null
        },
        temperature: {
          value: tempValue,
          time: tempTime,
          unit: '°C',
          statusIndicator: tempValue ? getStatusIndicator(tempValue > 24 ? 25 : 0, {warning: 25, critical: 28}) : null
        },
        humidity: {
          value: humidityValue,
          time: humidityTime,
          unit: '%',
          statusIndicator: null
        }
      };
    }).filter(device => 
      // Only show devices that have at least one sensor reading
      device.co2.value !== undefined || 
      device.temperature.value !== undefined || 
      device.humidity.value !== undefined
    );
  };

  // Apply sorting to data
  const getSortedData = (data) => {
    if (!sortField) return data;

    return [...data].sort((a, b) => {
      let aValue, bValue;

      if (sortField === 'name') {
        aValue = a.name;
        bValue = b.name;
      } else if (sortField === 'location') {
        aValue = a.location;
        bValue = b.location;
      } else if (sortField === 'co2') {
        aValue = a.co2.value || 0;
        bValue = b.co2.value || 0;
      } else if (sortField === 'temperature') {
        aValue = a.temperature.value || 0;
        bValue = b.temperature.value || 0;
      } else if (sortField === 'humidity') {
        aValue = a.humidity.value || 0;
        bValue = b.humidity.value || 0;
      } else {
        return 0;
      }

      if (aValue === bValue) return 0;
      
      // For numerical values
      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return sortDirection === 'asc' ? aValue - bValue : bValue - aValue;
      }
      
      // For string values
      return sortDirection === 'asc' 
        ? String(aValue).localeCompare(String(bValue))
        : String(bValue).localeCompare(String(aValue));
    });
  };
  
  const devicesData = prepareDeviceData(devices);
  const sortedDevicesData = getSortedData(devicesData);

  return (
    <Card className="w-full mt-6">
      <CardHeader className="pb-3">
        <CardTitle className="text-xl">Devices Measurements</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-3">
            <Skeleton className="w-full h-10" />
            <Skeleton className="w-full h-10" />
            <Skeleton className="w-full h-10" />
            <Skeleton className="w-full h-10" />
          </div>
        ) : error ? (
          <div className="text-center py-8 text-muted-foreground">
            <AlertTriangle className="mx-auto h-8 w-8 mb-2 text-yellow-500" />
            <p>Error loading devices. Please try again later.</p>
          </div>
        ) : sortedDevicesData.length === 0 ? (
          <div className="text-center py-8 border rounded-md bg-muted/30">
            <p className="text-muted-foreground">No devices with sensor data found for this site</p>
          </div>
        ) : (
          <div className="rounded-md border overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[80px]">Status</TableHead>
                  <TableHead className="w-[80px]">Signal</TableHead>
                  <TableHead 
                    className="cursor-pointer hover:bg-muted/50"
                    onClick={() => handleSort('name')}
                  >
                    <div className="flex items-center">
                      Device Name
                      {getSortIcon('name')}
                    </div>
                  </TableHead>
                  <TableHead 
                    className="cursor-pointer hover:bg-muted/50"
                    onClick={() => handleSort('location')}
                  >
                    <div className="flex items-center">
                      Location
                      {getSortIcon('location')}
                    </div>
                  </TableHead>
                  <TableHead 
                    className="cursor-pointer hover:bg-muted/50"
                    onClick={() => handleSort('co2')}
                  >
                    <div className="flex items-center">
                      Active Measure 1
                      {getSortIcon('co2')}
                    </div>
                  </TableHead>
                  <TableHead 
                    className="cursor-pointer hover:bg-muted/50"
                    onClick={() => handleSort('temperature')}
                  >
                    <div className="flex items-center">
                      Active Measure 2
                      {getSortIcon('temperature')}
                    </div>
                  </TableHead>
                  <TableHead 
                    className="cursor-pointer hover:bg-muted/50"
                    onClick={() => handleSort('humidity')}
                  >
                    <div className="flex items-center">
                      Active Measure 3
                      {getSortIcon('humidity')}
                    </div>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedDevicesData.map((device) => (
                  <TableRow key={device.id} className="cursor-pointer hover:bg-muted/50">
                    <TableCell>
                      {device.status === "Inactive" ? (
                        <AlertTriangle className="h-5 w-5 text-red-500" />
                      ) : device.status === "Warning" ? (
                        <AlertTriangle className="h-5 w-5 text-yellow-500" />
                      ) : (
                        <ArrowUpRight className="h-5 w-5 text-green-500" />
                      )}
                    </TableCell>
                    <TableCell>{getSignalIcon(device.status)}</TableCell>
                    <TableCell className="font-medium">
                      {device.name}
                    </TableCell>
                    <TableCell>{device.location}</TableCell>
                    <TableCell>
                      {device.co2.value ? (
                        <div className="flex items-center">
                          <div>
                            <div className="font-medium flex items-center gap-1">
                              {device.co2.value} {device.co2.unit}
                              {device.co2.statusIndicator}
                            </div>
                            <div className="text-xs text-muted-foreground flex items-center gap-1">
                              <span className="inline-block w-2 h-2 bg-green-500 rounded-full"></span>
                              CO2 - {formatTimeAgo(device.co2.time)}
                            </div>
                          </div>
                        </div>
                      ) : "N/A"}
                    </TableCell>
                    <TableCell>
                      {device.temperature.value ? (
                        <div className="flex items-center">
                          <div>
                            <div className="font-medium flex items-center gap-1">
                              {device.temperature.value} {device.temperature.unit}
                              {device.temperature.statusIndicator}
                            </div>
                            <div className="text-xs text-muted-foreground flex items-center gap-1">
                              <span className="inline-block w-2 h-2 bg-green-500 rounded-full"></span>
                              Temp - {formatTimeAgo(device.temperature.time)}
                            </div>
                          </div>
                        </div>
                      ) : "N/A"}
                    </TableCell>
                    <TableCell>
                      {device.humidity.value ? (
                        <div className="flex items-center">
                          <div>
                            <div className="font-medium flex items-center gap-1">
                              {device.humidity.value}{device.humidity.unit}
                              {device.humidity.statusIndicator}
                            </div>
                            <div className="text-xs text-muted-foreground flex items-center gap-1">
                              <span className="inline-block w-2 h-2 bg-green-500 rounded-full"></span>
                              Humidity - {formatTimeAgo(device.humidity.time)}
                            </div>
                          </div>
                        </div>
                      ) : "N/A"}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
