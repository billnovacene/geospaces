
import { TempHumidityResponse } from "../interfaces/temp-humidity";
import { toast } from "sonner";
import { API_BASE_URL } from "../api-client";

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
 * Return empty data when no real data is available
 * No longer generates simulated data
 */
export function generateSimulatedTempHumidityData(): TempHumidityResponse {
  console.error('⚠️ No real temperature data available from API');
  toast.error("No real temperature data available", {
    description: "The system could not retrieve data from the API."
  });
  
  // Return empty data structure with no simulated values
  return {
    stats: {
      avgTemp: 0,
      minTemp: 0,
      maxTemp: 0,
      avgHumidity: 0,
      status: {
        avgTemp: 'good',
        minTemp: 'good',
        maxTemp: 'good',
        avgHumidity: 'good'
      }
    },
    daily: [],
    monthly: [],
    sourceData: {
      temperatureSensors: [],
      humiditySensors: []
    }
  };
}
