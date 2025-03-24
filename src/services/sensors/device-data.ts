
import { format } from "date-fns";
import { TempHumidityResponse } from "../interfaces/temp-humidity";
import { fetchSensorDataForDay } from "./daily-data";
import { fetchMonthlyData } from "./monthly-data";
import { calculateStats } from "./stats";

export async function fetchRealDeviceData(siteId: string, 
  temperatureSensors: string[],
  humiditySensors: string[]
): Promise<TempHumidityResponse> {
  try {
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
