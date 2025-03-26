
import { TempHumidityResponse } from "../interfaces/temp-humidity";
import { toast } from "sonner";
import { API_BASE_URL } from "../api-client";
import { generateMockData } from "./mock-data-generator";

/**
 * Attempt to fetch temperature data from a generic API endpoint
 */
export async function fetchGenericTempHumidityData(siteId?: string, zoneId?: string): Promise<TempHumidityResponse> {
  try {
    // For zones or sites without known sensors, construct the API endpoint 
    // based on the provided site or zone ID
    let endpoint = '/temperature-humidity';
    
    if (zoneId) {
      endpoint += `/zone/${zoneId}`;
    } else if (siteId) {
      endpoint += `/site/${siteId}`;
    }
    
    console.log(`🔄 Attempting generic API endpoint: ${API_BASE_URL}${endpoint}`);
    
    // Make the actual API request with proper base URL
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: {
        'accept': 'application/json'
      }
    });
    
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
 * Generate simulated data when no real data is available
 * Instead of returning empty data, we now return mock data
 */
export function generateSimulatedTempHumidityData(): TempHumidityResponse {
  console.warn('⚠️ No real temperature data available from API, generating simulated data');
  toast.info("Using simulated temperature data", {
    description: "The system could not retrieve data from the API and is showing simulated data instead."
  });
  
  // Return simulated data
  return generateMockData();
}
