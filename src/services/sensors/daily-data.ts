
import { apiRequest } from "../api-client";
import { DailyOverviewPoint, PointsDataResponse } from "../interfaces/temp-humidity";
import { filterDataByOperatingHours, fillMissingDataPoints } from "./data-processing";
import { 
  aggregateHourlyData, 
  createHourlyDataPoints, 
  generateMockDailyData 
} from "./data-aggregation";

export async function fetchSensorDataForDay(
  siteId: string, 
  temperatureSensor: string | undefined, 
  humiditySensor: string | undefined,
  date: string,
  operatingHours: { startTime: string; endTime: string } | null = null
): Promise<DailyOverviewPoint[]> {
  try {
    let tempData: Array<{timestamp: string, value: number | string}> = [];
    let humidityData: Array<{timestamp: string, value: number | string}> = [];
    
    // Fetch temperature data if sensor is available
    if (temperatureSensor) {
      const tempEndpoint = `/devices/points-data?siteid=${siteId}&sensor=${temperatureSensor}&start=${date}&end=${date}`;
      try {
        console.log(`Fetching temperature data from API: ${tempEndpoint}`);
        const tempResponse = await apiRequest<PointsDataResponse>(tempEndpoint);
        if (tempResponse.data && tempResponse.data.length > 0 && tempResponse.data[0].pointData) {
          tempData = tempResponse.data[0].pointData || [];
          console.log(`Received ${tempData.length} temperature data points for day ${date}`);
        }
      } catch (err) {
        console.warn('Could not fetch temperature data, proceeding with humidity only', err);
      }
    }
    
    // Get humidity data if sensor is available
    if (humiditySensor) {
      const humidityEndpoint = `/devices/points-data?siteid=${siteId}&sensor=${humiditySensor}&start=${date}&end=${date}`;
      try {
        console.log(`Fetching humidity data from API: ${humidityEndpoint}`);
        const humidityResponse = await apiRequest<PointsDataResponse>(humidityEndpoint);
        if (humidityResponse.data && humidityResponse.data.length > 0 && humidityResponse.data[0].pointData) {
          humidityData = humidityResponse.data[0].pointData || [];
          console.log(`Received ${humidityData.length} humidity data points for day ${date}`);
        }
      } catch (err) {
        console.warn('Could not fetch humidity data, proceeding with temperature only', err);
      }
    }
    
    // Filter data by operating hours if provided
    if (operatingHours) {
      console.log(`Filtering data by operating hours: ${operatingHours.startTime} to ${operatingHours.endTime}`);
      tempData = filterDataByOperatingHours(tempData, operatingHours);
      humidityData = filterDataByOperatingHours(humidityData, operatingHours);
      console.log(`After filtering: ${tempData.length} temp points, ${humidityData.length} humidity points`);
    }
    
    // Aggregate data by hour
    const {
      hourlyTemperatures,
      hourlyHumidities,
      hasRealTempData,
      hasRealHumidityData
    } = aggregateHourlyData(tempData, humidityData);
    
    // Create hourly data points
    const hourlyData = createHourlyDataPoints(
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
    console.warn('Falling back to simulated daily data');
    return generateMockDailyData();
  }
}
