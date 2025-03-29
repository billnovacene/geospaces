
import { supabase } from "@/integrations/supabase/client";
import { TempHumidityResponse, DailyOverviewPoint, StatsData } from "./interfaces/temp-humidity";
import { toast } from "sonner";
import { calculateStats } from "./sensors/stats";

// Fetch damp and mold data from Supabase
export const fetchDampMoldData = async (
  siteId?: string,
  zoneId?: string
): Promise<TempHumidityResponse | null> => {
  try {
    console.log(`Fetching damp mold data for site: ${siteId}, zone: ${zoneId}`);
    
    // Build the query based on provided parameters
    let query = supabase
      .from('damp_mold_data')
      .select('*')
      .order('timestamp', { ascending: true });
    
    // Add filter conditions if site or zone ids are provided
    if (zoneId) {
      query = query.eq('zone_id', parseInt(zoneId, 10));
    } else if (siteId) {
      query = query.eq('site_id', parseInt(siteId, 10));
    }
    
    // Execute the query
    const { data, error } = await query;
    
    if (error) {
      throw error;
    }
    
    console.log(`Fetched ${data?.length || 0} damp mold data points`);
    
    if (!data || data.length === 0) {
      return {
        daily: [],
        monthly: [],
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
        }
      };
    }
    
    // Transform the data to match the DailyOverviewPoint type
    const dailyData: DailyOverviewPoint[] = data.map(item => ({
      time: new Date(item.timestamp).toISOString(),
      temperature: item.temperature || 0,
      humidity: item.humidity || 0,
      isReal: {
        temperature: true,
        humidity: true
      }
    }));
    
    // Calculate stats from the data
    const statsData: StatsData = calculateStats(dailyData, []);
    
    // Format the data for the response
    return {
      daily: dailyData,
      monthly: [],
      stats: statsData
    };
  } catch (error) {
    console.error("Error fetching damp mold data:", error);
    throw error;
  }
};

// Generate and insert sample damp and mold data for testing
export const generateAndInsertDampMoldData = async (
  zoneId?: string,
  siteId?: string,
  days: number = 30
): Promise<boolean> => {
  try {
    if (!zoneId && !siteId) {
      throw new Error("Either zoneId or siteId must be provided");
    }
    
    console.log(`Generating ${days} days of damp mold data for site: ${siteId}, zone: ${zoneId}`);
    
    // Delete existing data for this zone/site to avoid duplication
    let deleteQuery = supabase.from('damp_mold_data').delete();
    if (zoneId) {
      deleteQuery = deleteQuery.eq('zone_id', parseInt(zoneId, 10));
    } else if (siteId) {
      deleteQuery = deleteQuery.eq('site_id', parseInt(siteId, 10));
    }
    
    await deleteQuery;
    
    // Generate sample data points
    const dataPoints = [];
    const today = new Date();
    
    for (let i = days; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      
      // Generate multiple entries per day
      for (let hour = 0; hour < 24; hour += 4) {
        date.setHours(hour);
        
        // Base values with some randomness
        const baseTemp = 18 + (Math.sin(hour / 5) * 3); // Temperature varies during the day
        const baseRH = 60 + (Math.cos(hour / 6) * 10); // Humidity varies during the day
        
        // Add random fluctuations
        const temp = baseTemp + (Math.random() * 4 - 2); // ±2°C random variation
        const humidity = baseRH + (Math.random() * 15 - 7.5); // ±7.5% random variation
        
        // Occasionally create high-risk conditions
        const isRiskDay = Math.random() < 0.2; // 20% chance for a risk day
        const riskAdjustment = isRiskDay ? 15 : 0; // Increase humidity for risk days
        
        dataPoints.push({
          zone_id: zoneId ? parseInt(zoneId, 10) : null,
          site_id: siteId ? parseInt(siteId, 10) : null,
          timestamp: date.toISOString(),
          temperature: parseFloat(temp.toFixed(1)),
          humidity: parseFloat((humidity + riskAdjustment).toFixed(1)),
          pressure: parseFloat((1013 + (Math.random() * 10 - 5)).toFixed(1)),
          dewpoint: parseFloat((temp - ((100 - humidity) / 5)).toFixed(1)),
          voc: Math.floor(Math.random() * 500),
          co2: Math.floor(800 + Math.random() * 600)
        });
      }
    }
    
    // Insert data in chunks to avoid payload size limits
    const chunkSize = 100;
    for (let i = 0; i < dataPoints.length; i += chunkSize) {
      const chunk = dataPoints.slice(i, i + chunkSize);
      const { error } = await supabase.from('damp_mold_data').insert(chunk);
      
      if (error) {
        console.error("Error inserting data chunk:", error);
        throw error;
      }
    }
    
    console.log(`Successfully inserted ${dataPoints.length} damp mold data points`);
    return true;
  } catch (error) {
    console.error("Error generating damp mold data:", error);
    throw error;
  }
};

export const generateMonthlyRiskDataFromDailyData = (dailyData: any[]): any[] => {
  if (!dailyData || dailyData.length === 0) return [];
  
  // Group data by zone and month
  const monthlyGroupedData = dailyData.reduce((groups, item) => {
    const date = new Date(item.timestamp || item.time);
    const monthKey = `${date.getFullYear()}-${date.getMonth() + 1}`;
    const zoneKey = item.zone_id || 'undefined';
    
    if (!groups[monthKey]) groups[monthKey] = {};
    if (!groups[monthKey][zoneKey]) groups[monthKey][zoneKey] = [];
    
    groups[monthKey][zoneKey].push(item);
    return groups;
  }, {});

  // Process monthly grouped data
  const monthlyRiskData = Object.entries(monthlyGroupedData).flatMap(([monthKey, zoneData]) => {
    return Object.entries(zoneData).map(([zoneId, zoneItems]) => {
      const temps = zoneItems.map(item => item.temperature).filter(Boolean);
      const humidities = zoneItems.map(item => item.humidity).filter(Boolean);
      
      const avgTemp = temps.length > 0 
        ? temps.reduce((sum, val) => sum + val, 0) / temps.length 
        : 0;
      const avgHumidity = humidities.length > 0 
        ? humidities.reduce((sum, val) => sum + val, 0) / humidities.length 
        : 0;
      
      // Calculate dew point: simplified formula
      const dewPoint = avgTemp - ((100 - avgHumidity) / 5);
      
      // Determine risk level
      let overallRisk = 'Good';
      const riskScore = 
        (avgHumidity > 70 ? 2 : avgHumidity > 60 ? 1 : 0) +
        (avgTemp < 16 ? 1 : 0);
      
      if (riskScore > 2) overallRisk = 'Alarm';
      else if (riskScore > 1) overallRisk = 'Caution';
      
      const alarmsCount = zoneItems.filter(item => 
        item.humidity > 70 || (item.humidity > 60 && item.temperature < 16)
      ).length;
      
      return {
        id: `${monthKey}-${zoneId}`,
        building: `Building ${Math.floor(Number(zoneId) / 3) + 1}`,
        zone: zoneId === 'undefined' ? 'Undefined Zone' : `Zone ${zoneId}`,
        temp: avgTemp.toFixed(1),
        rh: avgHumidity.toFixed(1),
        dewPoint: dewPoint.toFixed(1),
        overallRisk,
        alarmCount: alarmsCount,
        timeAtRisk: `${alarmsCount}`,
        comments: overallRisk === 'Alarm' ? 'Needs attention' : 
                  overallRisk === 'Caution' ? 'Monitor closely' : 'Normal operation'
      };
    });
  }).flat();

  return monthlyRiskData;
};
