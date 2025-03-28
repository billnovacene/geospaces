
import { useParams, useLocation } from "react-router-dom";
import { DashboardMainContent } from "@/components/Dashboard/TempHumidity/DashboardMainContent";
import { useTempHumidityData } from "@/hooks/useTempHumidityData";
import { useContextName } from "@/components/Dashboard/TempHumidity/useContextName";
import { SpecificZoneView } from "@/components/Dashboard/TempHumidity/SpecificZoneView";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { LogPanel } from "@/components/Dashboard/TempHumidity/LogPanel";
import { DashboardLayout } from "@/components/Dashboard/Common/DashboardLayout";
import { DashboardHeader } from "@/components/Dashboard/Common/DashboardHeader";
import { StatItem } from "@/components/Dashboard/Common/SummaryStats";

export default function TempHumidityDashboard() {
  // Get route params to detect if we're viewing a zone
  const { zoneId, siteId } = useParams<{ zoneId: string; siteId: string }>();
  const location = useLocation();
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [activeFilter, setActiveFilter] = useState<string | null>(null);
  
  // Special case handling for site 471 - always show zone 12658
  const shouldRenderSpecificZone = siteId === "471" && !zoneId;
  const effectiveZoneId = shouldRenderSpecificZone ? "12658" : zoneId;
  const effectiveSiteId = siteId;
  
  console.log(`TempHumidityDashboard: Rendering with params: siteId=${effectiveSiteId}, zoneId=${effectiveZoneId}`);
  console.log(`TempHumidityDashboard: shouldRenderSpecificZone=${shouldRenderSpecificZone}`);
  
  // Custom hooks to manage data and context
  const { 
    data, 
    isLoading, 
    error, 
    isUsingMockData, 
    loadingStage, 
    apiConnectionFailed, 
    refetch,
    logs,
    clearLogs
  } = useTempHumidityData({
    forceSiteId: effectiveSiteId,
    forceZoneId: effectiveZoneId
  });
  
  const { contextName } = useContextName();
  
  // Create stats based on data
  const createSummaryStats = (): StatItem[] => {
    if (isLoading || !data) {
      return [
        { value: "-", label: "Avg Temp", secondaryLabel: "Loading...", type: "neutral", key: "avgTemp" },
        { value: "-", label: "Min Temp", secondaryLabel: "Loading...", type: "neutral", key: "minTemp" },
        { value: "-", label: "Max Temp", secondaryLabel: "Loading...", type: "neutral", key: "maxTemp" },
        { value: "-", label: "Avg Humidity", secondaryLabel: "Loading...", type: "neutral", key: "avgHumidity" },
        { value: "-", label: "Sensors", secondaryLabel: "Loading...", type: "neutral", key: "sensors" }
      ];
    }
    
    // Real data
    return [
      { 
        value: data.stats.avgTemp.toFixed(1) + "°C", 
        label: "Avg Temp", 
        secondaryLabel: getStatusLabel(data.stats.status.avgTemp), 
        type: getTypeFromStatus(data.stats.status.avgTemp), 
        key: "avgTemp" 
      },
      { 
        value: data.stats.minTemp.toFixed(1) + "°C", 
        label: "Min Temp", 
        secondaryLabel: getStatusLabel(data.stats.status.minTemp), 
        type: getTypeFromStatus(data.stats.status.minTemp), 
        key: "minTemp" 
      },
      { 
        value: data.stats.maxTemp.toFixed(1) + "°C", 
        label: "Max Temp", 
        secondaryLabel: getStatusLabel(data.stats.status.maxTemp), 
        type: getTypeFromStatus(data.stats.status.maxTemp), 
        key: "maxTemp" 
      },
      { 
        value: Math.round(data.stats.avgHumidity) + "%", 
        label: "Avg Humidity", 
        secondaryLabel: getStatusLabel(data.stats.status.avgHumidity), 
        type: getTypeFromStatus(data.stats.status.avgHumidity), 
        key: "avgHumidity" 
      },
      { 
        value: data.stats.activeSensors.toString(), 
        label: "Sensors", 
        secondaryLabel: "Active", 
        type: "normal", 
        key: "sensors" 
      }
    ];
  };
  
  // Helper function to convert status to type
  const getTypeFromStatus = (status: 'good' | 'caution' | 'warning'): StatItem['type'] => {
    switch (status) {
      case 'good': return 'success';
      case 'caution': return 'caution';
      case 'warning': return 'high-risk';
      default: return 'normal';
    }
  };
  
  // Helper function to get status label
  const getStatusLabel = (status: 'good' | 'caution' | 'warning'): string => {
    switch (status) {
      case 'good': return 'Optimal';
      case 'caution': return 'Caution';
      case 'warning': return 'Warning';
      default: return 'Unknown';
    }
  };
  
  // Handle manual refresh
  const handleRefresh = () => {
    toast.info("Refreshing data...", {
      description: `Fetching latest temperature data for ${contextName}`,
      action: {
        label: "Cancel",
        onClick: () => {}
      }
    });
    refetch();
  };
  
  // Handle date change
  const handleDateChange = (date: Date) => {
    console.log("Date changed to:", date);
    setCurrentDate(date);
    // Implement date-specific data fetching here
    refetch();
  };
  
  // Handle stat click
  const handleStatClick = (stat: StatItem) => {
    console.log("Stat clicked:", stat);
    if (activeFilter === stat.key) {
      setActiveFilter(null);
    } else {
      setActiveFilter(stat.key);
    }
  };
  
  // Refetch data when the zone or site changes
  useEffect(() => {
    if (effectiveZoneId || effectiveSiteId) {
      console.log(`TempHumidityDashboard: Context changed to ${effectiveZoneId ? `zone ${effectiveZoneId}` : `site ${effectiveSiteId}`}, refetching data...`);
      refetch();
    }
  }, [effectiveZoneId, effectiveSiteId, refetch]);
  
  // Show error toast when API connection fails
  useEffect(() => {
    if (apiConnectionFailed) {
      toast.error("API connection failed", {
        description: `Unable to retrieve temperature data for ${effectiveZoneId ? `zone ${effectiveZoneId}` : effectiveSiteId ? `site ${effectiveSiteId}` : 'dashboard'}.`,
        duration: 5000,
      });
    }
  }, [apiConnectionFailed, effectiveZoneId, effectiveSiteId]);
  
  return (
    <DashboardLayout
      onDateChange={handleDateChange}
      currentDate={currentDate}
    >
      {/* Header section with stats */}
      <DashboardHeader
        title="Temperature & Humidity"
        subtitle={`Data for ${contextName || 'All Locations'}`}
        stats={createSummaryStats()}
        onStatClick={handleStatClick}
        activeFilter={activeFilter}
      />

      {/* Special case for site 471 - show specific zone 12658 */}
      {shouldRenderSpecificZone ? (
        <SpecificZoneView 
          siteId="471" 
          zoneId="12658" 
          contextName="Zone 12658 (Site 471)"
        />
      ) : (
        <>
          {/* Main dashboard content with charts and sensor info */}
          <DashboardMainContent 
            data={data}
            isLoading={isLoading}
            error={error}
            loadingStage={loadingStage}
            isUsingMockData={isUsingMockData}
            contextName={contextName}
            apiConnectionFailed={apiConnectionFailed}
            onRetry={refetch}
            activeFilter={activeFilter}
          />
          
          {/* Log panel to show API data and processing logs */}
          <LogPanel 
            logs={logs}
            title={`Temperature API Logs - ${contextName}`}
            onClearLogs={clearLogs}
          />
        </>
      )}
    </DashboardLayout>
  );
}
