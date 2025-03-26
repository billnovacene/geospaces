import { useEffect, useRef, useState } from 'react';

// Utility to check if data is using mock data
export function checkIfMockData(data: any, addLog: (message: string, type: string) => void) {
  if (!data) return false;
  
  // Check if we have real sensor data
  const hasTempSensors = data?.sourceData?.temperatureSensors?.length > 0;
  const hasHumiditySensors = data?.sourceData?.humiditySensors?.length > 0;
  const hasRealDataPoints = data.daily?.some((point: any) => point.isReal?.temperature === true);
  
  // If we have sensors but no real data points, log warning
  if ((hasTempSensors || hasHumiditySensors) && !hasRealDataPoints) {
    console.warn('⚠️ Sensors available but no real data points found!');
    addLog('Sensors available but no real data points found', 'warning');
  }
  
  // Only mark as using mock data if we have NO sensors AND no real data points
  const usingMockData = !hasTempSensors && !hasHumiditySensors;
  
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
  
  return usingMockData;
}

// Hook to manage logging parameters only once
export function useLogParamsOnce(
  siteId: string | undefined, 
  zoneId: string | undefined, 
  props: any,
  addLog: (message: string, type: string) => void
) {
  const paramsLoggedRef = useRef(false);
  
  // Reset params logged ref when IDs change
  useEffect(() => {
    paramsLoggedRef.current = false;
    console.log(`🔄 useTempHumidityData: IDs changed, resetting paramsLoggedRef`);
  }, [siteId, zoneId]);
  
  // Log params only once on component mount, not on every render
  useEffect(() => {
    if (!paramsLoggedRef.current) {
      addLog(`Dashboard initialized for ${zoneId ? `zone ${zoneId}` : siteId ? `site ${siteId}` : 'all locations'}`, 'info');
      addLog(`Using params: siteId=${siteId || 'undefined'}, zoneId=${zoneId || 'undefined'}`, 'info');
      
      console.log("🔍 useTempHumidityData: Using params:", { siteId, zoneId });
      console.log("🔍 Props or route params:", { 
        forceSiteId: props?.forceSiteId, 
        forceZoneId: props?.forceZoneId
      });
      
      paramsLoggedRef.current = true;
    }
  }, [addLog, siteId, zoneId, props]);
}

// Hook to simulate staged loading
export function useStagedLoading(isLoading: boolean, data: any, addLog: (message: string, type: string) => void) {
  const [loadingStage, setLoadingStage] = useState<'initial' | 'daily' | 'stats' | 'monthly' | 'complete'>('initial');

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
  
  return loadingStage;
}
