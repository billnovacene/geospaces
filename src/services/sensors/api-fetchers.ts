
/**
 * Functions for fetching sensor data from the API
 */

import { apiRequest } from "../api-client";
import { PointsDataResponse } from "../interfaces/temp-humidity";

/**
 * Fetch temperature data from API
 */
export async function fetchTemperatureData(
  siteId: string, 
  temperatureSensor: string | undefined,
  date: string
): Promise<Array<{timestamp: string, value: number | string}>> {
  if (!temperatureSensor) {
    console.log('No temperature sensor provided, skipping temperature data fetch');
    return [];
  }
  
  const tempEndpoint = `/devices/points-data?siteid=${siteId}&sensor=${temperatureSensor}&start=${date}&end=${date}`;
  try {
    console.log(`Fetching temperature data from API: ${tempEndpoint}`);
    const tempResponse = await apiRequest<PointsDataResponse>(tempEndpoint);
    if (tempResponse.data && tempResponse.data.length > 0 && tempResponse.data[0].pointData) {
      const tempData = tempResponse.data[0].pointData || [];
      console.log(`Received ${tempData.length} temperature data points for day ${date}`);
      return tempData;
    }
  } catch (err) {
    console.warn('Could not fetch temperature data, proceeding with humidity only', err);
  }
  
  return [];
}

/**
 * Fetch humidity data from API
 */
export async function fetchHumidityData(
  siteId: string, 
  humiditySensor: string | undefined,
  date: string
): Promise<Array<{timestamp: string, value: number | string}>> {
  if (!humiditySensor) {
    console.log('No humidity sensor provided, skipping humidity data fetch');
    return [];
  }
  
  const humidityEndpoint = `/devices/points-data?siteid=${siteId}&sensor=${humiditySensor}&start=${date}&end=${date}`;
  try {
    console.log(`Fetching humidity data from API: ${humidityEndpoint}`);
    const humidityResponse = await apiRequest<PointsDataResponse>(humidityEndpoint);
    if (humidityResponse.data && humidityResponse.data.length > 0 && humidityResponse.data[0].pointData) {
      const humidityData = humidityResponse.data[0].pointData || [];
      console.log(`Received ${humidityData.length} humidity data points for day ${date}`);
      return humidityData;
    }
  } catch (err) {
    console.warn('Could not fetch humidity data, proceeding with temperature only', err);
  }
  
  return [];
}

/**
 * Generate simulated daily data 
 */
export function generateSimulatedDailyData() {
  console.warn('Falling back to simulated daily data');
  return Array(24).fill(null).map((_, i) => ({
    time: `${i}:00`,
    temperature: 18 + Math.sin(i / 24 * Math.PI * 2) * 6,
    humidity: 40 + Math.sin((i / 24 * Math.PI * 2) + 1) * 15,
    isReal: {
      temperature: false,
      humidity: false
    }
  }));
}
