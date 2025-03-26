
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Droplet, AlertCircle, ThermometerSnowflake, CloudRain, ChevronDown, ChevronRight, ChevronLeft } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useTempHumidityData } from "@/hooks/useTempHumidityData";
import { DampRiskIndicator } from "./DampRiskIndicator";
import { DampMoldStats } from "./DampMoldStats";
import { DampMoldChart } from "./DampMoldChart";
import { DewPointChart } from "./DewPointChart";
import { DampMoldHeader } from "./DampMoldHeader";
import { DampMoldRiskZones } from "./DampMoldRiskZones";
import { useQuery } from "@tanstack/react-query";
import { fetchZone } from "@/services/zones";
import { fetchSite } from "@/services/sites";
import { LogPanel } from "../TempHumidity/LogPanel";
import { LoadingState } from "../TempHumidity/LoadingState";
import { ErrorState } from "../TempHumidity/ErrorState";
import { TempHumidityResponse } from "@/services/interfaces/temp-humidity";
import { useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface DampMoldViewProps {
  contextType?: "zone" | "site" | "all";
  contextId?: string | null;
  siteId?: string;
  zoneId?: string;
}

// Extend TempHumidityResponse with dew point properties
interface ExtendedTempHumidityResponse extends TempHumidityResponse {
  currentDewPoint?: number;
  dewPointRisk?: "default" | "destructive" | "outline" | "secondary" | "success";
  dewPointDifference?: number;
  stats: TempHumidityResponse["stats"];
  daily: TempHumidityResponse["daily"];
  monthly: TempHumidityResponse["monthly"];
  sourceData: TempHumidityResponse["sourceData"];
}

export function DampMoldView({ 
  contextType: propsContextType, 
  contextId: propsContextId,
  siteId: propsSiteId,
  zoneId: propsZoneId 
}: DampMoldViewProps) {
  const [activeTab, setActiveTab] = useState("daily");
  const [timeRange, setTimeRange] = useState("today");
  const params = useParams<{ siteId: string; zoneId: string }>();
  
  // Use params if props are not provided
  const siteId = propsSiteId || params.siteId;
  const zoneId = propsZoneId || params.zoneId;
  
  // Determine context type based on available IDs
  const contextType = propsContextType || (zoneId ? "zone" : siteId ? "site" : "all");
  const contextId = propsContextId || zoneId || siteId || null;
  
  console.log("DampMoldView props:", { contextType, contextId, siteId, zoneId });
  console.log("Route params:", params);
  
  // Fetch context name (site or zone name)
  const { data: zoneName } = useQuery({
    queryKey: ["zone-name", zoneId],
    queryFn: async () => {
      const zone = await fetchZone(Number(zoneId));
      return zone?.name || "Unknown Zone";
    },
    enabled: !!zoneId,
  });
  
  const { data: siteName } = useQuery({
    queryKey: ["site-name", siteId],
    queryFn: async () => {
      const site = await fetchSite(Number(siteId));
      return site?.name || "Unknown Site";
    },
    enabled: !!siteId && !zoneId,
  });
  
  // Re-use the temperature and humidity data hook to get the necessary data
  const { 
    data: rawData, 
    isLoading, 
    error, 
    isUsingMockData,
    loadingStage,
    apiConnectionFailed,
    logs,
    clearLogs
  } = useTempHumidityData({ 
    forceSiteId: siteId, 
    forceZoneId: zoneId 
  });
  
  const contextName = zoneId ? zoneName : siteId ? siteName : "All Locations";
  
  console.log("Raw data:", rawData);
  console.log("Loading state:", { isLoading, loadingStage, apiConnectionFailed });
  
  // Process the data to add dew point properties
  const data: ExtendedTempHumidityResponse = rawData || {
    stats: {
      avgTemp: 0,
      minTemp: 0,
      maxTemp: 0,
      avgHumidity: 0,
      status: {
        avgTemp: 'good',
        minTemp: 'good',
        maxTemp: 'good',
        avgHumidity: 'good'
      }
    },
    daily: [],
    monthly: [],
    sourceData: {
      temperatureSensors: [],
      humiditySensors: []
    }
  };
  
  // Add mock dew point data if not available
  if (data) {
    data.currentDewPoint = data.currentDewPoint || 12.3;
    data.dewPointDifference = data.dewPointDifference || 5.2;
    data.dewPointRisk = data.dewPointRisk || "secondary";
  }
  
  if (isLoading || loadingStage !== "complete") {
    return <LoadingState />;
  }
  
  if (error || apiConnectionFailed) {
    return <ErrorState onRetry={() => {}} />;
  }

  // Sample monthly data for table
  const monthlyRiskData = [
    { id: 'hh1', zone: 'Classroom 1', building: 'Happy Hounds', temp: '19.2', rh: '81', dewPoint: '13.5', risk: 'High', timeInHighRh: '10h', comments: 'Poor ventilation' },
    { id: 'ba1', zone: 'Staff Room', building: 'Building A', temp: '20.1', rh: '68', dewPoint: '13.9', risk: 'Medium', timeInHighRh: '3h', comments: 'Blocked fan' },
    { id: 'bb1', zone: 'Library', building: 'Building B', temp: '18.4', rh: '60', dewPoint: '10.4', risk: 'Low', timeInHighRh: '0h', comments: 'No issues' },
    { id: 'c1', zone: 'Office 2', building: 'C', temp: '21', rh: '85', dewPoint: '18', risk: 'High', timeInHighRh: '12h past day', comments: 'Leaky window detected' },
    { id: 'c2', zone: 'Storage Room', building: 'C', temp: '17.5', rh: '72', dewPoint: '12.4', risk: 'Medium', timeInHighRh: '6h past 24h', comments: 'Check for insulation gaps' },
  ];
  
  return (
    <div className="space-y-6">
      {/* "Risk at a glance" section */}
      <Card className="border-0 shadow-sm">
        <CardHeader className="pb-2">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Damp & Mould Risk at a glance</h2>
            <p className="text-sm text-gray-500">Building Name has been monitored since 12 June 2023</p>
          </div>
          <div className="flex space-x-4 mt-3">
            <Tabs defaultValue={timeRange} className="w-auto">
              <TabsList className="bg-gray-100 p-1">
                <TabsTrigger value="today" className="data-[state=active]:bg-white">Today</TabsTrigger>
                <TabsTrigger value="month" className="data-[state=active]:bg-white">Month</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </CardHeader>
        <CardContent>
          {/* Sample time indicator */}
          <div className="text-xs text-center text-gray-500 mb-4">
            14:10 | Fri 4 Oct <span className="text-base font-medium text-gray-700 ml-1">22 °C</span>
          </div>
          
          {activeTab === "daily" ? (
            <div className="h-[300px] mt-4">
              {/* This will be replaced by the actual chart component */}
              <img 
                src="/lovable-uploads/c7617745-f793-43e6-b68e-1739f76d0a94.png" 
                alt="Damp and mold risk chart" 
                className="w-full h-full object-contain"
              />
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[100px]">Building</TableHead>
                    <TableHead>Zone</TableHead>
                    <TableHead className="text-right">Temp (°C)</TableHead>
                    <TableHead className="text-right">RH (%)</TableHead>
                    <TableHead className="text-right">Dew Point (°C)</TableHead>
                    <TableHead>Risk Level</TableHead>
                    <TableHead>Time in High RH</TableHead>
                    <TableHead>Comments</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {monthlyRiskData.map((row) => (
                    <TableRow key={row.id}>
                      <TableCell className="font-medium">{row.building}</TableCell>
                      <TableCell>{row.zone}</TableCell>
                      <TableCell className="text-right">{row.temp}</TableCell>
                      <TableCell className="text-right">{row.rh}</TableCell>
                      <TableCell className="text-right">{row.dewPoint}</TableCell>
                      <TableCell>
                        <Badge variant={row.risk === 'High' ? 'destructive' : row.risk === 'Medium' ? 'secondary' : 'success'}>
                          {row.risk}
                        </Badge>
                      </TableCell>
                      <TableCell>{row.timeInHighRh}</TableCell>
                      <TableCell>{row.comments}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Daily Overview section with description */}
      <Card className="border-0 shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-xl font-bold text-gray-900">Daily Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-700 mb-6">
            Lowest temps rarely dip below <span className="font-semibold">8°C</span>, 
            highest near <span className="font-semibold">22°C</span>. Humidity remains 
            about <span className="font-semibold">47%</span>, showing steady indoor 
            conditions with minor fluctuations linked to weather or occupancy.
          </p>
          
          {/* Second chart section (bar chart) */}
          <Tabs defaultValue={timeRange} className="w-auto mb-4">
            <TabsList className="bg-gray-100 p-1">
              <TabsTrigger value="today" className="data-[state=active]:bg-white">Today</TabsTrigger>
              <TabsTrigger value="month" className="data-[state=active]:bg-white">Month</TabsTrigger>
            </TabsList>
          </Tabs>
          
          <div className="h-[300px] mt-6">
            {/* Day selector and bar chart */}
            <div className="flex items-center justify-between text-sm mb-4">
              <Button variant="outline" size="sm" className="flex items-center gap-1">
                <ChevronLeft className="h-4 w-4" />
                15th Dec
              </Button>
              <div className="text-gray-500">
                08:00 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 12:00 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 18:00
              </div>
              <Button variant="outline" size="sm" className="flex items-center gap-1">
                16th Dec
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>

            {/* Placeholder for bar chart */}
            <div className="h-[250px] bg-gray-50 flex items-center justify-center">
              {/* This would be replaced with the actual bar chart component */}
              <div className="text-gray-400">Bar chart visualization will be displayed here</div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Only show logs in development environment */}
      {process.env.NODE_ENV === 'development' && (
        <div className="mt-8">
          <LogPanel logs={logs} onClearLogs={clearLogs} title="Damp & Mold Monitoring Logs" />
        </div>
      )}
    </div>
  );
}
