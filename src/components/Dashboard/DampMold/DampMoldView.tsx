import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { fetchZone } from "@/services/zones";
import { fetchSite } from "@/services/sites";
import { LogPanel } from "../TempHumidity/LogPanel";
import { LoadingState } from "../TempHumidity/LoadingState";
import { ErrorState } from "../TempHumidity/ErrorState";
import { TempHumidityResponse } from "@/services/interfaces/temp-humidity";
import { RiskGlanceSection } from "./RiskGlanceSection";
import { DailyOverviewSection } from "./DailyOverviewSection";
import { MonthlyOverviewSection } from "./MonthlyOverviewSection";
import { generateMonthlyRiskData } from "./utils/mockRiskData";
import { generateMockData } from "@/services/sensors/mock-data-generator";

interface DampMoldViewProps {
  contextType?: "zone" | "site" | "all";
  contextId?: string | null;
  siteId?: string;
  zoneId?: string;
  activeFilter?: string | null;
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
  zoneId: propsZoneId,
  activeFilter = null
}: DampMoldViewProps) {
  const [activeTab, setActiveTab] = useState("today");
  const [dailyTimeRange, setDailyTimeRange] = useState("today");
  const [monthlyTimeRange, setMonthlyTimeRange] = useState("month");
  const params = useParams<{ siteId: string; zoneId: string }>();
  
  // Use params if props are not provided
  const siteId = propsSiteId || params.siteId;
  const zoneId = propsZoneId || params.zoneId;
  
  // Determine context type based on available IDs
  const contextType = propsContextType || (zoneId ? "zone" : siteId ? "site" : "all");
  const contextId = propsContextId || zoneId || siteId || null;
  
  console.log("DampMoldView props:", { contextType, contextId, siteId, zoneId, activeFilter });
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
  
  // Use simulated data instead of API data
  const simulatedData = generateMockData();
  const contextName = zoneId ? zoneName : siteId ? siteName : "All Locations";
  
  console.log("Using simulated data:", simulatedData);
  
  // Process the data to add dew point properties
  const data: ExtendedTempHumidityResponse = {
    ...simulatedData,
    currentDewPoint: 12.3,
    dewPointDifference: 5.2,
    dewPointRisk: "secondary"
  };
  
  // Get the monthly risk data and filter based on activeFilter if needed
  let monthlyRiskData = generateMonthlyRiskData();
  
  // Apply filtering based on activeFilter
  if (activeFilter) {
    console.log(`Filtering data by ${activeFilter}`);
    if (activeFilter === 'high-risk') {
      monthlyRiskData = monthlyRiskData.filter(item => item.overallRisk === 'Alarm');
    } else if (activeFilter === 'caution') {
      monthlyRiskData = monthlyRiskData.filter(item => item.overallRisk === 'Caution');
    } else if (activeFilter === 'normal') {
      monthlyRiskData = monthlyRiskData.filter(item => item.overallRisk === 'Good');
    }
    // Other filters like 'buildings' or 'zones' could be implemented similarly
  }
  
  return (
    <div className="space-y-6">
      {/* "Risk at a glance" section */}
      <RiskGlanceSection 
        activeTab={activeTab} 
        setActiveTab={setActiveTab}
        timeRange={dailyTimeRange} 
        setTimeRange={setDailyTimeRange} 
        monthlyRiskData={monthlyRiskData}
        activeFilter={activeFilter}
      />

      {/* Daily Overview section with description */}
      <DailyOverviewSection 
        timeRange={dailyTimeRange} 
        setTimeRange={setDailyTimeRange}
      />
      
      {/* Monthly Overview section */}
      <MonthlyOverviewSection 
        timeRange={monthlyTimeRange}
        setTimeRange={setMonthlyTimeRange}
        monthlyRiskData={monthlyRiskData} 
      />
      
      {/* Only show logs in development environment */}
      {process.env.NODE_ENV === 'development' && (
        <div className="mt-8">
          <LogPanel logs={[
            { message: 'Using simulated data only', type: 'info', timestamp: new Date().toISOString() },
            ...(activeFilter ? [{ 
              message: `Filtering data by: ${activeFilter}`, 
              type: 'info', 
              timestamp: new Date().toISOString() 
            }] : [])
          ]} onClearLogs={() => {}} title="Damp & Mold Monitoring Logs" />
        </div>
      )}
    </div>
  );
}
