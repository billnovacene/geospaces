
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchTempHumidityData } from "@/services/temp-humidity";
import { SidebarWrapper } from "@/components/Dashboard/Sidebar";
import { useEffect, useState } from "react";
import { BreadcrumbNav } from "@/components/Dashboard/TempHumidity/BreadcrumbNav";
import { TempHumidityStats } from "@/components/Dashboard/TempHumidity/TempHumidityStats";
import { LoadingState } from "@/components/Dashboard/TempHumidity/LoadingState";
import { ErrorState } from "@/components/Dashboard/TempHumidity/ErrorState";
import { DashboardContent } from "@/components/Dashboard/TempHumidity/DashboardContent";
import { PageHeader } from "@/components/Dashboard/TempHumidity/PageHeader";
import { SensorSourceInfo } from "@/components/Dashboard/TempHumidity/SensorSourceInfo";
import { useParams } from "react-router-dom";
import { fetchSite } from "@/services/sites";
import { fetchZone } from "@/services/zones";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Package, Building, AlertTriangle, Clock } from "lucide-react";
import { clearTempHumidityCache } from "@/services/cache/temp-humidity-cache";

export default function TempHumidityDashboard() {
  const { siteId, zoneId } = useParams<{ siteId: string; zoneId: string }>();
  const [isUsingMockData, setIsUsingMockData] = useState(false);
  const [isUsingCachedData, setIsUsingCachedData] = useState(false);
  const queryClient = useQueryClient();
  
  console.log("TempHumidityDashboard: Route params:", { siteId, zoneId });
  
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

  const { data, isLoading, error, refetch, dataUpdatedAt } = useQuery({
    queryKey: ["temp-humidity-data", siteId, zoneId],
    queryFn: () => fetchTempHumidityData(siteId, zoneId),
    staleTime: 5 * 60 * 1000, // Consider data stale after 5 minutes
  });

  // Handle force refresh
  const handleForceRefresh = async () => {
    toast.promise(
      async () => {
        // Clear the cache for this specific data
        clearTempHumidityCache();
        
        // Invalidate the query to force a refetch
        await queryClient.invalidateQueries({ 
          queryKey: ["temp-humidity-data", siteId, zoneId] 
        });
        
        setIsUsingCachedData(false);
      },
      {
        loading: 'Refreshing data...',
        success: 'Data refreshed successfully',
        error: 'Failed to refresh data'
      }
    );
  };

  // Handle data source detection in useEffect
  useEffect(() => {
    if (data) {
      // Check if we're using mock data by examining the API response
      const usingMockData = !data?.sourceData?.temperatureSensors?.length && 
                          !data?.sourceData?.humiditySensors?.length;
      setIsUsingMockData(usingMockData);
      
      // Check if data is from cache - this is set by the service
      setIsUsingCachedData(dataUpdatedAt < Date.now() - 5000); // If data is older than 5 seconds, it's from cache
      
      console.log(`Data source: ${usingMockData ? "SIMULATED" : "REAL API"} data, Cache: ${isUsingCachedData ? "CACHED" : "FRESH"}`);
    }
    
    if (error) {
      console.error("Error fetching temperature data:", error);
    }
  }, [data, error, dataUpdatedAt]);

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

  // Determine data source description with icons
  const getDataSourceDescription = () => {
    if (zoneId && zoneData) {
      return (
        <span className="flex items-center gap-1.5">
          <Package className="h-3.5 w-3.5" />
          Data from sensors in zone {zoneData.name}
        </span>
      );
    } else if (siteId && siteData) {
      return (
        <span className="flex items-center gap-1.5">
          <Building className="h-3.5 w-3.5" />
          Data from sensors in site {siteData.name}
        </span>
      );
    }
    return "Data from all sensors";
  };

  return (
    <SidebarWrapper>
      <div className="container mx-auto py-8 px-6 md:px-8 lg:px-12">
        <div className="mb-4">
          <BreadcrumbNav />
        </div>

        <div className="flex items-center justify-between mb-6">
          <PageHeader customTitle={`Temperature & Humidity - ${getContextName()}`} />
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-xs px-3 py-1">
              {getDataSourceDescription()}
            </Badge>
            
            {isUsingCachedData && !isLoading && (
              <Badge variant="outline" className="text-xs px-3 py-1 bg-green-50 text-green-700 border-green-200">
                <Clock className="h-3.5 w-3.5 mr-1" />
                Cached data
              </Badge>
            )}
            
            {isUsingMockData && !isLoading && (
              <Badge variant="outline" className="text-xs px-3 py-1 bg-amber-50 text-amber-700 border-amber-200">
                <AlertTriangle className="h-3.5 w-3.5 mr-1" />
                Simulated data
              </Badge>
            )}
          </div>
        </div>
        
        {!isLoading && !error && data && (
          <>
            <div className="mb-8">
              <h3 className="text-lg font-medium mb-3">Live Metrics</h3>
              <TempHumidityStats stats={data.stats} />
            </div>
            
            <div className="mb-8">
              <SensorSourceInfo 
                sourceData={data.sourceData} 
                isLoading={false}
                isMockData={isUsingMockData}
              />
            </div>
          </>
        )}

        {isLoading ? (
          <LoadingState />
        ) : error ? (
          <ErrorState />
        ) : data ? (
          <DashboardContent 
            data={data} 
            contextName={getContextName()} 
            isMockData={isUsingMockData}
            isCachedData={isUsingCachedData}
            onRefresh={handleForceRefresh}
          />
        ) : null}
      </div>
    </SidebarWrapper>
  );
}
