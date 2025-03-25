
import { DailyOverviewPoint } from "../interfaces/temp-humidity";

// Function to process and aggregate hourly data from raw sensor readings
export function aggregateHourlyData(
  tempData: Array<{timestamp: string, value: number | string}>,
  humidityData: Array<{timestamp: string, value: number | string}>
): {
  hourlyTemperatures: Record<string, number[]>,
  hourlyHumidities: Record<string, number[]>,
  hasRealTempData: boolean,
  hasRealHumidityData: boolean
} {
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
  
  console.log('Processed hourly temperatures:', Object.keys(hourlyTemperatures).length > 0 ? 
    `${Object.keys(hourlyTemperatures).length} hours with data` : 'No temperature data available');
  console.log('Processed hourly humidities:', Object.keys(hourlyHumidities).length > 0 ? 
    `${Object.keys(hourlyHumidities).length} hours with data` : 'No humidity data available');
  
  // Check if we have real data
  const hasRealTempData = Object.keys(hourlyTemperatures).length > 0;
  const hasRealHumidityData = Object.keys(hourlyHumidities).length > 0;
  
  return {
    hourlyTemperatures,
    hourlyHumidities,
    hasRealTempData,
    hasRealHumidityData
  };
}

// Function to create hourly data points with averages
export function createHourlyDataPoints(
  hourlyTemperatures: Record<string, number[]>,
  hourlyHumidities: Record<string, number[]>,
  hasRealTempData: boolean,
  hasRealHumidityData: boolean
): DailyOverviewPoint[] {
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
    
    // Only use simulated data if we have no real data at all
    // Changed from hour-by-hour substitution to all-or-nothing
    const hasTemp = avgTemp !== null;
    const hasHumidity = avgHumidity !== null;
    
    hourlyData.push({
      time: hour,
      temperature: hasTemp ? avgTemp : (hasRealTempData ? null : 18 + Math.sin(i / 24 * Math.PI * 2) * 6),
      humidity: hasHumidity ? avgHumidity : (hasRealHumidityData ? null : 40 + Math.sin((i / 24 * Math.PI * 2) + 1) * 15),
      isReal: {
        temperature: hasTemp,
        humidity: hasHumidity
      }
    });
  }
  
  console.log(`Created ${hourlyData.length} hourly data points with ${hourlyData.filter(p => p.isReal?.temperature).length} real temperature readings`);
  return hourlyData;
}

// Function to generate mock data when real data isn't available
export function generateMockDailyData(): DailyOverviewPoint[] {
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
