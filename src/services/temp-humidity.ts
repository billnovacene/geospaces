
import { apiRequest } from "./api-client";
import { format, subDays } from "date-fns";

export interface MonthlyOverviewPoint {
  date: string;
  avgTemp: number;
  minTemp: number;
  maxTemp: number;
  avgHumidity: number;
}

export interface DailyOverviewPoint {
  time: string;
  temperature: number;
  humidity: number;
}

interface TempHumidityResponse {
  stats: {
    avgTemp: number;
    minTemp: number;
    maxTemp: number;
    avgHumidity: number;
    lastSeen: string;
    status: {
      avgTemp: 'good' | 'caution' | 'warning';
      minTemp: 'good' | 'caution' | 'warning';
      maxTemp: 'good' | 'caution' | 'warning';
      avgHumidity: 'good' | 'caution' | 'warning';
    };
  };
  daily: DailyOverviewPoint[];
  monthly: MonthlyOverviewPoint[];
}

interface PointsDataResponse {
  pointsData: {
    list: Array<{
      recordTime: string;
      value: number;
    }>;
  };
}

// Map of known temperature sensors by site
const TEMP_SENSORS: Record<string, string[]> = {
  "471": ["a1442adf-1109-4b30-a860-309ef45ae67f"]
};

// Map of known humidity sensors by site
const HUMIDITY_SENSORS: Record<string, string[]> = {
  "471": ["e4dd6e3f-8572-4036-84e9-4c6e79cfcb18"]
};

export const fetchTempHumidityData = async (siteId?: string, zoneId?: string): Promise<TempHumidityResponse> => {
  try {
    // Handle site-specific data fetch
    if (siteId && TEMP_SENSORS[siteId]) {
      console.log(`Fetching real temperature data for site ${siteId}`);
      return await fetchRealDeviceData(siteId);
    }
    
    // For zones or sites without known sensors, construct the API endpoint 
    // based on the provided site or zone ID
    let endpoint = '/sensors/temperature-humidity';
    
    if (zoneId) {
      endpoint += `/zone/${zoneId}`;
    } else if (siteId) {
      endpoint += `/site/${siteId}`;
    }
    
    // Make the actual API request
    const response = await apiRequest<TempHumidityResponse>(endpoint);
    console.log('API response:', response);
    return response;
  } catch (error) {
    console.error('Error fetching temperature and humidity data:', error);
    
    // If the API request fails, fall back to the mock data
    console.warn('Falling back to mock temperature and humidity data');
    return generateMockData();
  }
};

async function fetchRealDeviceData(siteId: string): Promise<TempHumidityResponse> {
  try {
    const temperatureSensors = TEMP_SENSORS[siteId] || [];
    const humiditySensors = HUMIDITY_SENSORS[siteId] || [];
    
    if (temperatureSensors.length === 0) {
      throw new Error(`No temperature sensors found for site ${siteId}`);
    }
    
    // Get data for the last 30 days for monthly view
    const today = new Date();
    
    // Fetch daily data (today)
    const dailyData = await fetchSensorDataForDay(
      siteId,
      temperatureSensors[0],
      humiditySensors[0],
      format(today, 'yyyy-MM-dd')
    );
    
    // Fetch last 30 days of data for monthly view
    const monthlyData = await fetchMonthlyData(siteId, temperatureSensors[0], humiditySensors[0]);
    
    // Calculate statistics
    const stats = calculateStats(dailyData, monthlyData);
    
    return {
      stats,
      daily: dailyData,
      monthly: monthlyData
    };
  } catch (error) {
    console.error('Error fetching real device data:', error);
    throw error;
  }
}

async function fetchSensorDataForDay(
  siteId: string, 
  temperatureSensor: string, 
  humiditySensor: string | undefined,
  date: string
): Promise<DailyOverviewPoint[]> {
  try {
    // Fetch temperature data for the day
    const tempEndpoint = `/devices/points-data?siteid=${siteId}&sensor=${temperatureSensor}&start=${date}&end=${date}`;
    const tempResponse = await apiRequest<PointsDataResponse>(tempEndpoint);
    
    // Get humidity data if sensor is available
    let humidityData: Array<{recordTime: string, value: number}> = [];
    if (humiditySensor) {
      const humidityEndpoint = `/devices/points-data?siteid=${siteId}&sensor=${humiditySensor}&start=${date}&end=${date}`;
      try {
        const humidityResponse = await apiRequest<PointsDataResponse>(humidityEndpoint);
        humidityData = humidityResponse.pointsData.list || [];
      } catch (err) {
        console.warn('Could not fetch humidity data, proceeding with temperature only', err);
      }
    }
    
    // Map temperature data points to hourly intervals
    const hourlyData: DailyOverviewPoint[] = [];
    const tempData = tempResponse.pointsData.list || [];
    
    // Group data by hour
    const hourlyTemperatures: Record<string, number[]> = {};
    const hourlyHumidities: Record<string, number[]> = {};
    
    // Process temperature data
    tempData.forEach(point => {
      const datetime = new Date(point.recordTime);
      const hour = `${datetime.getHours()}:00`;
      
      if (!hourlyTemperatures[hour]) {
        hourlyTemperatures[hour] = [];
      }
      hourlyTemperatures[hour].push(point.value);
    });
    
    // Process humidity data
    humidityData.forEach(point => {
      const datetime = new Date(point.recordTime);
      const hour = `${datetime.getHours()}:00`;
      
      if (!hourlyHumidities[hour]) {
        hourlyHumidities[hour] = [];
      }
      hourlyHumidities[hour].push(point.value);
    });
    
    // Create hourly data points with averages
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

async function fetchMonthlyData(
  siteId: string,
  temperatureSensor: string,
  humiditySensor: string | undefined
): Promise<MonthlyOverviewPoint[]> {
  const monthlyData: MonthlyOverviewPoint[] = [];
  const today = new Date();
  
  // Fetch data for the last 30 days
  for (let i = 29; i >= 0; i--) {
    const date = subDays(today, i);
    const dateString = format(date, 'yyyy-MM-dd');
    
    try {
      // Fetch temperature data for the day
      const tempEndpoint = `/devices/points-data?siteid=${siteId}&sensor=${temperatureSensor}&start=${dateString}&end=${dateString}`;
      const tempResponse = await apiRequest<PointsDataResponse>(tempEndpoint);
      const tempData = tempResponse.pointsData.list || [];
      
      // Get humidity data if sensor is available
      let humidityData: Array<{recordTime: string, value: number}> = [];
      if (humiditySensor) {
        const humidityEndpoint = `/devices/points-data?siteid=${siteId}&sensor=${humiditySensor}&start=${dateString}&end=${dateString}`;
        try {
          const humidityResponse = await apiRequest<PointsDataResponse>(humidityEndpoint);
          humidityData = humidityResponse.pointsData.list || [];
        } catch (err) {
          console.warn(`Could not fetch humidity data for ${dateString}`, err);
        }
      }
      
      if (tempData.length > 0) {
        // Calculate average, min, and max temperatures
        const temperatures = tempData.map(point => point.value);
        const avgTemp = temperatures.reduce((sum, val) => sum + val, 0) / temperatures.length;
        const minTemp = Math.min(...temperatures);
        const maxTemp = Math.max(...temperatures);
        
        // Calculate average humidity
        let avgHumidity = 50;
        if (humidityData.length > 0) {
          const humidities = humidityData.map(point => point.value);
          avgHumidity = humidities.reduce((sum, val) => sum + val, 0) / humidities.length;
        }
        
        monthlyData.push({
          date: dateString,
          avgTemp,
          minTemp,
          maxTemp,
          avgHumidity
        });
      } else {
        // If no data, add mock data
        monthlyData.push({
          date: dateString,
          avgTemp: 20 + Math.sin(i / 30 * Math.PI * 2) * 3,
          minTemp: 16 + Math.sin(i / 30 * Math.PI * 2) * 2,
          maxTemp: 24 + Math.sin(i / 30 * Math.PI * 2) * 4,
          avgHumidity: 50 + Math.sin((i / 30 * Math.PI * 2) + 1) * 10
        });
      }
    } catch (error) {
      console.error(`Error fetching data for date ${dateString}:`, error);
      
      // Add mock data on error
      monthlyData.push({
        date: dateString,
        avgTemp: 20 + Math.sin(i / 30 * Math.PI * 2) * 3,
        minTemp: 16 + Math.sin(i / 30 * Math.PI * 2) * 2,
        maxTemp: 24 + Math.sin(i / 30 * Math.PI * 2) * 4,
        avgHumidity: 50 + Math.sin((i / 30 * Math.PI * 2) + 1) * 10
      });
    }
  }
  
  return monthlyData;
}

function calculateStats(
  dailyData: DailyOverviewPoint[],
  monthlyData: MonthlyOverviewPoint[]
): TempHumidityResponse['stats'] {
  // Get today's data
  const todayTemps = dailyData.map(point => point.temperature).filter(temp => !isNaN(temp));
  const todayHumidity = dailyData.map(point => point.humidity).filter(humidity => !isNaN(humidity));
  
  // Monthly data
  const allMonthlyAvgTemps = monthlyData.map(point => point.avgTemp);
  const allMonthlyMinTemps = monthlyData.map(point => point.minTemp);
  const allMonthlyMaxTemps = monthlyData.map(point => point.maxTemp);
  const allMonthlyHumidity = monthlyData.map(point => point.avgHumidity);
  
  // Calculate values
  let avgTemp = 21.5;
  let minTemp = 18.3;
  let maxTemp = 24.7;
  let avgHumidity = 55.2;
  
  if (todayTemps.length > 0) {
    avgTemp = todayTemps.reduce((sum, val) => sum + val, 0) / todayTemps.length;
    minTemp = Math.min(...todayTemps);
    maxTemp = Math.max(...todayTemps);
  } else if (allMonthlyAvgTemps.length > 0) {
    avgTemp = allMonthlyAvgTemps.reduce((sum, val) => sum + val, 0) / allMonthlyAvgTemps.length;
    minTemp = Math.min(...allMonthlyMinTemps);
    maxTemp = Math.max(...allMonthlyMaxTemps);
  }
  
  if (todayHumidity.length > 0) {
    avgHumidity = todayHumidity.reduce((sum, val) => sum + val, 0) / todayHumidity.length;
  } else if (allMonthlyHumidity.length > 0) {
    avgHumidity = allMonthlyHumidity.reduce((sum, val) => sum + val, 0) / allMonthlyHumidity.length;
  }
  
  // Determine status based on values
  const determineStatus = (value: number, type: 'temp' | 'humidity'): 'good' | 'caution' | 'warning' => {
    if (type === 'temp') {
      if (value < 10 || value > 30) return 'warning';
      if (value < 17 || value > 22) return 'caution';
      return 'good';
    } else {
      if (value < 30 || value > 70) return 'warning';
      if (value < 40 || value > 60) return 'caution';
      return 'good';
    }
  };
  
  return {
    avgTemp,
    minTemp,
    maxTemp,
    avgHumidity,
    lastSeen: new Date().toISOString(),
    status: {
      avgTemp: determineStatus(avgTemp, 'temp'),
      minTemp: determineStatus(minTemp, 'temp'),
      maxTemp: determineStatus(maxTemp, 'temp'),
      avgHumidity: determineStatus(avgHumidity, 'humidity')
    }
  };
}

// Function to generate mock data as a fallback
const generateMockData = (): TempHumidityResponse => {
  const lastSeen = new Date().toISOString();
  
  return {
    stats: {
      avgTemp: 21.5,
      minTemp: 18.3,
      maxTemp: 24.7,
      avgHumidity: 55.2,
      lastSeen,
      status: {
        avgTemp: 'good',
        minTemp: 'good',
        maxTemp: 'good',
        avgHumidity: 'good'
      }
    },
    daily: Array(24).fill(null).map((_, i) => ({
      time: `${i}:00`,
      temperature: 18 + Math.sin(i / 24 * Math.PI * 2) * 6,
      humidity: 40 + Math.sin((i / 24 * Math.PI * 2) + 1) * 15
    })),
    monthly: Array(30).fill(null).map((_, i) => ({
      date: new Date(new Date().setDate(new Date().getDate() - (29 - i))).toISOString().split('T')[0],
      avgTemp: 20 + Math.sin(i / 30 * Math.PI * 2) * 3,
      minTemp: 16 + Math.sin(i / 30 * Math.PI * 2) * 2,
      maxTemp: 24 + Math.sin(i / 30 * Math.PI * 2) * 4,
      avgHumidity: 50 + Math.sin((i / 30 * Math.PI * 2) + 1) * 10
    }))
  };
};
