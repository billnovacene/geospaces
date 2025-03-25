
import { MonthlyOverviewPoint } from "../interfaces/temp-humidity";

/**
 * Generates mock monthly data for temperature and humidity
 * when real data cannot be fetched from the API
 * 
 * @returns An array of 30 daily data points with generated temperature and humidity values
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
