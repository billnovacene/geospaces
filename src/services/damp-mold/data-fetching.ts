
import { supabase } from "@/integrations/supabase/client";
import { TempHumidityResponse, DailyOverviewPoint, StatsData } from "../interfaces/temp-humidity";
import { calculateStats } from "../sensors/stats";

/**
 * Fetch damp and mold data from Supabase
 * @param siteId Site ID to fetch data for
 * @param zoneId Zone ID to fetch data for
 * @returns {Promise<TempHumidityResponse | null>} Temperature and humidity data
 */
export const fetchDampMoldData = async (
  siteId?: string,
  zoneId?: string
): Promise<TempHumidityResponse | null> => {
  try {
    console.log(`Fetching damp mold data for site: ${siteId}, zone: ${zoneId}`);
    
    // Build the query based on provided parameters
    let query = supabase
      .from('damp_mold_data')
      .select('*, sites:site_id(name), zones:zone_id(name)')
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
    
    console.log(`Fetched ${data?.length || 0} damp mold data points with site and zone info:`, data);
    
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
      },
      // Include site and zone information
      siteId: item.site_id,
      zoneId: item.zone_id,
      siteName: item.sites?.name || `Building ${item.site_id}`,
      zoneName: item.zones?.name || `Zone ${item.zone_id}`
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
