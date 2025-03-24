
import { addDays, addHours, format, subDays, subMonths } from "date-fns";

// Type for temperature/humidity data point
export interface TempHumidityDataPoint {
  timestamp: string;
  temperature: number;
  humidity: number;
  status: 'good' | 'caution' | 'warning';
}

export interface DailyOverviewPoint {
  time: string;
  temperature: number;
  humidity: number;
  status: 'good' | 'caution' | 'warning';
}

export interface MonthlyOverviewPoint {
  date: string;
  minTemp: number;
  maxTemp: number;
  avgTemp: number;
  avgHumidity: number;
  status: 'good' | 'caution' | 'warning';
}

export interface StatsData {
  avgTemp: number;
  minTemp: number;
  maxTemp: number;
  avgHumidity: number;
  coldestDay: {
    date: string;
    temperature: number;
  };
  status: {
    avgTemp: 'good' | 'caution' | 'warning';
    minTemp: 'good' | 'caution' | 'warning';
    maxTemp: 'good' | 'caution' | 'warning';
    avgHumidity: 'good' | 'caution' | 'warning';
  };
}

// Function to generate a random number between min and max
const getRandomNumber = (min: number, max: number) => {
  return Math.round((Math.random() * (max - min) + min) * 10) / 10;
};

// Generate status based on temperature and humidity
const getStatus = (temp: number, humidity: number): 'good' | 'caution' | 'warning' => {
  if (temp < 10 || temp > 26 || humidity < 30 || humidity > 65) {
    return 'warning';
  } else if (temp < 15 || temp > 22 || humidity < 40 || humidity > 60) {
    return 'caution';
  }
  return 'good';
};

// Generate data for the daily overview
export const generateDailyData = (): DailyOverviewPoint[] => {
  const today = new Date();
  const startOfDay = new Date(today.setHours(6, 0, 0, 0));
  
  return Array.from({ length: 24 }, (_, i) => {
    const time = addHours(startOfDay, i);
    const hour = time.getHours();
    
    // Generate temperature that follows a curve (cooler in morning/night, warmer in the day)
    let baseTemp = 15;
    if (hour > 6 && hour < 18) {
      baseTemp += Math.sin((hour - 6) * Math.PI / 12) * 7; // Peak around noon
    }
    
    const temperature = getRandomNumber(baseTemp - 2, baseTemp + 2);
    const humidity = getRandomNumber(40, 55);
    const status = getStatus(temperature, humidity);
    
    return {
      time: format(time, "HH:mm"),
      temperature,
      humidity,
      status
    };
  });
};

// Generate data for the monthly overview
export const generateMonthlyData = (): MonthlyOverviewPoint[] => {
  const today = new Date();
  const startDate = subMonths(today, 1);
  
  return Array.from({ length: 30 }, (_, i) => {
    const date = addDays(startDate, i);
    const month = date.getMonth();
    
    // Generate temperatures that reflect seasonal patterns
    const baseTemp = 15 + Math.sin((month / 12) * Math.PI * 2) * 5;
    const dailyVariation = getRandomNumber(3, 6);
    
    const minTemp = getRandomNumber(baseTemp - dailyVariation, baseTemp);
    const maxTemp = getRandomNumber(baseTemp, baseTemp + dailyVariation);
    const avgTemp = (minTemp + maxTemp) / 2;
    const avgHumidity = getRandomNumber(40, 55);
    const status = getStatus(avgTemp, avgHumidity);
    
    return {
      date: format(date, "MMM dd"),
      minTemp,
      maxTemp,
      avgTemp,
      avgHumidity,
      status
    };
  });
};

// Generate summary statistics
export const generateStatsData = (): StatsData => {
  const avgTemp = getRandomNumber(15, 16);
  const minTemp = getRandomNumber(8.5, 9);
  const maxTemp = getRandomNumber(21, 23);
  const avgHumidity = getRandomNumber(45, 50);
  
  // Generate coldest day data
  const today = new Date();
  const coldestDayDate = subDays(today, getRandomNumber(1, 15));
  
  return {
    avgTemp,
    minTemp,
    maxTemp,
    avgHumidity,
    coldestDay: {
      date: format(coldestDayDate, "MMM dd"),
      temperature: minTemp
    },
    status: {
      avgTemp: getStatus(avgTemp, 45),
      minTemp: getStatus(minTemp, 45),
      maxTemp: getStatus(maxTemp, 45),
      avgHumidity: getStatus(17, avgHumidity)
    }
  };
};

// Function that simulates API call to get temperature and humidity data
export const fetchTempHumidityData = async (): Promise<{
  daily: DailyOverviewPoint[];
  monthly: MonthlyOverviewPoint[];
  stats: StatsData;
}> => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  return {
    daily: generateDailyData(),
    monthly: generateMonthlyData(),
    stats: generateStatsData()
  };
};
