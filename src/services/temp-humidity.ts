
import { TempHumidityResponse } from "./interfaces/temp-humidity";
import { TEMP_SENSORS, HUMIDITY_SENSORS, SITE_SENSOR_DETAILS } from "./sensors/sensor-maps";
import { fetchRealDeviceData } from "./sensors/device-data";
import { generateMockData } from "./sensors/stats";
import { findZoneSensors } from "./sensors/zone-sensors";
import { fetchZone } from "./zones";
import { getCachedTempHumidityData, cacheTempHumidityData } from "./cache/temp-humidity-cache";

export * from "./interfaces/temp-humidity";

export const fetchTempHumidityData = async (siteId?: string, zoneId?: string): Promise<TempHumidityResponse> => {
  try {
    // Check if we have cached data first
    const cachedData = getCachedTempHumidityData(siteId, zoneId);
    if (cachedData) {
      return cachedData;
    }
    
    console.log(`🔄 No cache found, fetching fresh temperature data for ${zoneId ? `zone ${zoneId}` : siteId ? `site ${siteId}` : 'all locations'}`);
    
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
        console.log(`Using REAL zone sensors for zone ${zoneId}:`, zoneSensors);
        const response = await fetchRealDeviceData(
          zoneData.siteId.toString(),
          zoneSensors.temperature,
          zoneSensors.humidity
        );
        
        // Add source information to the response
        const data = {
          ...response,
          sourceData: {
            temperatureSensors: zoneSensors.temperatureSensors,
            humiditySensors: zoneSensors.humiditySensors
          }
        };
        
        // Cache the data
        cacheTempHumidityData(data, siteId, zoneId);
        return data;
      } else {
        console.log(`No temperature or humidity sensors found in zone ${zoneId}, falling back to site sensors`);
        siteId = zoneData.siteId.toString();
      }
    }
    
    // Handle site-specific data fetch
    if (siteId && TEMP_SENSORS[siteId]) {
      console.log(`Fetching REAL temperature data for site ${siteId}`);
      const response = await fetchRealDeviceData(
        siteId, 
        TEMP_SENSORS[siteId] || [],
        HUMIDITY_SENSORS[siteId] || []
      );
      
      // Add site sensor information
      const data = {
        ...response,
        sourceData: SITE_SENSOR_DETAILS[siteId] || {
          temperatureSensors: [],
          humiditySensors: []
        }
      };
      
      // Cache the data
      cacheTempHumidityData(data, siteId, zoneId);
      return data;
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
    
    // Cache the data
    cacheTempHumidityData(data, siteId, zoneId);
    return data;
  } catch (error) {
    console.error('Error fetching temperature and humidity data:', error);
    
    // If the API request fails, fall back to the mock data
    console.warn('⚠️ Falling back to SIMULATED temperature and humidity data');
    const mockData = generateMockData();
    const data = {
      ...mockData,
      sourceData: {
        temperatureSensors: [],
        humiditySensors: []
      }
    };
    
    // We still cache mock data but with a shorter expiration (5 minutes)
    cacheTempHumidityData(data, siteId, zoneId, 5 * 60 * 1000);
    return data;
  }
};
