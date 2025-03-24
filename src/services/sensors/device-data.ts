
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
    if (temperatureSensors.length === 0 && humiditySensors.length === 0) {
      throw new Error(`No temperature or humidity sensors found for site ${siteId}`);
    }
    
    // Get data for the last 30 days for monthly view
    const today = new Date();
    
    // Select the first available sensor of each type
    const tempSensor = temperatureSensors.length > 0 ? temperatureSensors[0] : undefined;
    const humiditySensor = humiditySensors.length > 0 ? humiditySensors[0] : undefined;
    
    console.log(`Using temperature sensor: ${tempSensor}, humidity sensor: ${humiditySensor}`);
    
    // Fetch daily data (today)
    const dailyData = await fetchSensorDataForDay(
      siteId,
      tempSensor,
      humiditySensor,
      format(today, 'yyyy-MM-dd')
    );
    
    // Fetch last 30 days of data for monthly view
    const monthlyData = await fetchMonthlyData(siteId, tempSensor, humiditySensor);
    
    // Calculate statistics
    const stats = calculateStats(dailyData, monthlyData);
    
    return {
      stats,
      daily: dailyData,
      monthly: monthlyData,
      sourceData: {
        temperatureSensors: [],  // This will be populated by the calling function
        humiditySensors: []      // This will be populated by the calling function
      }
    };
  } catch (error) {
    console.error('Error fetching real device data:', error);
    throw error;
  }
}
