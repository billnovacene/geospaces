
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
    console.log(`🔍 Fetching real device data for site ${siteId}`);
    console.log(`🌡️ Temperature sensors: ${temperatureSensors.join(', ')}`);
    console.log(`💧 Humidity sensors: ${humiditySensors.join(', ')}`);
    console.log("⏰ Operating hours:", operatingHours);
    
    // Default to 7am to 7pm if no operating hours provided
    const workingHours = operatingHours || { startTime: "07:00", endTime: "19:00" };
    console.log("⏰ Using working hours:", workingHours);
    
    // Get the first available temperature and humidity sensor IDs
    const mainTempSensorId = temperatureSensors[0];
    const mainHumiditySensorId = humiditySensors[0];
    
    // Get today's date in YYYY-MM-DD format
    const today = new Date().toISOString().split('T')[0];
    
    console.log(`📅 Fetching data for today: ${today}`);
    
    // Performance monitoring
    console.time('dailyDataFetch');
    
    // Get data for today from the daily API
    const dailyData = await fetchSensorDataForDay(
      siteId, 
      mainTempSensorId, 
      mainHumiditySensorId, 
      today,
      workingHours
    );
    
    console.timeEnd('dailyDataFetch');
    console.log(`📅 Daily data fetched: ${dailyData.length} points`);
    
    // Calculate stats based on daily data first
    console.time('statsCalculation');
    const prelimStats = calculateStats(dailyData, []);
    console.timeEnd('statsCalculation');
    
    console.log(`📊 Calculated preliminary stats`);
    
    // Now fetch monthly data (potentially in parallel or after showing initial UI)
    console.time('monthlyDataFetch');
    console.log(`📅 Fetching monthly data...`);
    
    // Get monthly data
    const monthlyData = await fetchSensorDataForMonth(
      siteId, 
      mainTempSensorId, 
      mainHumiditySensorId,
      workingHours
    );
    
    console.timeEnd('monthlyDataFetch');
    console.log(`📅 Monthly data fetched: ${monthlyData.length} points`);
    
    // Recalculate stats with both daily and monthly data
    console.time('finalStatsCalculation');
    const stats = calculateStats(dailyData, monthlyData);
    console.timeEnd('finalStatsCalculation');
    
    console.log(`📊 Calculated final stats with both daily and monthly data`);
    
    console.log(`✅ Fetched ${dailyData.length} daily data points and ${monthlyData.length} monthly data points`);
    
    return {
      stats,
      daily: dailyData,
      monthly: monthlyData,
      operatingHours: workingHours
    };
  } catch (error) {
    console.error("❌ Error fetching real device data:", error);
    throw error;
  }
}
