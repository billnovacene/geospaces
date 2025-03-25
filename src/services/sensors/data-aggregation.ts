
import { DailyOverviewPoint } from "../interfaces/temp-humidity";

// Define the shape of hourly aggregated data including real data flag
interface HourlyAggregatedData {
  values: number[];
  hasReal: boolean;
}

// Function to process and aggregate hourly data from raw sensor readings
export function aggregateHourlyData(
  tempData: Array<{timestamp: string, value: number | string}>,
  humidityData: Array<{timestamp: string, value: number | string}>
): {
  hourlyTemperatures: Record<string, HourlyAggregatedData>,
  hourlyHumidities: Record<string, HourlyAggregatedData>,
  hasRealTempData: boolean,
  hasRealHumidityData: boolean
} {
  // Group data by hour
  const hourlyTemperatures: Record<string, HourlyAggregatedData> = {};
  const hourlyHumidities: Record<string, HourlyAggregatedData> = {};
  
  // Process temperature data
  tempData.forEach(point => {
    try {
      const datetime = new Date(point.timestamp);
      const hour = `${datetime.getHours()}:00`;
      
      if (!hourlyTemperatures[hour]) {
        hourlyTemperatures[hour] = {
          values: [],
          hasReal: true
        };
      }
      
      // Convert string values to numbers
      const numValue = typeof point.value === 'string' ? parseFloat(point.value) : point.value;
      if (!isNaN(numValue)) {
        hourlyTemperatures[hour].values.push(numValue);
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
        hourlyHumidities[hour] = {
          values: [],
          hasReal: true
        };
      }
      
      // Convert string values to numbers
      const numValue = typeof point.value === 'string' ? parseFloat(point.value) : point.value;
      if (!isNaN(numValue)) {
        hourlyHumidities[hour].values.push(numValue);
      }
    } catch (e) {
      console.warn('Error processing humidity point:', e, point);
    }
  });
  
  console.log('Processed hourly temperatures:', Object.keys(hourlyTemperatures).length > 0 ? 
    `${Object.keys(hourlyTemperatures).length} hours with data` : 'No temperature data available');
  
  if (Object.keys(hourlyTemperatures).length > 0) {
    console.log('Hours with temperature data:', Object.keys(hourlyTemperatures).join(', '));
    Object.entries(hourlyTemperatures).forEach(([hour, data]) => {
      console.log(`Hour ${hour}: ${data.values.length} readings, avg: ${data.values.reduce((a, b) => a + b, 0) / data.values.length}`);
    });
  }
  
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
  hourlyTemperatures: Record<string, HourlyAggregatedData>,
  hourlyHumidities: Record<string, HourlyAggregatedData>,
  hasRealTempData: boolean,
  hasRealHumidityData: boolean
): DailyOverviewPoint[] {
  const hourlyData: DailyOverviewPoint[] = [];
  
  for (let i = 0; i < 24; i++) {
    const hour = `${i}:00`;
    const tempData = hourlyTemperatures[hour];
    const humidityData = hourlyHumidities[hour];
    
    const tempValues = tempData?.values || [];
    const humidityValues = humidityData?.values || [];
    
    const avgTemp = tempValues.length > 0 
      ? tempValues.reduce((sum, val) => sum + val, 0) / tempValues.length 
      : null;
      
    const avgHumidity = humidityValues.length > 0 
      ? humidityValues.reduce((sum, val) => sum + val, 0) / humidityValues.length 
      : null;
    
    // Always set isReal correctly based on whether we have actual data for this hour
    const hasTemp = avgTemp !== null;
    const hasHumidity = avgHumidity !== null;
    
    hourlyData.push({
      time: hour,
      temperature: hasTemp ? avgTemp : (hasRealTempData ? null : 18 + Math.sin(i / 24 * Math.PI * 2) * 6),
      humidity: hasHumidity ? avgHumidity : (hasRealHumidityData ? null : 40 + Math.sin((i / 24 * Math.PI * 2) + 1) * 15),
      isReal: {
        temperature: hasTemp && !!tempData?.hasReal,
        humidity: hasHumidity && !!humidityData?.hasReal
      }
    });
  }
  
  const realTempPoints = hourlyData.filter(p => p.isReal?.temperature).length;
  console.log(`Created ${hourlyData.length} hourly data points with ${realTempPoints} real temperature readings (${(realTempPoints / hourlyData.length * 100).toFixed(1)}% real data)`);
  
  return hourlyData;
}

// Function to generate mock data when real data isn't available
export function generateMockDailyData(): DailyOverviewPoint[] {
  console.log('Generating all simulated daily data because no real data was available');
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
