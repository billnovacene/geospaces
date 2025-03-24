
import { DailyOverviewPoint, MonthlyOverviewPoint, StatsData } from "../interfaces/temp-humidity";

export function calculateStats(
  dailyData: DailyOverviewPoint[],
  monthlyData: MonthlyOverviewPoint[]
): StatsData {
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
export const generateMockData = (): {
  stats: StatsData;
  daily: DailyOverviewPoint[];
  monthly: MonthlyOverviewPoint[];
} => {
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
