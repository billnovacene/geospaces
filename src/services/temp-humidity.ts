
import { TempHumidityResponse } from "./interfaces/temp-humidity";
import { TEMP_SENSORS, HUMIDITY_SENSORS, SITE_SENSOR_DETAILS } from "./sensors/sensor-maps";
import { fetchRealDeviceData } from "./sensors/device-data";
import { generateMockData } from "./sensors/stats";
import { findZoneSensors } from "./sensors/zone-sensors";
import { fetchZone } from "./zones";
import { fetchSite } from "./sites";

export * from "./interfaces/temp-humidity";

export const fetchTempHumidityData = async (siteId?: string, zoneId?: string): Promise<TempHumidityResponse> => {
  try {
    console.log(`📊 Fetch temperature data initiated for ${zoneId ? `zone ${zoneId}` : siteId ? `site ${siteId}` : 'all locations'}`);
    
    let effectiveSiteId = siteId;
    let operatingHours = null;
    
    // For zone-specific data
    if (zoneId) {
      console.log(`🔍 Fetching temperature data for zone ${zoneId}`);
      
      // Get zone data to find its site
      const zoneData = await fetchZone(Number(zoneId));
      if (!zoneData || !zoneData.siteId) {
        throw new Error(`Cannot fetch zone ${zoneId} or its site ID is missing`);
      }
      
      effectiveSiteId = zoneData.siteId.toString();
      console.log(`📍 Zone ${zoneId} belongs to site ${effectiveSiteId}`);
      
      // Get operating hours from site
      const siteData = await fetchSite(zoneData.siteId);
      if (siteData?.fields) {
        operatingHours = extractOperatingHours(siteData);
        console.log("⏰ Operating hours for zone data:", operatingHours);
      }
      
      // Find temperature and humidity sensors in this zone
      const zoneSensors = await findZoneSensors(Number(zoneId), zoneData.siteId);
      
      console.log(`Found zone sensors:`, {
        temperature: zoneSensors.temperature?.length || 0,
        humidity: zoneSensors.humidity?.length || 0
      });
      
      // This is the fix: Check if we actually have sensors for this zone
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
            console.warn(`No valid data found in real device response for zone ${zoneId}`);
          }
        } catch (error) {
          console.error(`Error fetching real device data for zone ${zoneId}:`, error);
        }
      } else {
        console.log(`⚠️ No temperature or humidity sensors found in zone ${zoneId}, falling back to site sensors`);
      }
    }
    
    // Handle site-specific data fetch
    if (effectiveSiteId && TEMP_SENSORS[effectiveSiteId]) {
      console.log(`🌡️ Fetching REAL temperature data for site ${effectiveSiteId}`);
      
      // Get operating hours from site if not already set
      if (!operatingHours) {
        const siteData = await fetchSite(Number(effectiveSiteId));
        if (siteData?.fields) {
          operatingHours = extractOperatingHours(siteData);
          console.log("⏰ Operating hours for site data:", operatingHours);
        }
      }
      
      const tempSensors = TEMP_SENSORS[effectiveSiteId] || [];
      const humSensors = HUMIDITY_SENSORS[effectiveSiteId] || [];
      
      console.log(`📡 Sensors for site ${effectiveSiteId}:`, {
        temperature: tempSensors,
        humidity: humSensors
      });
      
      if (tempSensors.length > 0 || humSensors.length > 0) {
        try {
          const response = await fetchRealDeviceData(
            effectiveSiteId, 
            tempSensors,
            humSensors,
            operatingHours
          );
          
          // Count real data points
          const realDataPoints = response.daily.filter(point => point.isReal?.temperature === true).length;
          console.log(`Found ${realDataPoints}/${response.daily.length} real data points for site ${effectiveSiteId}`);
          
          // Add site sensor information
          return {
            ...response,
            sourceData: SITE_SENSOR_DETAILS[effectiveSiteId] || {
              temperatureSensors: [],
              humiditySensors: []
            },
            operatingHours
          };
        } catch (error) {
          console.error(`Error fetching real device data for site ${effectiveSiteId}:`, error);
        }
      }
    }
    
    // For zones or sites without known sensors, construct the API endpoint 
    // based on the provided site or zone ID
    let endpoint = '/sensors/temperature-humidity';
    
    if (zoneId) {
      endpoint += `/zone/${zoneId}`;
    } else if (siteId) {
      endpoint += `/site/${siteId}`;
    }
    
    console.log(`🔄 Falling back to generic API endpoint: ${endpoint}`);
    
    // Make the actual API request via the apiRequest utility
    const response = await fetch(endpoint);
    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }
    const data = await response.json();
    console.log('✅ API response:', data);
    return data;
  } catch (error) {
    console.error('❌ Error fetching temperature and humidity data:', error);
    
    // If the API request fails, fall back to the mock data
    console.warn('⚠️ Falling back to SIMULATED temperature and humidity data');
    const mockData = generateMockData();
    return {
      ...mockData,
      sourceData: {
        temperatureSensors: [],
        humiditySensors: []
      }
    };
  }
};

// Helper function to extract operating hours from site data
function extractOperatingHours(site: any): { startTime: string; endTime: string } | null {
  if (!site.fields) return null;
  
  // Find the first field with energyCalculationField that has operating hours
  const fieldWithHours = site.fields.find(
    (field: any) => field.energyCalculationField && 
    field.energyCalculationField.operatingHoursStartTime && 
    field.energyCalculationField.operatingHoursEndTime
  );
  
  if (fieldWithHours?.energyCalculationField) {
    return {
      startTime: fieldWithHours.energyCalculationField.operatingHoursStartTime,
      endTime: fieldWithHours.energyCalculationField.operatingHoursEndTime
    };
  }
  
  return null;
}
