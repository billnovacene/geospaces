
import { DailyOverviewPoint } from "../interfaces/temp-humidity";
import { 
  fillMissingDataPoints, 
  processHourlyData, 
  createDailyOverviewPoints 
} from "./data-processing";
import { 
  fetchTemperatureData, 
  fetchHumidityData, 
  generateSimulatedDailyData 
} from "./api-fetchers";

/**
 * Fetch sensor data for a specific day
 */
export async function fetchSensorDataForDay(
  siteId: string, 
  temperatureSensor: string | undefined, 
  humiditySensor: string | undefined,
  date: string
): Promise<DailyOverviewPoint[]> {
  try {
    // Fetch data from API for both sensor types
    const tempData = await fetchTemperatureData(siteId, temperatureSensor, date);
    const humidityData = await fetchHumidityData(siteId, humiditySensor, date);
    
    // Check if we have real data
    const hasRealTempData = tempData.length > 0;
    const hasRealHumidityData = humidityData.length > 0;
    
    // Process data into hourly groups
    const { hourlyTemperatures, hourlyHumidities } = processHourlyData(tempData, humidityData);
    
    console.log('Processed hourly temperatures:', hourlyTemperatures);
    console.log('Processed hourly humidities:', hourlyHumidities);
    
    // Create hourly data points with averages
    const hourlyData = createDailyOverviewPoints(
      hourlyTemperatures, 
      hourlyHumidities, 
      hasRealTempData, 
      hasRealHumidityData
    );
    
    // Fill in missing data points
    const processedData = fillMissingDataPoints(hourlyData);
    console.log(`Returning ${processedData.length} daily data points with ${processedData.filter(p => p.isReal.temperature).length} real temperature readings`);
    
    return processedData;
  } catch (error) {
    console.error(`Error fetching sensor data for day ${date}:`, error);
    
    // Return mock data if we can't get real data
    return generateSimulatedDailyData();
  }
}
