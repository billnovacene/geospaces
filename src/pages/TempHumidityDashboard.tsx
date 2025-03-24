
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
  
  const { data: siteData } = useQuery({
    queryKey: ["site-for-temp-dashboard", siteId],
    queryFn: () => fetchSite(Number(siteId)),
    enabled: !!siteId,
  });

  const { data: zoneData } = useQuery({
    queryKey: ["zone-for-temp-dashboard", zoneId],
    queryFn: () => fetchZone(Number(zoneId)),
    enabled: !!zoneId,
  });

  const getContextName = () => {
    if (zoneData) return zoneData.name;
    if (siteData) return siteData.name;
    return "All Locations";
  };

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["temp-humidity-data", siteId, zoneId],
    queryFn: () => fetchTempHumidityData(siteId, zoneId),
  });

  useEffect(() => {
    const liveDataInterval = setInterval(() => {
      refetch();
    }, 30000);
    
    return () => clearInterval(liveDataInterval);
  }, [refetch]);

  useEffect(() => {
    if (data) {
      console.log("Temperature and humidity data:", data);
      
      if (siteId) {
        console.log(`For site: ${siteId} (${siteData?.name || 'unknown'})`);
      }
      
      if (zoneId) {
        console.log(`For zone: ${zoneId} (${zoneData?.name || 'unknown'})`);
      }
      
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

        <div className="flex items-center justify-between mb-8">
          <PageHeader customTitle={`Temperature & Humidity - ${getContextName()}`} />
        </div>
        
        {!isLoading && !error && data && (
          <div className="mb-8">
            <h3 className="text-lg font-medium mb-3">Live Metrics</h3>
            <TempHumidityStats stats={data.stats} />
          </div>
        )}

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
