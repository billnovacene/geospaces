
import { TempHumidityResponse } from "../interfaces/temp-humidity";
import { fetchSite } from "../sites";
import { fetchRealDeviceData } from "./device-data";
import { TEMP_SENSORS, HUMIDITY_SENSORS, SITE_SENSOR_DETAILS } from "./sensor-maps";
import { extractOperatingHours } from "./operating-hours";

/**
 * Fetches temperature and humidity data for a specific site
 */
export async function fetchSiteTempHumidityData(siteId: string): Promise<TempHumidityResponse | null> {
  console.log(`🌡️ Fetching REAL temperature data for site ${siteId}`);
  
  try {
    // Get site data and operating hours
    const siteData = await fetchSite(Number(siteId));
    let operatingHours = null;
    if (siteData?.fields) {
      operatingHours = extractOperatingHours(siteData);
      console.log("⏰ Operating hours for site data:", operatingHours);
    }
    
    // Get known sensors for this site
    const tempSensors = TEMP_SENSORS[siteId] || [];
    const humSensors = HUMIDITY_SENSORS[siteId] || [];
    
    console.log(`📡 Sensors for site ${siteId}:`, {
      temperature: tempSensors,
      humidity: humSensors
    });
    
    if (tempSensors.length > 0 || humSensors.length > 0) {
      try {
        const response = await fetchRealDeviceData(
          siteId, 
          tempSensors,
          humSensors,
          operatingHours
        );
        
        // Count real data points
        const realDataPoints = response.daily.filter(point => point.isReal?.temperature === true).length;
        console.log(`Found ${realDataPoints}/${response.daily.length} real data points for site ${siteId}`);
        
        if (realDataPoints > 0) {
          console.log(`✅ Successfully found real data for site ${siteId}`);
          
          // Add site sensor information
          return {
            ...response,
            sourceData: SITE_SENSOR_DETAILS[siteId] || {
              temperatureSensors: [],
              humiditySensors: []
            },
            operatingHours
          };
        } else {
          console.warn(`No real data points found for site ${siteId}, will try fallback`);
        }
      } catch (error) {
        console.error(`Error fetching real device data for site ${siteId}:`, error);
      }
    }
  } catch (error) {
    console.error(`Failed to fetch site temperature data: ${error}`);
  }
  
  return null;
}
