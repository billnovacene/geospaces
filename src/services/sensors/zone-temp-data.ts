
import { TempHumidityResponse } from "../interfaces/temp-humidity";
import { fetchZone } from "../zones";
import { fetchSite } from "../sites";
import { findZoneSensors } from "./zone-sensors";
import { fetchRealDeviceData } from "./device-data";
import { extractOperatingHours } from "./operating-hours";

/**
 * Fetches temperature and humidity data for a specific zone
 */
export async function fetchZoneTempHumidityData(zoneId: string): Promise<TempHumidityResponse | null> {
  console.log(`🔍 Fetching temperature data for zone ${zoneId}`);
  
  try {
    // Get zone data to find its site
    const zoneData = await fetchZone(Number(zoneId));
    if (!zoneData || !zoneData.siteId) {
      throw new Error(`Cannot fetch zone ${zoneId} or its site ID is missing`);
    }
    
    const effectiveSiteId = zoneData.siteId.toString();
    console.log(`📍 Zone ${zoneId} belongs to site ${effectiveSiteId}`);
    
    // Get operating hours from site
    const siteData = await fetchSite(zoneData.siteId);
    let operatingHours = null;
    if (siteData?.fields) {
      operatingHours = extractOperatingHours(siteData);
      console.log("⏰ Operating hours for zone data:", operatingHours);
    }
    
    // Find temperature and humidity sensors in this zone
    const zoneSensors = await findZoneSensors(Number(zoneId), zoneData.siteId);
    
    console.log(`Found zone sensors for zone ${zoneId}:`, {
      temperature: zoneSensors.temperature?.length || 0,
      humidity: zoneSensors.humidity?.length || 0,
      sensorIds: {
        temperature: zoneSensors.temperature,
        humidity: zoneSensors.humidity
      }
    });
    
    // Check if we actually have sensors for this zone
    if (zoneSensors.temperature.length > 0 || zoneSensors.humidity.length > 0) {
      console.log(`🌡️ Using REAL zone sensors for zone ${zoneId}:`, zoneSensors);
      
      try {
        const response = await fetchRealDeviceData(
          effectiveSiteId,
          zoneSensors.temperature,
          zoneSensors.humidity,
          operatingHours
        );
        
        // Make sure we have valid data in the response
        if (response && response.daily) {
          // Count real data points
          const realDataPoints = response.daily.filter(point => point.isReal?.temperature === true).length;
          console.log(`Found ${realDataPoints}/${response.daily.length} real data points for zone ${zoneId}`);
          
          if (realDataPoints > 0) {
            console.log(`✅ Successfully found real data for zone ${zoneId}`);
            
            // Add source information to the response
            return {
              ...response,
              sourceData: {
                temperatureSensors: zoneSensors.temperatureSensors,
                humiditySensors: zoneSensors.humiditySensors
              },
              operatingHours
            };
          } else {
            console.warn(`No real data points found for zone ${zoneId} sensors, will try fallback options`);
          }
        } else {
          console.warn(`No valid data found in real device response for zone ${zoneId}`);
        }
      } catch (error) {
        console.error(`Error fetching real device data for zone ${zoneId}:`, error);
      }
    } else {
      console.log(`⚠️ No temperature or humidity sensors found in zone ${zoneId}, checking if subzones have sensors`);
      
      // TODO: In the future, we could add logic here to check subzones for sensors
    }
  } catch (error) {
    console.error(`Failed to fetch zone temperature data: ${error}`);
  }
  
  return null;
}
