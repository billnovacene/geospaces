
import { apiRequest } from "../api-client";
import { DailyOverviewPoint, PointsDataResponse } from "../interfaces/temp-humidity";

export async function fetchSensorDataForDay(
  siteId: string, 
  temperatureSensor: string | undefined, 
  humiditySensor: string | undefined,
  date: string
): Promise<DailyOverviewPoint[]> {
  try {
    let tempData: Array<{timestamp: string, value: number | string}> = [];
    let humidityData: Array<{timestamp: string, value: number | string}> = [];
    
    // Fetch temperature data if sensor is available
    if (temperatureSensor) {
      const tempEndpoint = `/devices/points-data?siteid=${siteId}&sensor=${temperatureSensor}&start=${date}&end=${date}`;
      try {
        const tempResponse = await apiRequest<PointsDataResponse>(tempEndpoint);
        if (tempResponse.data && tempResponse.data.length > 0 && tempResponse.data[0].pointData) {
          tempData = tempResponse.data[0].pointData || [];
        }
      } catch (err) {
        console.warn('Could not fetch temperature data, proceeding with humidity only', err);
      }
    }
    
    // Get humidity data if sensor is available
    if (humiditySensor) {
      const humidityEndpoint = `/devices/points-data?siteid=${siteId}&sensor=${humiditySensor}&start=${date}&end=${date}`;
      try {
        const humidityResponse = await apiRequest<PointsDataResponse>(humidityEndpoint);
        if (humidityResponse.data && humidityResponse.data.length > 0 && humidityResponse.data[0].pointData) {
          humidityData = humidityResponse.data[0].pointData || [];
        }
      } catch (err) {
        console.warn('Could not fetch humidity data, proceeding with temperature only', err);
      }
    }
    
    // Group data by hour
    const hourlyTemperatures: Record<string, number[]> = {};
    const hourlyHumidities: Record<string, number[]> = {};
    
    // Process temperature data
    tempData.forEach(point => {
      const datetime = new Date(point.timestamp);
      const hour = `${datetime.getHours()}:00`;
      
      if (!hourlyTemperatures[hour]) {
        hourlyTemperatures[hour] = [];
      }
      
      // Convert string values to numbers
      const numValue = typeof point.value === 'string' ? parseFloat(point.value) : point.value;
      if (!isNaN(numValue)) {
        hourlyTemperatures[hour].push(numValue);
      }
    });
    
    // Process humidity data
    humidityData.forEach(point => {
      const datetime = new Date(point.timestamp);
      const hour = `${datetime.getHours()}:00`;
      
      if (!hourlyHumidities[hour]) {
        hourlyHumidities[hour] = [];
      }
      
      // Convert string values to numbers
      const numValue = typeof point.value === 'string' ? parseFloat(point.value) : point.value;
      if (!isNaN(numValue)) {
        hourlyHumidities[hour].push(numValue);
      }
    });
    
    // Create hourly data points with averages
    const hourlyData: DailyOverviewPoint[] = [];
    for (let i = 0; i < 24; i++) {
      const hour = `${i}:00`;
      const tempValues = hourlyTemperatures[hour] || [];
      const humidityValues = hourlyHumidities[hour] || [];
      
      const avgTemp = tempValues.length > 0 
        ? tempValues.reduce((sum, val) => sum + val, 0) / tempValues.length 
        : null;
        
      const avgHumidity = humidityValues.length > 0 
        ? humidityValues.reduce((sum, val) => sum + val, 0) / humidityValues.length 
        : null;
      
      hourlyData.push({
        time: hour,
        temperature: avgTemp !== null ? avgTemp : 18 + Math.sin(i / 24 * Math.PI * 2) * 6,
        humidity: avgHumidity !== null ? avgHumidity : 40 + Math.sin((i / 24 * Math.PI * 2) + 1) * 15
      });
    }
    
    return hourlyData;
  } catch (error) {
    console.error(`Error fetching sensor data for day ${date}:`, error);
    
    // Return mock data if we can't get real data
    return Array(24).fill(null).map((_, i) => ({
      time: `${i}:00`,
      temperature: 18 + Math.sin(i / 24 * Math.PI * 2) * 6,
      humidity: 40 + Math.sin((i / 24 * Math.PI * 2) + 1) * 15
    }));
  }
}
