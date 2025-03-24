
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useQuery } from "@tanstack/react-query";
import { fetchDevicesForZone } from "@/services/devices";
import { Badge } from "@/components/ui/badge";
import { 
  Smartphone, 
  Wifi, 
  AlertTriangle, 
  Thermometer, 
  Droplets, 
  Wind, 
  Battery, 
  Lightbulb, 
  Signal, 
  Clock,
  ChevronDown,
  MoreHorizontal,
  X
} from "lucide-react";
import { getStatusColor } from "@/utils/formatting";
import { format } from "date-fns";
import {
  Chart,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Button } from "@/components/ui/button";

interface ZoneDevicesProps {
  zoneId: number;
}

export const ZoneDevices = ({ zoneId }: ZoneDevicesProps) => {
  const [activeTab, setActiveTab] = useState("liveData");
  const [expandMeasures, setExpandMeasures] = useState(false);
  const [expandStatus, setExpandStatus] = useState(false);

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
      return format(new Date(dateString), "MM/dd/yyyy");
    } catch (e) {
      return dateString;
    }
  };

  // Format time
  const formatTime = (dateString: string | undefined) => {
    if (!dateString) return "N/A";
    try {
      return format(new Date(dateString), "HH:mm:ss");
    } catch (e) {
      return "";
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
    if (sensorName.includes("temperature")) return <Thermometer className="h-5 w-5 text-teal-500" />;
    if (sensorName.includes("humidity")) return <Droplets className="h-5 w-5 text-blue-500" />;
    if (sensorName.includes("co2")) return <Wind className="h-5 w-5 text-purple-500" />;
    if (sensorName.includes("vdd") || sensorName.includes("battery")) return <Battery className="h-5 w-5 text-green-500" />;
    if (sensorName.includes("light")) return <Lightbulb className="h-5 w-5 text-yellow-500" />;
    if (sensorName.includes("rssi") || sensorName.includes("snr")) return <Signal className="h-5 w-5 text-slate-500" />;
    return <div className="h-5 w-5" />;
  };

  // Mock data for charts
  const generateMockData = (baseValue: number, hours: number = 12) => {
    return Array.from({ length: hours }, (_, i) => ({
      hour: `${(i * 2).toString().padStart(2, '0')}.00`,
      value: baseValue + Math.random() * (baseValue * 0.5) - (baseValue * 0.25),
    }));
  };

  const mockTempData = generateMockData(22);
  const mockCO2Data = generateMockData(450);

  if (isLoading) {
    return (
      <Card className="col-span-2">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2">
            <Wifi className="h-5 w-5 text-primary" />
            Loading Device Data...
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Skeleton className="h-[600px] w-full" />
        </CardContent>
      </Card>
    );
  }

  if (error || !devices || devices.length === 0) {
    return (
      <Card className="col-span-2">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2">
            <Wifi className="h-5 w-5 text-primary" />
            Devices in Zone {zoneId}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {error ? (
            <div className="text-center py-8 text-muted-foreground">
              <AlertTriangle className="mx-auto h-8 w-8 mb-2 text-yellow-500" />
              <p>Error loading devices. Please try again later.</p>
            </div>
          ) : (
            <div className="text-center py-8 border rounded-md bg-muted/30">
              <p className="text-muted-foreground">No devices found in zone {zoneId}</p>
            </div>
          )}
        </CardContent>
      </Card>
    );
  }

  // Get the first device to display (we'll show one device at a time in this UI)
  const device = devices[0];
  
  // Get environmental sensors for the current device
  const temperatureSensor = device.sensors?.find(s => s.name.includes('temperature'));
  const co2Sensor = device.sensors?.find(s => s.name.includes('co2'));
  const batterySensor = device.sensors?.find(s => s.name.includes('battery') || s.name.includes('vdd'));
  const rssiSensor = device.sensors?.find(s => s.name.includes('rssi'));

  // Get the last read time for display
  const lastReadTime = temperatureSensor?.lastReceivedDataTime || device.lastUpdated || device.createdAt;
  const formattedLastReadTime = lastReadTime ? `${formatDate(lastReadTime)}, ${formatTime(lastReadTime)}` : 'N/A';

  // Function to get formatted measurement value
  const formatMeasurement = (sensor: any, defaultUnit: string = '') => {
    if (!sensor) return 'N/A';
    const value = sensor.lastReceivedDataValue;
    if (value === undefined || value === null) return 'N/A';
    const unit = sensor.unit || defaultUnit;
    return `${value}${unit}`;
  };

  return (
    <Card className="col-span-2">
      <CardHeader className="flex flex-row items-start justify-between pb-2 space-y-0">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-bold">{device.name}</h2>
            <Badge variant="outline" className={`ml-2 ${device.status === 'Online' ? 'bg-green-50 text-green-600' : 'bg-gray-50 text-gray-600'}`}>
              {device.status === 'Online' ? 'Online' : device.status || 'Unknown'}
            </Badge>
          </div>
          <div className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
            <Wifi className="h-4 w-4" /> 
            {device.modelId?.name || 'Device'} • {device.location || 'Unknown Location'}
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="ghost" size="icon">
            <MoreHorizontal className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon">
            <X className="h-5 w-5" />
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className="pb-4">
        <Tabs defaultValue="liveData" value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="w-full mb-6 grid grid-cols-3 border-b rounded-none bg-transparent h-auto p-0">
            <TabsTrigger 
              value="liveData" 
              className="border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none rounded-none py-2.5 text-base"
            >
              Live data
            </TabsTrigger>
            <TabsTrigger 
              value="info" 
              className="border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none rounded-none py-2.5 text-base"
            >
              Info
            </TabsTrigger>
            <TabsTrigger 
              value="events" 
              className="border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none rounded-none py-2.5 text-base"
            >
              Events
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="liveData" className="m-0">
            <div className="mb-6">
              <div className="flex gap-4 mb-6">
                <Button variant="outline" size="sm">
                  Day <ChevronDown className="h-4 w-4 ml-1" />
                </Button>
                <Button variant="outline" size="sm">
                  Month <ChevronDown className="h-4 w-4 ml-1" />
                </Button>
                <Button variant="outline" size="sm">
                  Year <ChevronDown className="h-4 w-4 ml-1" />
                </Button>
              </div>
              
              <div className="flex gap-3 mb-4">
                <Badge className="bg-purple-100 text-purple-800 hover:bg-purple-100 px-3 py-1 rounded-md">
                  <div className="w-3 h-3 bg-purple-500 rounded-sm mr-2"></div>
                  CO2 <ChevronDown className="h-4 w-4 ml-1" />
                </Badge>
                
                <Badge className="bg-teal-100 text-teal-800 hover:bg-teal-100 px-3 py-1 rounded-md">
                  <div className="w-3 h-3 bg-teal-500 rounded-sm mr-2"></div>
                  Temperature <ChevronDown className="h-4 w-4 ml-1" />
                </Badge>
              </div>

              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={mockCO2Data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                    <defs>
                      <linearGradient id="colorCO2" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#9c5ee8" stopOpacity={0.2} />
                        <stop offset="95%" stopColor="#9c5ee8" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eeeeee" />
                    <XAxis dataKey="hour" stroke="#999" fontSize={12} />
                    <YAxis 
                      stroke="#999" 
                      fontSize={12} 
                      domain={[300, 700]}
                      orientation="right"
                      tickCount={5}
                      tickFormatter={(value) => `${value}`} 
                      yAxisId="left"
                    />
                    <YAxis 
                      stroke="#999" 
                      fontSize={12} 
                      domain={[18, 22]}
                      orientation="right"
                      tickCount={5}
                      tickFormatter={(value) => `${value}`} 
                      yAxisId="right"
                      axisLine={false}
                      tickLine={false}
                    />
                    <Tooltip />
                    <Area 
                      type="monotone" 
                      dataKey="value" 
                      stroke="#9c5ee8" 
                      fillOpacity={1} 
                      fill="url(#colorCO2)" 
                      strokeWidth={2}
                      yAxisId="left"
                    />
                    <Bar 
                      dataKey="value" 
                      fill="#2dd4bf" 
                      radius={[4, 4, 0, 0]}
                      yAxisId="right"
                      barSize={20}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
            
            <div>
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-lg font-bold flex items-center">
                  ACTIVE MEASURES
                </h3>
                <Button variant="ghost" size="sm" onClick={() => setExpandMeasures(!expandMeasures)}>
                  Expand all <ChevronDown className="h-4 w-4 ml-1" />
                </Button>
              </div>
              
              {co2Sensor && (
                <div className="border rounded-md mb-4 overflow-hidden">
                  <div className="p-4 flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-green-500"></div>
                      <span className="text-lg">CO2</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-sm text-muted-foreground">Last read: {formattedLastReadTime}</div>
                      <ChevronDown className="h-5 w-5" />
                    </div>
                  </div>
                  <div className="px-4 pb-4">
                    <div className="text-4xl font-bold">{formatMeasurement(co2Sensor, 'ppm')}</div>
                  </div>
                </div>
              )}
              
              {temperatureSensor && (
                <div className="border rounded-md mb-4 overflow-hidden">
                  <div className="p-4 flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-green-500"></div>
                      <span className="text-lg">Temperature</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-sm text-muted-foreground">Last read: {formattedLastReadTime}</div>
                      <ChevronDown className="h-5 w-5" />
                    </div>
                  </div>
                  <div className="px-4 pb-4">
                    <div className="text-4xl font-bold">{formatMeasurement(temperatureSensor, '°C')}</div>
                  </div>
                </div>
              )}
              
              <div className="mt-8">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg font-bold flex items-center">
                    ASSET STATUS MEASURES
                  </h3>
                  <Button variant="ghost" size="sm" onClick={() => setExpandStatus(!expandStatus)}>
                    Expand all <ChevronDown className="h-4 w-4 ml-1" />
                  </Button>
                </div>
                
                {batterySensor && (
                  <div className="border rounded-md mb-4 overflow-hidden">
                    <div className="p-4 flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-green-500"></div>
                        <span className="text-lg">Battery</span>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-sm text-muted-foreground">Last read: {formattedLastReadTime}</div>
                        <ChevronDown className="h-5 w-5" />
                      </div>
                    </div>
                    <div className="px-4 pb-4">
                      <div className="text-4xl font-bold">{formatMeasurement(batterySensor, '%')}</div>
                    </div>
                  </div>
                )}
                
                {rssiSensor && (
                  <div className="border rounded-md mb-4 overflow-hidden">
                    <div className="p-4 flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-green-500"></div>
                        <span className="text-lg">RSSI</span>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-sm text-muted-foreground">Last read: {formattedLastReadTime}</div>
                        <ChevronDown className="h-5 w-5" />
                      </div>
                    </div>
                    <div className="px-4 pb-4">
                      <div className="text-4xl font-bold">{formatMeasurement(rssiSensor)}</div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="info" className="m-0">
            <div className="text-center p-12 text-muted-foreground">
              <p>Device information will be displayed here.</p>
            </div>
          </TabsContent>
          
          <TabsContent value="events" className="m-0">
            <div className="text-center p-12 text-muted-foreground">
              <p>Device events will be displayed here.</p>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};
