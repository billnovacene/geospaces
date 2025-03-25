
import { useState, useEffect, useCallback, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchTempHumidityData } from "@/services/temp-humidity";
import { useParams } from "react-router-dom";
import { toast } from "sonner";

interface LogItem {
  message: string;
  timestamp: string;
  type: 'info' | 'error' | 'warning' | 'success' | 'api';
}

export function useTempHumidityData() {
  const { siteId, zoneId } = useParams<{ siteId: string; zoneId: string }>();
  const [isUsingMockData, setIsUsingMockData] = useState(false);
  const [loadingStage, setLoadingStage] = useState<'initial' | 'daily' | 'stats' | 'monthly' | 'complete'>('initial');
  const [apiConnectionFailed, setApiConnectionFailed] = useState(false);
  const [logs, setLogs] = useState<LogItem[]>([]);
  const paramsLoggedRef = useRef(false); // Use ref to track if params logged
  
  // Function to add logs
  const addLog = useCallback((message: string, type: LogItem['type'] = 'info') => {
    const timestamp = new Date().toISOString().split('T')[1].substring(0, 12);
    setLogs(prevLogs => [...prevLogs, { message, timestamp, type }]);
  }, []);
  
  // Clear logs
  const clearLogs = useCallback(() => {
    setLogs([]);
  }, []);
  
  // Log params only once on component mount, not on every render
  useEffect(() => {
    if (!paramsLoggedRef.current) {
      addLog(`Dashboard initialized for ${zoneId ? `zone ${zoneId}` : siteId ? `site ${siteId}` : 'all locations'}`, 'info');
      addLog(`Route params: siteId=${siteId || 'undefined'}, zoneId=${zoneId || 'undefined'}`, 'info');
      console.log("🔍 useTempHumidityData: Route params:", { siteId, zoneId });
      paramsLoggedRef.current = true;
    }
  }, [addLog, siteId, zoneId]);
  
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["temp-humidity-data", siteId, zoneId],
    queryFn: async () => {
      addLog(`Starting data fetch process for ${zoneId ? `zone ${zoneId}` : siteId ? `site ${siteId}` : 'all locations'}`, 'api');
      console.log("🔄 Starting data fetch process for zone/site:", { zoneId, siteId });
      try {
        // Pass both siteId and zoneId to the API
        const result = await fetchTempHumidityData(siteId, zoneId);
        setApiConnectionFailed(false);
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
        addLog('Processing daily data...', 'info');
        await new Promise(resolve => setTimeout(resolve, 300)); // Short delay
        
        setLoadingStage('stats');
        addLog('Calculating temperature statistics...', 'info');
        await new Promise(resolve => setTimeout(resolve, 400)); // Slightly longer delay
        
        setLoadingStage('monthly');
        addLog('Processing monthly trends...', 'info');
        await new Promise(resolve => setTimeout(resolve, 500)); // Longer delay for monthly data
        
        setLoadingStage('complete');
        addLog('Dashboard data loading complete', 'success');
      };
      
      stageSequence();
    }
  }, [isLoading, data, addLog]);

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
        addLog('Sensors available but no real data points found', 'warning');
      }
      
      // Only mark as using mock data if we have NO sensors AND no real data points
      const usingMockData = !hasTempSensors && !hasHumiditySensors;
      setIsUsingMockData(usingMockData);
      
      if (usingMockData) {
        addLog('Using simulated data - no real sensors found', 'warning');
      } else if (hasRealDataPoints) {
        addLog('Using real sensor data from API', 'success');
      } else {
        addLog('Using historical API data - no real-time readings available', 'info');
      }
      
      console.log(`📊 Data source: ${usingMockData ? "SIMULATED" : "REAL API"} data, has real data points: ${hasRealDataPoints}`);
      console.log("📡 Sensors:", {
        temperature: data?.sourceData?.temperatureSensors || [],
        humidity: data?.sourceData?.humiditySensors || []
      });
    }
    
    if (error) {
      console.error("❌ Error fetching temperature data:", error);
      addLog(`Error fetching data: ${error instanceof Error ? error.message : 'Unknown error'}`, 'error');
      setApiConnectionFailed(true);
    }
  }, [data, error, addLog]);

  // Setup auto-refresh interval
  useEffect(() => {
    const liveDataInterval = setInterval(() => {
      console.log("🔄 Refreshing temperature data...");
      addLog('Auto-refreshing temperature data...', 'info');
      refetch();
    }, 30000);
    
    return () => clearInterval(liveDataInterval);
  }, [refetch, addLog]);

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
      
      if (realDataPoints > 0) {
        toast.success(`Real temperature data loaded for ${contextType}`, {
          id: "temp-data-loaded",
          duration: 2000,
        });
      } else {
        toast.warning(`No real-time data available for ${contextType}`, {
          id: "temp-data-loaded",
          duration: 3000,
          description: "Using historical API data only"
        });
      }
    }
  }, [data, siteId, zoneId, addLog]);

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
