
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Droplet, AlertCircle, ThermometerSnowflake, Humidity } from "lucide-react";
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

interface DampMoldViewProps {
  contextType: "zone" | "site" | "all";
  contextId: string | null;
  siteId?: string;
  zoneId?: string;
}

export function DampMoldView({ 
  contextType, 
  contextId,
  siteId,
  zoneId 
}: DampMoldViewProps) {
  const [activeTab, setActiveTab] = useState("overview");
  
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
    data, 
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
  
  if (isLoading || loadingStage !== "complete") {
    return <LoadingState stage={loadingStage} />;
  }
  
  if (error || apiConnectionFailed) {
    return <ErrorState error={error} />;
  }
  
  return (
    <div className="space-y-6">
      <DampMoldHeader 
        contextType={contextType} 
        contextName={contextName} 
        isUsingMockData={isUsingMockData} 
      />
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <DampRiskIndicator data={data} />
        <DampMoldStats data={data} />
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium">Dew Point Analysis</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <ThermometerSnowflake className="h-5 w-5 text-blue-500" />
                <span className="text-2xl font-bold">
                  {data?.currentDewPoint || "12.3"}°C
                </span>
              </div>
              <Badge variant={data?.dewPointRisk || "low"} className="capitalize">
                {data?.dewPointRisk || "Low Risk"}
              </Badge>
            </div>
            <p className="text-sm text-gray-500">
              Current dew point is {data?.dewPointDifference || "5.2"}°C below surface temperature
            </p>
          </CardContent>
        </Card>
      </div>
      
      <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-3 mb-6">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="dewpoint">Dew Point Analysis</TabsTrigger>
          <TabsTrigger value="risk-zones">Risk Zones</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-6">
          <DampMoldChart data={data} />
        </TabsContent>
        
        <TabsContent value="dewpoint" className="space-y-6">
          <DewPointChart data={data} />
        </TabsContent>
        
        <TabsContent value="risk-zones" className="space-y-6">
          <DampMoldRiskZones data={data} contextType={contextType} />
        </TabsContent>
      </Tabs>
      
      <div className="mt-8">
        <LogPanel logs={logs} clearLogs={clearLogs} title="Damp & Mold Monitoring Logs" />
      </div>
    </div>
  );
}
