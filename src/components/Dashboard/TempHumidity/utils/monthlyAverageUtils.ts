
import { DailyOverviewPoint, MonthlyOverviewPoint } from "@/services/interfaces/temp-humidity";

/**
 * Calculates hourly averages from monthly data points
 * Used when real-time daily data is not available
 */
export function calculateHourlyAveragesFromMonth(monthlyData: MonthlyOverviewPoint[]): DailyOverviewPoint[] {
  // Create a template for 24 hours
  const hourlyAverages: DailyOverviewPoint[] = Array(24).fill(null).map((_, i) => ({
    time: `${i}:00`,
    temperature: 0,
    humidity: 0,
    isReal: {
      temperature: false,
      humidity: false
    }
  }));
  
  if (!monthlyData || monthlyData.length === 0) {
    return hourlyAverages.map(hour => ({
      ...hour,
      temperature: null,
      humidity: null,
    }));
  }
  
  // Generate a synthetic daily curve based on monthly averages
  // The curve simulates the temperature rising during the day and falling at night
  const avgMonthlyTemp = monthlyData.reduce((sum, day) => sum + day.avgTemp, 0) / monthlyData.length;
  const avgMonthlyHumidity = monthlyData.reduce((sum, day) => sum + day.avgHumidity, 0) / monthlyData.length;
  
  // Calculate min and max from the month data
  const minTemp = Math.min(...monthlyData.map(d => d.minTemp));
  const maxTemp = Math.max(...monthlyData.map(d => d.maxTemp));
  const tempRange = maxTemp - minTemp;
  
  // Create a realistic daily curve for temperature and humidity
  return hourlyAverages.map((hour, i) => {
    // Calculate a value between 0 and 1 for the current hour's position in daily cycle
    // Lowest point around 4am, highest around 2pm
    const hourFactor = Math.sin(((i - 4 + 24) % 24) / 24 * Math.PI);
    
    // Scale the factor to the temperature range from the month
    const hourlyTemp = avgMonthlyTemp + (hourFactor * (tempRange / 2.5));
    
    // Humidity is generally inverse to temperature
    const hourlyHumidity = avgMonthlyHumidity - (hourFactor * 10);
    
    return {
      time: hour.time,
      temperature: parseFloat(hourlyTemp.toFixed(1)),
      humidity: parseFloat(hourlyHumidity.toFixed(1)),
      isReal: {
        temperature: false,
        humidity: false
      }
    };
  });
}
