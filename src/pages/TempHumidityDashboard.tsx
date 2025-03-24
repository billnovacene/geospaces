
import { useQuery } from "@tanstack/react-query";
import { fetchTempHumidityData } from "@/services/temp-humidity";
import { SidebarWrapper } from "@/components/Dashboard/Sidebar";
import { useEffect } from "react";
import { BreadcrumbNav } from "@/components/Dashboard/TempHumidity/BreadcrumbNav";
import { TempHumidityStats } from "@/components/Dashboard/TempHumidity/TempHumidityStats";
import { LoadingState } from "@/components/Dashboard/TempHumidity/LoadingState";
import { ErrorState } from "@/components/Dashboard/TempHumidity/ErrorState";
import { DashboardContent } from "@/components/Dashboard/TempHumidity/DashboardContent";
import { PageHeader } from "@/components/Dashboard/TempHumidity/PageHeader";
import { useParams } from "react-router-dom";
import { fetchSite } from "@/services/sites";
import { fetchZone } from "@/services/zones";
import { toast } from "sonner";

export default function TempHumidityDashboard() {
  const { siteId, zoneId } = useParams<{ siteId: string; zoneId: string }>();
  
  // Fetch site data if we have a siteId
  const { data: siteData } = useQuery({
    queryKey: ["site-for-temp-dashboard", siteId],
    queryFn: () => fetchSite(Number(siteId)),
    enabled: !!siteId,
  });

  // Fetch zone data if we have a zoneId
  const { data: zoneData } = useQuery({
    queryKey: ["zone-for-temp-dashboard", zoneId],
    queryFn: () => fetchZone(Number(zoneId)),
    enabled: !!zoneId,
  });

  // Get the contextual name for the header
  const getContextName = () => {
    if (zoneData) return zoneData.name;
    if (siteData) return siteData.name;
    return "All Locations";
  };

  // Fetch the temperature and humidity data for the current context
  const { data, isLoading, error } = useQuery({
    queryKey: ["temp-humidity-data", siteId, zoneId],
    queryFn: fetchTempHumidityData,
  });

  // Log data for debugging
  useEffect(() => {
    if (data) {
      console.log("Temperature and humidity data:", data);
      
      if (siteId) {
        console.log(`For site: ${siteId} (${siteData?.name || 'unknown'})`);
      }
      
      if (zoneId) {
        console.log(`For zone: ${zoneId} (${zoneData?.name || 'unknown'})`);
      }
      
      // Show a toast notification to improve user feedback
      const contextType = zoneId ? "zone" : (siteId ? "site" : "dashboard");
      toast.success(`Temperature data loaded for ${contextType}`, {
        id: "temp-data-loaded",
        duration: 2000,
      });
    }
  }, [data, siteId, zoneId, siteData, zoneData]);

  return (
    <SidebarWrapper>
      <div className="container mx-auto py-8 px-6 md:px-8 lg:px-12">
        <div className="mb-4">
          <BreadcrumbNav />
        </div>

        <div className="flex items-center justify-between mb-12">
          <PageHeader customTitle={`Temperature & Humidity - ${getContextName()}`} />
          
          {!isLoading && !error && data && (
            <TempHumidityStats stats={data.stats} />
          )}
        </div>

        {isLoading ? (
          <LoadingState />
        ) : error ? (
          <ErrorState />
        ) : data ? (
          <DashboardContent data={data} contextName={getContextName()} />
        ) : null}
      </div>
    </SidebarWrapper>
  );
}
