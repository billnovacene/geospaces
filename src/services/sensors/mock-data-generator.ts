
import { DailyOverviewPoint, MonthlyOverviewPoint, StatsData, TempHumidityResponse } from "../interfaces/temp-humidity";
import { calculateStats } from "./stats";

/**
 * Generates mock daily data for temperature and humidity
 */
function generateMockDailyData(): DailyOverviewPoint[] {
  return Array(24).fill(null).map((_, i) => ({
    time: `${i}:00`,
    temperature: 18 + Math.sin(i / 24 * Math.PI * 2) * 6,
    humidity: 40 + Math.sin((i / 24 * Math.PI * 2) + 1) * 15
  }));
}

/**
 * Generates mock monthly data for temperature and humidity
 */
export function generateMockMonthlyData(): MonthlyOverviewPoint[] {
  return Array(30).fill(null).map((_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (29 - i));
    const dateStr = date.toISOString().split('T')[0];
    
    // Add some randomness and a sine wave pattern
    const avgTemp = 21 + Math.sin(i / 30 * Math.PI * 2) * 3 + (Math.random() * 2 - 1);
    const minTemp = avgTemp - (2 + Math.random() * 1);
    const maxTemp = avgTemp + (2 + Math.random() * 1);
    const avgHumidity = 55 + Math.sin((i / 30 * Math.PI * 2) + 1) * 10 + (Math.random() * 5 - 2.5);
    
    return {
      date: dateStr,
      avgTemp,
      minTemp,
      maxTemp,
      avgHumidity
    };
  });
}

/**
 * Generates a complete set of mock data as a fallback
 */
export function generateMockData(): TempHumidityResponse {
  const daily = generateMockDailyData();
  const monthly = generateMockMonthlyData();
  
  return {
    stats: calculateStats(daily, monthly),
    daily,
    monthly,
    sourceData: {
      temperatureSensors: [],
      humiditySensors: []
    }
  };
}
