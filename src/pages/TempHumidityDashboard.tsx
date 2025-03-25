
import { SidebarWrapper } from "@/components/Dashboard/Sidebar";
import { DashboardHeader } from "@/components/Dashboard/TempHumidity/DashboardHeader";
import { DashboardMainContent } from "@/components/Dashboard/TempHumidity/DashboardMainContent";
import { useTempHumidityData } from "@/hooks/useTempHumidityData";
import { useContextName } from "@/components/Dashboard/TempHumidity/useContextName";
import { useParams } from "react-router-dom";
import { ZonesHierarchy } from "@/components/Dashboard/ZonesHierarchy";
import { useEffect } from "react";
import { toast } from "sonner";

export default function TempHumidityDashboard() {
  // Get route params to detect if we're viewing a zone
  const { zoneId, siteId } = useParams<{ zoneId: string; siteId: string }>();
  
  // Custom hooks to manage data and context
  const { 
    data, 
    isLoading, 
    error, 
    isUsingMockData, 
    loadingStage, 
    apiConnectionFailed, 
    refetch 
  } = useTempHumidityData();
  
  const { contextName } = useContextName();
  
  // Refetch data when the zone or site changes
  useEffect(() => {
    if (zoneId || siteId) {
      console.log(`TempHumidityDashboard: Context changed to ${zoneId ? `zone ${zoneId}` : `site ${siteId}`}, refetching data...`);
      refetch();
    }
  }, [zoneId, siteId, refetch]);
  
  // Show error toast when API connection fails
  useEffect(() => {
    if (apiConnectionFailed) {
      toast.error("API connection failed", {
        description: `Unable to retrieve temperature data for ${zoneId ? `zone ${zoneId}` : siteId ? `site ${siteId}` : 'dashboard'}.`,
        duration: 5000,
      });
    }
  }, [apiConnectionFailed, zoneId, siteId]);
  
  return (
    <SidebarWrapper>
      <div className="flex h-screen overflow-hidden">
        {/* Sidebar showing only zones with temperature sensors */}
        <div className="hidden md:block w-64 border-r overflow-y-auto bg-[#FAFAFA]">
          <div className="py-4">
            <h3 className="px-5 font-medium text-sm mb-2">Temperature Zones</h3>
            <ZonesHierarchy
              siteId={siteId ? Number(siteId) : null}
              preserveDashboardRoute={true}
              currentDashboard="temp-humidity"
              hideZonesWithoutSensors={true}
            />
          </div>
        </div>
        
        {/* Main content */}
        <div className="flex-1 overflow-y-auto">
          <div className="container mx-auto py-8 px-6 md:px-8 lg:px-12">
            {/* Header section with breadcrumbs and badges */}
            <DashboardHeader 
              isUsingMockData={isUsingMockData} 
              isLoading={isLoading} 
              operatingHours={data?.operatingHours}
            />

            {/* Main dashboard content with stats, charts and sensor info */}
            <DashboardMainContent 
              data={data}
              isLoading={isLoading}
              error={error}
              loadingStage={loadingStage}
              isUsingMockData={isUsingMockData}
              contextName={contextName}
              apiConnectionFailed={apiConnectionFailed}
            />
          </div>
        </div>
      </div>
    </SidebarWrapper>
  );
}
