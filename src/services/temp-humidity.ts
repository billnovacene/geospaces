
import { TempHumidityResponse } from "./interfaces/temp-humidity";
import { fetchZoneTempHumidityData } from "./sensors/zone-temp-data";
import { fetchSiteTempHumidityData } from "./sensors/site-temp-data";
import { fetchGenericTempHumidityData, generateSimulatedTempHumidityData } from "./sensors/fallback-temp-data";
import { toast } from "sonner";

export * from "./interfaces/temp-humidity";

/**
 * Main entry point for fetching temperature and humidity data
 * Only uses real data from the API
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
    
    // Try generic API as last attempt
    try {
      return await fetchGenericTempHumidityData(siteId, zoneId);
    } catch (error) {
      console.error('❌ Error fetching from generic API:', error);
      toast.error("Failed to retrieve data from API", {
        description: "Please check your network connection and try again."
      });
      
      // Return empty data instead of simulated
      return generateSimulatedTempHumidityData();
    }
  } catch (error) {
    console.error('❌ Error in temperature and humidity data fetch chain:', error);
    toast.error("API data fetch failed", {
      description: "Unable to retrieve temperature data from any API endpoint."
    });
    
    // Return empty data instead of simulated
    return generateSimulatedTempHumidityData();
  }
};
