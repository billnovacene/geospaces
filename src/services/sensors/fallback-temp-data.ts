
import { TempHumidityResponse } from "../interfaces/temp-humidity";
import { generateMockData } from "./mock-data-generator";

/**
 * Attempt to fetch temperature data from a generic API endpoint
 */
export async function fetchGenericTempHumidityData(siteId?: string, zoneId?: string): Promise<TempHumidityResponse> {
  try {
    // For zones or sites without known sensors, construct the API endpoint 
    // based on the provided site or zone ID
    let endpoint = '/sensors/temperature-humidity';
    
    if (zoneId) {
      endpoint += `/zone/${zoneId}`;
    } else if (siteId) {
      endpoint += `/site/${siteId}`;
    }
    
    console.log(`🔄 Attempting generic API endpoint: ${endpoint}`);
    
    // Make the actual API request
    const response = await fetch(endpoint);
    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }
    const data = await response.json();
    console.log('✅ API response:', data);
    return data;
  } catch (error) {
    throw error; // Let the caller handle this
  }
}

/**
 * Generate simulated data when all other methods fail
 */
export function generateSimulatedTempHumidityData(): TempHumidityResponse {
  console.warn('⚠️ Falling back to SIMULATED temperature and humidity data');
  return generateMockData();
}
