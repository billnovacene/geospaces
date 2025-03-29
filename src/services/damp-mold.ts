
import { supabase } from "@/integrations/supabase/client";
import { TempHumidityResponse } from "./interfaces/temp-humidity";

export const fetchDampMoldData = async (siteId?: string, zoneId?: string): Promise<TempHumidityResponse> => {
  try {
    // Construct the base query
    let query = supabase
      .from('damp_mold_data')
      .select('*')
      .order('timestamp', { ascending: false });

    // Add filters if site or zone is provided
    if (zoneId) {
      query = query.eq('zone_id', zoneId);
    } else if (siteId) {
      query = query.eq('site_id', siteId);
    }

    // Limit to recent data
    query = query.limit(100);

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching damp mold data:', error);
      throw error;
    }

    // Transform Supabase data to match TempHumidityResponse interface
    return {
      stats: {
        avgTemp: data.reduce((sum, item) => sum + (item.temperature || 0), 0) / data.length,
        minTemp: Math.min(...data.map(item => item.temperature || 0)),
        maxTemp: Math.max(...data.map(item => item.temperature || 0)),
        avgHumidity: data.reduce((sum, item) => sum + (item.humidity || 0), 0) / data.length,
        activeSensors: data.length,
        status: {
          avgTemp: 'good',
          minTemp: 'good',
          maxTemp: 'good',
          avgHumidity: 'good'
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
      monthly: [], // This would require additional data processing
      sourceData: {
        temperatureSensors: [],
        humiditySensors: []
      }
    };
  } catch (error) {
    console.error('Failed to fetch damp mold data:', error);
    // Fallback to mock data if fetch fails
    return generateMockData();
  }
};
