
import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { fetchZone } from "@/services/zones";
import { fetchSite } from "@/services/sites";
import { useTempHumidityData } from "@/hooks/useTempHumidityData";
import { LogPanel } from "../TempHumidity/LogPanel";
import { LoadingState } from "../TempHumidity/LoadingState";
import { ErrorState } from "../TempHumidity/ErrorState";
import { TempHumidityResponse } from "@/services/interfaces/temp-humidity";
import { RiskGlanceSection } from "./RiskGlanceSection";
import { DailyOverviewSection } from "./DailyOverviewSection";
import { generateMonthlyRiskData } from "./utils/mockRiskData";

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

  // Get the monthly risk data
  const monthlyRiskData = generateMonthlyRiskData();
  
  return (
    <div className="space-y-6">
      {/* "Risk at a glance" section */}
      <RiskGlanceSection 
        activeTab={activeTab} 
        timeRange={timeRange} 
        setTimeRange={setTimeRange} 
        monthlyRiskData={monthlyRiskData} 
      />

      {/* Daily Overview section with description */}
      <DailyOverviewSection timeRange={timeRange} />
      
      {/* Only show logs in development environment */}
      {process.env.NODE_ENV === 'development' && (
        <div className="mt-8">
          <LogPanel logs={logs} onClearLogs={clearLogs} title="Damp & Mold Monitoring Logs" />
        </div>
      )}
    </div>
  );
}
