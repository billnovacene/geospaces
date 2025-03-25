
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchTempHumidityData } from "@/services/temp-humidity";
import { useParams } from "react-router-dom";
import { toast } from "sonner";

export function useTempHumidityData() {
  const { siteId, zoneId } = useParams<{ siteId: string; zoneId: string }>();
  const [isUsingMockData, setIsUsingMockData] = useState(false);
  const [loadingStage, setLoadingStage] = useState<'initial' | 'daily' | 'stats' | 'monthly' | 'complete'>('initial');
  
  console.log("🔍 useTempHumidityData: Route params:", { siteId, zoneId });
  
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["temp-humidity-data", siteId, zoneId],
    queryFn: () => {
      console.log("🔄 Starting data fetch process...");
      return fetchTempHumidityData(siteId, zoneId);
    },
  });

  // Staged loading effect
  useEffect(() => {
    if (isLoading) {
      setLoadingStage('initial');
      return;
    }
    
    if (data) {
      // Simulate staged loading for better UX
      const stageSequence = async () => {
        setLoadingStage('daily');
        await new Promise(resolve => setTimeout(resolve, 500)); // Short delay
        
        setLoadingStage('stats');
        await new Promise(resolve => setTimeout(resolve, 700)); // Slightly longer delay
        
        setLoadingStage('monthly');
        await new Promise(resolve => setTimeout(resolve, 1000)); // Longer delay for monthly data
        
        setLoadingStage('complete');
      };
      
      stageSequence();
    }
  }, [isLoading, data]);

  // Check if using mock data
  useEffect(() => {
    if (data) {
      const usingMockData = !data?.sourceData?.temperatureSensors?.length && 
                          !data?.sourceData?.humiditySensors?.length;
      setIsUsingMockData(usingMockData);
      
      console.log(`📊 Data source: ${usingMockData ? "SIMULATED" : "REAL API"} data`);
      console.log("📡 Sensors:", {
        temperature: data?.sourceData?.temperatureSensors || [],
        humidity: data?.sourceData?.humiditySensors || []
      });
    }
    
    if (error) {
      console.error("❌ Error fetching temperature data:", error);
    }
  }, [data, error]);

  // Setup auto-refresh interval
  useEffect(() => {
    const liveDataInterval = setInterval(() => {
      console.log("🔄 Refreshing temperature data...");
      refetch();
    }, 30000);
    
    return () => clearInterval(liveDataInterval);
  }, [refetch]);

  // Show toast on data load
  useEffect(() => {
    if (data) {
      console.log("✅ Temperature and humidity data loaded:", {
        statsAvailable: !!data.stats,
        dailyDataPoints: data.daily?.length,
        monthlyDataPoints: data.monthly?.length,
        operatingHours: data.operatingHours
      });
      
      if (siteId) {
        console.log(`📍 For site: ${siteId}`);
      }
      
      if (zoneId) {
        console.log(`🏢 For zone: ${zoneId}`);
      }
      
      const contextType = zoneId ? "zone" : (siteId ? "site" : "dashboard");
      toast.success(`Temperature data loaded for ${contextType}`, {
        id: "temp-data-loaded",
        duration: 2000,
      });
    }
  }, [data, siteId, zoneId]);

  return { data, isLoading, error, isUsingMockData, loadingStage, refetch };
}
