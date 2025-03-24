
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

export default function TempHumidityDashboard() {
  const { siteId, zoneId } = useParams<{ siteId: string; zoneId: string }>();
  
  // We'll use the zone and site params in the future to fetch specific temperature data
  // For now, we're using the mock data service
  const { data, isLoading, error } = useQuery({
    queryKey: ["temp-humidity-data", siteId, zoneId],
    queryFn: fetchTempHumidityData,
  });

  // Log data for debugging
  useEffect(() => {
    if (data) {
      console.log("Temperature and humidity data:", data);
      if (siteId) console.log(`For site: ${siteId}`);
      if (zoneId) console.log(`For zone: ${zoneId}`);
    }
  }, [data, siteId, zoneId]);

  return (
    <SidebarWrapper>
      <div className="container mx-auto py-8 px-6 md:px-8 lg:px-12">
        <div className="mb-4">
          <BreadcrumbNav />
        </div>

        <div className="flex items-center justify-between mb-12">
          <PageHeader />
          
          {!isLoading && !error && data && (
            <TempHumidityStats stats={data.stats} />
          )}
        </div>

        {isLoading ? (
          <LoadingState />
        ) : error ? (
          <ErrorState />
        ) : data ? (
          <DashboardContent data={data} />
        ) : null}
      </div>
    </SidebarWrapper>
  );
}
