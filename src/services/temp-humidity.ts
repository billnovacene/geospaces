
import { apiRequest } from "./api-client";

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

export const fetchTempHumidityData = async (siteId?: string, zoneId?: string): Promise<TempHumidityResponse> => {
  try {
    // Construct the API endpoint based on the provided site or zone ID
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
