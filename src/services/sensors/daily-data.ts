
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
    
    // Group data by hour
    const hourlyTemperatures: Record<string, number[]> = {};
    const hourlyHumidities: Record<string, number[]> = {};
    
    // Process temperature data
    tempData.forEach(point => {
      try {
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
      } catch (e) {
        console.warn('Error processing temperature point:', e, point);
      }
    });
    
    // Process humidity data
    humidityData.forEach(point => {
      try {
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
      } catch (e) {
        console.warn('Error processing humidity point:', e, point);
      }
    });
    
    console.log('Processed hourly temperatures:', hourlyTemperatures);
    console.log('Processed hourly humidities:', hourlyHumidities);
    
    // Check if we have real data
    const hasRealTempData = Object.keys(hourlyTemperatures).length > 0;
    const hasRealHumidityData = Object.keys(hourlyHumidities).length > 0;
    
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
      
      // Only use simulated data if we have no real data for this hour
      const useSimulatedTemp = avgTemp === null && !hasRealTempData;
      const useSimulatedHumidity = avgHumidity === null && !hasRealHumidityData;
      
      hourlyData.push({
        time: hour,
        temperature: avgTemp !== null ? avgTemp : (useSimulatedTemp ? 18 + Math.sin(i / 24 * Math.PI * 2) * 6 : null),
        humidity: avgHumidity !== null ? avgHumidity : (useSimulatedHumidity ? 40 + Math.sin((i / 24 * Math.PI * 2) + 1) * 15 : null),
        isReal: {
          temperature: avgTemp !== null,
          humidity: avgHumidity !== null
        }
      });
    }
    
    // Fill in missing data points
    const processedData = fillMissingDataPoints(hourlyData);
    console.log(`Returning ${processedData.length} daily data points with ${processedData.filter(p => p.isReal.temperature).length} real temperature readings`);
    
    return processedData;
  } catch (error) {
    console.error(`Error fetching sensor data for day ${date}:`, error);
    
    // Return mock data if we can't get real data
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
}

// Helper function to fill in missing data points using linear interpolation
function fillMissingDataPoints(data: DailyOverviewPoint[]): DailyOverviewPoint[] {
  // Create a copy of the data
  const result = [...data];
  
  // Fill in missing temperature values
  fillMissingValues(result, 'temperature');
  
  // Fill in missing humidity values
  fillMissingValues(result, 'humidity');
  
  return result;
}

function fillMissingValues(data: DailyOverviewPoint[], property: 'temperature' | 'humidity'): void {
  // Find the first and last valid points
  let firstValidIndex = -1;
  let lastValidIndex = -1;
  
  for (let i = 0; i < data.length; i++) {
    if (data[i][property] !== null) {
      if (firstValidIndex === -1) firstValidIndex = i;
      lastValidIndex = i;
    }
  }
  
  // If no valid points, return
  if (firstValidIndex === -1) return;
  
  // Fill in missing values between first and last valid points using linear interpolation
  for (let i = firstValidIndex; i <= lastValidIndex; i++) {
    if (data[i][property] === null) {
      // Find the next valid point
      let nextValidIndex = -1;
      for (let j = i + 1; j <= lastValidIndex; j++) {
        if (data[j][property] !== null) {
          nextValidIndex = j;
          break;
        }
      }
      
      // If no next valid point, should not happen due to lastValidIndex check
      if (nextValidIndex === -1) continue;
      
      // Find the previous valid point (we know there is one because i >= firstValidIndex)
      let prevValidIndex = -1;
      for (let j = i - 1; j >= firstValidIndex; j--) {
        if (data[j][property] !== null) {
          prevValidIndex = j;
          break;
        }
      }
      
      // Linear interpolation
      const prevValue = data[prevValidIndex][property] as number;
      const nextValue = data[nextValidIndex][property] as number;
      const totalSteps = nextValidIndex - prevValidIndex;
      const currentStep = i - prevValidIndex;
      
      data[i][property] = prevValue + (nextValue - prevValue) * (currentStep / totalSteps);
      // Mark as not real
      data[i].isReal[property] = false;
    }
  }
}
