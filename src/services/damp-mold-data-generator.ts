
import { supabase } from "@/integrations/supabase/client";

// Function to generate and insert mock damp mold data
export const generateAndInsertDampMoldData = async (zoneId?: string, siteId?: string) => {
  // Generate some mock data points
  const dataPoints = Array.from({ length: 50 }, (_, i) => ({
    zone_id: zoneId ? Number(zoneId) : null,
    site_id: siteId ? Number(siteId) : null,
    timestamp: new Date(Date.now() - i * 24 * 60 * 60 * 1000).toISOString(),
    temperature: 18 + Math.random() * 6, // between 18 and 24
    humidity: 50 + Math.random() * 30, // between 50 and 80
    dew_point: 12 + Math.random() * 5, // between 12 and 17
    surface_temperature: 16 + Math.random() * 4, // between 16 and 20
    condensation_risk: Math.random() > 0.7 ? 'High' : 'Low',
    mold_risk: Math.random() > 0.6 ? 'Moderate' : 'Low',
    is_real: Math.random() > 0.2 // 80% chance of being real data
  }));

  // Insert the data points
  const { data, error } = await supabase
    .from('damp_mold_data')
    .insert(dataPoints);

  if (error) {
    console.error('Error inserting damp mold data:', error);
  } else {
    console.log(`Inserted ${dataPoints.length} damp mold data points`);
  }
};
