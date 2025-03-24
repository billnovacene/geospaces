
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

export default function TempHumidityDashboard() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["temp-humidity-data"],
    queryFn: fetchTempHumidityData,
  });

  // Log data for debugging
  useEffect(() => {
    if (data) {
      console.log("Temperature and humidity data:", data);
    }
  }, [data]);

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
