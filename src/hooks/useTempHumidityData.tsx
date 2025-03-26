
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchTempHumidityData } from "@/services/temp-humidity";
import { useParams } from "react-router-dom";
import { toast } from "sonner";
import { TempHumidityHookProps } from "./temperature/types";
import { useTemperatureLogs } from "./temperature/useTemperatureLogs";
import { 
  checkIfMockData, 
  useLogParamsOnce, 
  useStagedLoading 
} from "./temperature/temperatureUtils";

export function useTempHumidityData(props?: TempHumidityHookProps) {
  const { siteId: routeSiteId, zoneId: routeZoneId } = useParams<{ siteId: string; zoneId: string }>();
  
  // Use forced IDs from props if provided, otherwise use route params
  const siteId = props?.forceSiteId || routeSiteId;
  const zoneId = props?.forceZoneId || routeZoneId;
  
  const [isUsingMockData, setIsUsingMockData] = useState(false);
  const [apiConnectionFailed, setApiConnectionFailed] = useState(false);
  
  // Use our custom logging hook
  const { logs, addLog, clearLogs } = useTemperatureLogs();
  
  // Log parameters only once using our custom hook
  useLogParamsOnce(siteId, zoneId, props, addLog);
  
  // Create a query key that depends on both siteId and zoneId
  const queryKey = ["temp-humidity-data", siteId, zoneId];
  
  // Log the query key to debug
  console.log("🔑 Using query key:", queryKey);
  
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: queryKey,
    queryFn: async () => {
      addLog(`Starting data fetch process for ${zoneId ? `zone ${zoneId}` : siteId ? `site ${siteId}` : 'all locations'}`, 'api');
      console.log("🔄 Starting data fetch process for zone/site:", { zoneId, siteId });
      try {
        setApiConnectionFailed(false);
        // Pass both siteId and zoneId to the API
        const result = await fetchTempHumidityData(siteId, zoneId);
        addLog(`API fetch successful: ${result.daily?.length || 0} daily points, ${result.monthly?.length || 0} monthly points`, 'success');
        
        // Log details about the data
        if (result) {
          const realDataPoints = result.daily?.filter(point => point.isReal?.temperature === true).length || 0;
          const totalDataPoints = result.daily?.length || 0;
          const realDataPercentage = totalDataPoints > 0 ? (realDataPoints / totalDataPoints * 100).toFixed(1) : "0";
          
          addLog(`Data quality: ${realDataPoints}/${totalDataPoints} points (${realDataPercentage}%) are real sensor data`, 'info');
          
          if (result.sourceData) {
            addLog(`Found ${result.sourceData.temperatureSensors.length} temperature sensors and ${result.sourceData.humiditySensors.length} humidity sensors`, 'info');
            
            // Log sensors details
            result.sourceData.temperatureSensors.forEach(sensor => {
              addLog(`Temperature sensor: ${sensor.name} (${sensor.id}) from device ${sensor.deviceName}`, 'info');
            });
            
            result.sourceData.humiditySensors.forEach(sensor => {
              addLog(`Humidity sensor: ${sensor.name} (${sensor.id}) from device ${sensor.deviceName}`, 'info');
            });
          }
          
          if (result.operatingHours) {
            addLog(`Operating hours: ${result.operatingHours.startTime} to ${result.operatingHours.endTime}`, 'info');
          }
        }
        
        return result;
      } catch (err) {
        console.error("❌ API connection failed:", err);
        addLog(`API connection failed: ${err instanceof Error ? err.message : 'Unknown error'}`, 'error');
        setApiConnectionFailed(true);
        throw err;
      }
    },
    refetchOnWindowFocus: false,
    refetchInterval: 60000, // Refresh every minute
    retry: 2,
  });

  // Use our custom staged loading hook
  const loadingStage = useStagedLoading(isLoading, data, addLog);

  // Check if using mock data
  useEffect(() => {
    if (data) {
      const usingMockData = checkIfMockData(data, addLog);
      setIsUsingMockData(usingMockData);
    }
    
    if (error) {
      console.error("❌ Error fetching temperature data:", error);
      addLog(`Error fetching data: ${error instanceof Error ? error.message : 'Unknown error'}`, 'error');
      setApiConnectionFailed(true);
    }
  }, [data, error, addLog]);

  return { 
    data, 
    isLoading, 
    error, 
    isUsingMockData, 
    loadingStage, 
    refetch,
    apiConnectionFailed,
    logs,
    clearLogs
  };
}
