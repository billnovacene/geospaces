
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchTempHumidityData } from "@/services/temp-humidity";
import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { clearTempHumidityCache } from "@/services/cache/temp-humidity-cache";
import { toast } from "sonner";

export function useTempHumidityData() {
  const { siteId, zoneId } = useParams<{ siteId: string; zoneId: string }>();
  const [isUsingMockData, setIsUsingMockData] = useState(false);
  const [isUsingCachedData, setIsUsingCachedData] = useState(false);
  const queryClient = useQueryClient();
  
  console.log("useTempHumidityData: Route params:", { siteId, zoneId });
  
  const { 
    data, 
    isLoading, 
    error, 
    refetch, 
    dataUpdatedAt 
  } = useQuery({
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

  // Handle data source detection
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
  }, [data, error, dataUpdatedAt, isUsingCachedData]);

  // Auto-refresh data
  useEffect(() => {
    const liveDataInterval = setInterval(() => {
      refetch();
    }, 30000);
    
    return () => clearInterval(liveDataInterval);
  }, [refetch]);

  return {
    data,
    isLoading,
    error,
    isUsingMockData,
    isUsingCachedData,
    handleForceRefresh,
    siteId,
    zoneId
  };
}
