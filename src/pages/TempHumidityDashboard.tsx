
import { SidebarWrapper } from "@/components/Dashboard/Sidebar";
import { DashboardHeader } from "@/components/Dashboard/TempHumidity/DashboardHeader";
import { DashboardMainContent } from "@/components/Dashboard/TempHumidity/DashboardMainContent";
import { useTempHumidityData } from "@/hooks/useTempHumidityData";
import { useContextName } from "@/components/Dashboard/TempHumidity/useContextName";
import { useParams, useLocation } from "react-router-dom";
import { LogPanel } from "@/components/Dashboard/TempHumidity/LogPanel";
import { SpecificZoneView } from "@/components/Dashboard/TempHumidity/SpecificZoneView";
import { useEffect } from "react";
import { toast } from "sonner";
import { RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function TempHumidityDashboard() {
  // Get route params to detect if we're viewing a zone
  const { zoneId, siteId } = useParams<{ zoneId: string; siteId: string }>();
  const location = useLocation();
  
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
    <SidebarWrapper>
      <div className="flex h-screen overflow-hidden">
        {/* Main content - removed the sidebar with ZonesHierarchy */}
        <div className="flex-1 overflow-y-auto">
          <div className="container mx-auto py-8 px-6 md:px-8 lg:px-12">
            {/* Header section with breadcrumbs and badges */}
            <DashboardHeader 
              isUsingMockData={isUsingMockData} 
              isLoading={isLoading} 
              operatingHours={data?.operatingHours}
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
                {/* Main dashboard content with stats, charts and sensor info */}
                <DashboardMainContent 
                  data={data}
                  isLoading={isLoading}
                  error={error}
                  loadingStage={loadingStage}
                  isUsingMockData={isUsingMockData}
                  contextName={contextName}
                  apiConnectionFailed={apiConnectionFailed}
                  onRetry={refetch}
                />
                
                {/* Log panel to show API data and processing logs */}
                <LogPanel 
                  logs={logs}
                  title={`Temperature API Logs - ${contextName}`}
                  onClearLogs={clearLogs}
                />
              </>
            )}
          </div>
        </div>
      </div>
    </SidebarWrapper>
  );
}
