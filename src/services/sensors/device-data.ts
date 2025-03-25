
import { fetchSensorDataForDay } from "./daily-data";
import { fetchSensorDataForMonth } from "./monthly-data";
import { calculateStats } from "./stats";

export async function fetchRealDeviceData(
  siteId: string,
  temperatureSensors: string[],
  humiditySensors: string[],
  operatingHours: { startTime: string; endTime: string } | null = null
) {
  try {
    console.log(`Fetching real device data for site ${siteId}`);
    console.log(`Temperature sensors: ${temperatureSensors.join(', ')}`);
    console.log(`Humidity sensors: ${humiditySensors.join(', ')}`);
    console.log("Operating hours:", operatingHours);
    
    // Get the first available temperature and humidity sensor IDs
    const mainTempSensorId = temperatureSensors[0];
    const mainHumiditySensorId = humiditySensors[0];
    
    // Get today's date in YYYY-MM-DD format
    const today = new Date().toISOString().split('T')[0];
    
    // Get data for today from the daily API
    const dailyData = await fetchSensorDataForDay(
      siteId, 
      mainTempSensorId, 
      mainHumiditySensorId, 
      today,
      operatingHours
    );
    
    // Get monthly data
    const monthlyData = await fetchSensorDataForMonth(
      siteId, 
      mainTempSensorId, 
      mainHumiditySensorId,
      operatingHours
    );
    
    console.log(`Fetched ${dailyData.length} daily data points and ${monthlyData.length} monthly data points`);
    
    // Calculate stats based on the data
    const stats = calculateStats(dailyData, monthlyData);
    
    return {
      stats,
      daily: dailyData,
      monthly: monthlyData
    };
  } catch (error) {
    console.error("Error fetching real device data:", error);
    throw error;
  }
}
