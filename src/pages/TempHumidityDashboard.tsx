
import { useEffect } from "react";
import { SidebarWrapper } from "@/components/Dashboard/Sidebar";
import { LoadingState } from "@/components/Dashboard/TempHumidity/LoadingState";
import { ErrorState } from "@/components/Dashboard/TempHumidity/ErrorState";
import { DashboardContent } from "@/components/Dashboard/TempHumidity/DashboardContent";
import { useTempHumidityData } from "@/hooks/useTempHumidityData";
import { ContextInformation } from "@/components/Dashboard/TempHumidity/ContextInformation";
import { DashboardHeader } from "@/components/Dashboard/TempHumidity/DashboardHeader";
import { MetricsSection } from "@/components/Dashboard/TempHumidity/MetricsSection";
import { toast } from "sonner";

export default function TempHumidityDashboard() {
  const {
    data,
    isLoading,
    error,
    isUsingMockData,
    isUsingCachedData,
    handleForceRefresh,
    siteId,
    zoneId
  } = useTempHumidityData();
  
  const context = ContextInformation({
    siteId,
    zoneId,
    isUsingMockData,
    isUsingCachedData
  });

  // Display toast notification when data is loaded
  useEffect(() => {
    if (data) {
      console.log("Temperature and humidity data:", data);
      
      if (siteId) {
        console.log(`For site: ${siteId} (${context.siteData?.name || 'unknown'})`);
      }
      
      if (zoneId) {
        console.log(`For zone: ${zoneId} (${context.zoneData?.name || 'unknown'})`);
      }
      
      const contextType = zoneId ? "zone" : (siteId ? "site" : "dashboard");
      toast.success(`Temperature data loaded for ${contextType}`, {
        id: "temp-data-loaded",
        duration: 2000,
      });
    }
  }, [data, siteId, zoneId, context.siteData, context.zoneData]);

  return (
    <SidebarWrapper>
      <div className="container mx-auto py-8 px-6 md:px-8 lg:px-12">
        <DashboardHeader 
          customTitle={`Temperature & Humidity - ${context.contextName}`}
          badges={context.badges}
        />
        
        {!isLoading && !error && data && (
          <MetricsSection 
            stats={data.stats} 
            sourceData={data.sourceData}
            isUsingMockData={isUsingMockData}
          />
        )}

        {isLoading ? (
          <LoadingState />
        ) : error ? (
          <ErrorState />
        ) : data ? (
          <DashboardContent 
            data={data} 
            contextName={context.contextName} 
            isMockData={isUsingMockData}
            isCachedData={isUsingCachedData}
            onRefresh={handleForceRefresh}
          />
        ) : null}
      </div>
    </SidebarWrapper>
  );
}
