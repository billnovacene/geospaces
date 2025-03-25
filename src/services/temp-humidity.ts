
import { TempHumidityResponse } from "./interfaces/temp-humidity";
import { fetchZoneTempHumidityData } from "./sensors/zone-temp-data";
import { fetchSiteTempHumidityData } from "./sensors/site-temp-data";
import { fetchGenericTempHumidityData, generateSimulatedTempHumidityData } from "./sensors/fallback-temp-data";

export * from "./interfaces/temp-humidity";

/**
 * Main entry point for fetching temperature and humidity data
 * Tries different data sources in order of preference:
 * 1. Zone-specific sensors (if zone ID provided)
 * 2. Site-specific sensors
 * 3. Generic API endpoints
 * 4. Simulated data as a last resort
 */
export const fetchTempHumidityData = async (siteId?: string, zoneId?: string): Promise<TempHumidityResponse> => {
  try {
    console.log(`📊 Fetch temperature data initiated for ${zoneId ? `zone ${zoneId}` : siteId ? `site ${siteId}` : 'all locations'}`);
    
    // For zone-specific data
    if (zoneId) {
      const zoneData = await fetchZoneTempHumidityData(zoneId);
      if (zoneData) {
        return zoneData;
      }
      // If zone-specific data fetch fails, site ID would have been retrieved,
      // so we'll continue to try site-specific data
    }
    
    // Handle site-specific data fetch
    if (siteId) {
      const siteData = await fetchSiteTempHumidityData(siteId);
      if (siteData) {
        return siteData;
      }
    }
    
    // Try generic API as fallback
    try {
      return await fetchGenericTempHumidityData(siteId, zoneId);
    } catch (error) {
      console.error('❌ Error fetching from generic API:', error);
      // Fall through to simulated data
    }
    
    // If all else fails, return simulated data
    return generateSimulatedTempHumidityData();
  } catch (error) {
    console.error('❌ Error in temperature and humidity data fetch chain:', error);
    
    // Final fallback is always simulated data
    return generateSimulatedTempHumidityData();
  }
};
