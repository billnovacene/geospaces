
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
    queryFn: async () => {
      console.log("🔄 Starting data fetch process for zone/site:", { zoneId, siteId });
      // Pass both siteId and zoneId to the API
      return fetchTempHumidityData(siteId, zoneId);
    },
    refetchOnWindowFocus: false,
    refetchInterval: 60000, // Refresh every minute
    retry: 2,
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
        await new Promise(resolve => setTimeout(resolve, 300)); // Short delay
        
        setLoadingStage('stats');
        await new Promise(resolve => setTimeout(resolve, 400)); // Slightly longer delay
        
        setLoadingStage('monthly');
        await new Promise(resolve => setTimeout(resolve, 500)); // Longer delay for monthly data
        
        setLoadingStage('complete');
      };
      
      stageSequence();
    }
  }, [isLoading, data]);

  // Check if using mock data
  useEffect(() => {
    if (data) {
      // Check if we have real sensor data
      const hasTempSensors = data?.sourceData?.temperatureSensors?.length > 0;
      const hasHumiditySensors = data?.sourceData?.humiditySensors?.length > 0;
      const hasRealDataPoints = data.daily?.some(point => point.isReal?.temperature === true);
      
      // If we have sensors but no real data points, log warning
      if ((hasTempSensors || hasHumiditySensors) && !hasRealDataPoints) {
        console.warn('⚠️ Sensors available but no real data points found!');
      }
      
      // Only mark as using mock data if we have NO sensors AND no real data points
      const usingMockData = !hasTempSensors && !hasHumiditySensors;
      setIsUsingMockData(usingMockData);
      
      console.log(`📊 Data source: ${usingMockData ? "SIMULATED" : "REAL API"} data, has real data points: ${hasRealDataPoints}`);
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
      const realDataPoints = data.daily?.filter(point => point.isReal?.temperature === true).length || 0;
      const totalDataPoints = data.daily?.length || 0;
      const realDataPercentage = totalDataPoints > 0 ? (realDataPoints / totalDataPoints * 100).toFixed(1) : "0";
      
      console.log("✅ Temperature and humidity data loaded:", {
        statsAvailable: !!data.stats,
        dailyDataPoints: data.daily?.length,
        monthlyDataPoints: data.monthly?.length,
        realDataPoints,
        realDataPercentage: `${realDataPercentage}%`,
        operatingHours: data.operatingHours
      });
      
      if (zoneId) {
        console.log(`📍 For zone: ${zoneId}`);
      } else if (siteId) {
        console.log(`📍 For site: ${siteId}`);
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
