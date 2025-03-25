
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
    
    console.log(`📅 fetchSensorDataForDay: siteId=${siteId}, date=${date}, temperatureSensor=${temperatureSensor}, humiditySensor=${humiditySensor}`);
    
    // Fetch temperature data if sensor is available
    if (temperatureSensor) {
      const tempEndpoint = `/devices/points-data?siteid=${siteId}&sensor=${temperatureSensor}&start=${date}&end=${date}`;
      try {
        console.log(`Fetching temperature data from API: ${tempEndpoint}`);
        const tempResponse = await apiRequest<PointsDataResponse>(tempEndpoint);
        if (tempResponse.data && tempResponse.data.length > 0 && tempResponse.data[0].pointData) {
          tempData = tempResponse.data[0].pointData || [];
          console.log(`Received ${tempData.length} temperature data points for day ${date}`);
          
          // Log a few sample points
          if (tempData.length > 0) {
            console.log('Temperature data samples:', tempData.slice(0, 3));
          }
        } else {
          console.warn(`No temperature data points received from API for sensor ${temperatureSensor}`);
        }
      } catch (err) {
        console.warn('Could not fetch temperature data, proceeding with humidity only', err);
      }
    } else {
      console.warn('No temperature sensor provided for fetching daily data');
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
          
          // Log a few sample points
          if (humidityData.length > 0) {
            console.log('Humidity data samples:', humidityData.slice(0, 3));
          }
        } else {
          console.warn(`No humidity data points received from API for sensor ${humiditySensor}`);
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
    
    // Log samples of data for debugging
    if (tempData.length > 0) {
      console.log('Temperature data sample after filtering:', tempData.slice(0, 3));
    } else {
      console.warn('No temperature data available after filtering');
    }
    
    // Aggregate data by hour
    const {
      hourlyTemperatures,
      hourlyHumidities,
      hasRealTempData,
      hasRealHumidityData
    } = aggregateHourlyData(tempData, humidityData);
    
    console.log(`Aggregation results: hasRealTempData=${hasRealTempData}, hasRealHumidityData=${hasRealHumidityData}`);
    
    // Create hourly data points
    let hourlyData = createHourlyDataPoints(
      hourlyTemperatures,
      hourlyHumidities,
      hasRealTempData,
      hasRealHumidityData
    );
    
    // Fill in missing data points
    const processedData = fillMissingDataPoints(hourlyData);
    const realDataPoints = processedData.filter(p => p.isReal?.temperature).length;
    
    console.log(`Returning ${processedData.length} daily data points with ${realDataPoints} real temperature readings (${(realDataPoints/processedData.length*100).toFixed(1)}%)`);
    
    if (realDataPoints === 0) {
      console.warn('No real temperature data found for this day, all values are simulated');
    }
    
    return processedData;
  } catch (error) {
    console.error(`Error fetching sensor data for day ${date}:`, error);
    
    // Return mock data if we can't get real data
    console.warn('Falling back to simulated daily data');
    return generateMockDailyData();
  }
}
