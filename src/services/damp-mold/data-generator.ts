
import { supabase } from "@/integrations/supabase/client";

/**
 * Generate and insert sample damp and mold data for testing
 * @param zoneId Zone ID to generate data for
 * @param siteId Site ID to generate data for
 * @param days Number of days of data to generate
 * @returns {Promise<boolean>} Success indicator
 */
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
