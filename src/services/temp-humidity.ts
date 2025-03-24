
import { TempHumidityResponse } from "./interfaces/temp-humidity";
import { TEMP_SENSORS, HUMIDITY_SENSORS } from "./sensors/sensor-maps";
import { fetchRealDeviceData } from "./sensors/device-data";
import { generateMockData } from "./sensors/stats";
import { findZoneSensors } from "./sensors/zone-sensors";
import { fetchZone } from "./zones";

export * from "./interfaces/temp-humidity";

export const fetchTempHumidityData = async (siteId?: string, zoneId?: string): Promise<TempHumidityResponse> => {
  try {
    // For zone-specific data
    if (zoneId) {
      console.log(`Fetching temperature data for zone ${zoneId}`);
      
      // Get zone data to find its site
      const zoneData = await fetchZone(Number(zoneId));
      if (!zoneData || !zoneData.siteId) {
        throw new Error(`Cannot fetch zone ${zoneId} or its site ID is missing`);
      }
      
      // Find temperature and humidity sensors in this zone
      const zoneSensors = await findZoneSensors(Number(zoneId), zoneData.siteId);
      
      if (zoneSensors.temperature.length > 0 || zoneSensors.humidity.length > 0) {
        console.log(`Using zone sensors for zone ${zoneId}:`, zoneSensors);
        return await fetchRealDeviceData(
          zoneData.siteId.toString(),
          zoneSensors.temperature,
          zoneSensors.humidity
        );
      } else {
        console.log(`No temperature or humidity sensors found in zone ${zoneId}, falling back to site sensors`);
        siteId = zoneData.siteId.toString();
      }
    }
    
    // Handle site-specific data fetch
    if (siteId && TEMP_SENSORS[siteId]) {
      console.log(`Fetching real temperature data for site ${siteId}`);
      return await fetchRealDeviceData(
        siteId, 
        TEMP_SENSORS[siteId] || [],
        HUMIDITY_SENSORS[siteId] || []
      );
    }
    
    // For zones or sites without known sensors, construct the API endpoint 
    // based on the provided site or zone ID
    let endpoint = '/sensors/temperature-humidity';
    
    if (zoneId) {
      endpoint += `/zone/${zoneId}`;
    } else if (siteId) {
      endpoint += `/site/${siteId}`;
    }
    
    // Make the actual API request via the apiRequest utility
    const response = await fetch(endpoint);
    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }
    const data = await response.json();
    console.log('API response:', data);
    return data;
  } catch (error) {
    console.error('Error fetching temperature and humidity data:', error);
    
    // If the API request fails, fall back to the mock data
    console.warn('Falling back to mock temperature and humidity data');
    return generateMockData();
  }
};
