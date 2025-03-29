
import { supabase } from "@/integrations/supabase/client";
import { TempHumidityResponse } from "./interfaces/temp-humidity";

export const fetchDampMoldData = async (siteId?: string, zoneId?: string): Promise<TempHumidityResponse | null> => {
  try {
    // Construct the base query
    let query = supabase
      .from('damp_mold_data')
      .select('*')
      .order('timestamp', { ascending: false });

    // Add filters if site or zone is provided
    if (zoneId) {
      query = query.eq('zone_id', parseInt(zoneId, 10));
    } else if (siteId) {
      query = query.eq('site_id', parseInt(siteId, 10));
    }

    // Limit to recent data
    query = query.limit(100);

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching damp mold data:', error);
      throw error;
    }

    if (!data || data.length === 0) {
      console.warn('No damp mold data found for filters', { siteId, zoneId });
      return {
        stats: {
          avgTemp: 0,
          minTemp: 0,
          maxTemp: 0,
          avgHumidity: 0,
          activeSensors: 0,
          status: {
            avgTemp: 'good',
            minTemp: 'good',
            maxTemp: 'good',
            avgHumidity: 'good'
          }
        },
        daily: [],
        monthly: [],
        sourceData: {
          temperatureSensors: [],
          humiditySensors: []
        }
      };
    }

    // Calculate statistics
    const temperatures = data.map(item => item.temperature).filter(Boolean);
    const humidities = data.map(item => item.humidity).filter(Boolean);
    
    const avgTemp = temperatures.length > 0 
      ? temperatures.reduce((sum, val) => sum + val, 0) / temperatures.length 
      : 0;
    
    const minTemp = temperatures.length > 0 
      ? Math.min(...temperatures) 
      : 0;
    
    const maxTemp = temperatures.length > 0 
      ? Math.max(...temperatures) 
      : 0;
    
    const avgHumidity = humidities.length > 0 
      ? humidities.reduce((sum, val) => sum + val, 0) / humidities.length 
      : 0;

    // Determine status values
    const getTempStatus = (temp: number) => {
      if (temp < 16) return 'caution';
      if (temp > 24) return 'caution';
      return 'good';
    };

    const getHumidityStatus = (humidity: number) => {
      if (humidity > 65) return 'warning';
      if (humidity > 55) return 'caution';
      if (humidity < 35) return 'caution';
      return 'good';
    };

    // Transform Supabase data to match TempHumidityResponse interface
    return {
      stats: {
        avgTemp,
        minTemp,
        maxTemp,
        avgHumidity,
        activeSensors: data.filter(item => item.is_real).length,
        status: {
          avgTemp: getTempStatus(avgTemp),
          minTemp: getTempStatus(minTemp),
          maxTemp: getTempStatus(maxTemp),
          avgHumidity: getHumidityStatus(avgHumidity)
        }
      },
      daily: data.map(item => ({
        time: item.timestamp,
        temperature: item.temperature || 0,
        humidity: item.humidity || 0,
        isReal: { 
          temperature: item.is_real || false, 
          humidity: item.is_real || false 
        }
      })),
      monthly: generateMonthlyDataFromDaily(data),
      sourceData: {
        temperatureSensors: [],
        humiditySensors: []
      }
    };
  } catch (error) {
    console.error('Failed to fetch damp mold data:', error);
    throw error;
  }
};

// Helper function to generate monthly data from daily points
function generateMonthlyDataFromDaily(dailyData: any[]): any[] {
  if (!dailyData || dailyData.length === 0) return [];
  
  // Group data by month
  const monthlyGroups = dailyData.reduce((groups, item) => {
    const date = new Date(item.timestamp);
    const monthKey = `${date.getFullYear()}-${date.getMonth() + 1}`;
    
    if (!groups[monthKey]) {
      groups[monthKey] = [];
    }
    
    groups[monthKey].push(item);
    return groups;
  }, {});
  
  // Generate monthly data points
  return Object.entries(monthlyGroups).map(([monthKey, items]: [string, any[]]) => {
    const temps = items.map(item => item.temperature).filter(Boolean);
    const humidities = items.map(item => item.humidity).filter(Boolean);
    
    const [year, month] = monthKey.split('-').map(Number);
    const date = new Date(year, month - 1, 15);
    
    return {
      month: date.toISOString(),
      avgTemp: temps.length > 0 ? temps.reduce((sum, val) => sum + val, 0) / temps.length : 0,
      minTemp: temps.length > 0 ? Math.min(...temps) : 0,
      maxTemp: temps.length > 0 ? Math.max(...temps) : 0,
      avgHumidity: humidities.length > 0 ? humidities.reduce((sum, val) => sum + val, 0) / humidities.length : 0,
      minHumidity: humidities.length > 0 ? Math.min(...humidities) : 0,
      maxHumidity: humidities.length > 0 ? Math.max(...humidities) : 0
    };
  });
}

// Add the monthly risk data generator function
export const generateMonthlyRiskDataFromDailyData = (dailyData: any[]): any[] => {
  if (!dailyData || dailyData.length === 0) return [];
  
  // Get zones and buildings from data
  const uniqueZones = [...new Set(dailyData.map(item => item.zone_id))];
  
  // Get site info from database if available
  return uniqueZones.map((zoneId, index) => {
    // Filter data for this zone
    const zoneData = dailyData.filter(item => item.zone_id === zoneId);
    
    // Calculate temperature and humidity averages
    const temps = zoneData.map(item => item.temperature).filter(Boolean);
    const humidities = zoneData.map(item => item.humidity).filter(Boolean);
    
    const avgTemp = temps.length > 0 ? temps.reduce((sum, val) => sum + val, 0) / temps.length : 0;
    const avgHumidity = humidities.length > 0 ? humidities.reduce((sum, val) => sum + val, 0) / humidities.length : 0;
    
    // Calculate dew point: simplified formula
    const dewPoint = avgTemp - ((100 - avgHumidity) / 5);
    
    // Determine risk level based on humidity and temperature
    let overallRisk = 'Good';
    if (avgHumidity > 70 || (avgHumidity > 60 && avgTemp < 16)) {
      overallRisk = 'Alarm';
    } else if (avgHumidity > 60 || (avgHumidity > 50 && avgTemp < 18)) {
      overallRisk = 'Caution';
    }
    
    // Calculate risk hours - this would be based on how many hours had high humidity readings
    const totalHours = zoneData.length; // Assuming each data point is an hour
    const alarmsCount = zoneData.filter(item => item.humidity > 70 || (item.humidity > 60 && item.temperature < 16)).length;
    const timeAtRisk = alarmsCount;
    
    // Build the risk data object
    return {
      id: `${index + 1}`,
      building: `Building ${Math.floor(index / 3) + 1}`, // Group zones into buildings
      zone: `Zone ${zoneId}`,
      temp: avgTemp.toFixed(1),
      rh: avgHumidity.toFixed(1),
      dewPoint: dewPoint.toFixed(1),
      overallRisk,
      alarmCount: alarmsCount,
      timeAtRisk: `${timeAtRisk}`,
      comments: overallRisk === 'Alarm' ? 'Needs attention' : overallRisk === 'Caution' ? 'Monitor closely' : 'Normal operation'
    };
  });
};

// Function to generate and insert sample damp mold data for testing
export const generateAndInsertDampMoldData = async (zoneIdParam?: string, siteIdParam?: string): Promise<void> => {
  try {
    const zoneId = zoneIdParam ? parseInt(zoneIdParam, 10) : null;
    const siteId = siteIdParam ? parseInt(siteIdParam, 10) : null;
    
    if (!zoneId && !siteId) {
      throw new Error("Either zoneId or siteId must be provided");
    }
    
    // Get the zone information
    let zoneInfo;
    if (zoneId) {
      const { data, error } = await supabase
        .from('zones')
        .select('id, site_id')
        .eq('id', zoneId)
        .single();
        
      if (error) throw error;
      zoneInfo = data;
    } else {
      // Get all zones for the site
      const { data, error } = await supabase
        .from('zones')
        .select('id, site_id')
        .eq('site_id', siteId)
        .limit(1);
        
      if (error) throw error;
      if (!data || data.length === 0) {
        throw new Error(`No zones found for site ${siteId}`);
      }
      zoneInfo = data[0];
    }
    
    // Generate data points for the last 30 days, every 6 hours
    const dataPoints = [];
    const now = new Date();
    
    for (let i = 0; i < 30; i++) {
      for (let hour = 0; hour < 24; hour += 6) {
        const date = new Date(now);
        date.setDate(now.getDate() - i);
        date.setHours(hour, 0, 0, 0);
        
        // Generate slightly different values to provide variety
        const temperature = (18 + Math.random() * 7).toFixed(2);
        const humidity = (40 + Math.random() * 40).toFixed(2);
        const dewPoint = (15 + Math.random() * 5).toFixed(2);
        const surfaceTemp = (17 + Math.random() * 6).toFixed(2);
        
        // Determine risk levels based on values
        const condensationRisk = parseFloat(humidity) > 70 ? 'High' : 'Low';
        const moldRisk = parseFloat(humidity) > 65 ? 'Moderate' : 'Low';
        
        dataPoints.push({
          zone_id: zoneInfo.id,
          site_id: zoneInfo.site_id,
          timestamp: date.toISOString(),
          temperature: parseFloat(temperature),
          humidity: parseFloat(humidity),
          dew_point: parseFloat(dewPoint),
          surface_temperature: parseFloat(surfaceTemp),
          condensation_risk: condensationRisk,
          mold_risk: moldRisk,
          is_real: true
        });
      }
    }
    
    // Insert the data in batches of 100
    for (let i = 0; i < dataPoints.length; i += 100) {
      const batch = dataPoints.slice(i, i + 100);
      const { error } = await supabase
        .from('damp_mold_data')
        .insert(batch);
        
      if (error) throw error;
    }
    
    console.log(`Successfully inserted ${dataPoints.length} data points for zone ${zoneInfo.id}`);
  } catch (error) {
    console.error('Failed to generate damp mold data:', error);
    throw error;
  }
};
