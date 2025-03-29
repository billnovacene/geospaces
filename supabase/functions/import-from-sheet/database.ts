
// Database operations for importing data
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.6';
import { SHEET_URL } from "./config.ts";
import { type ProcessedData, type ImportResult } from "./types.ts";

// Create a Supabase client
export function getSupabaseClient() {
  const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? '';
  const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY') ?? '';
  return createClient(supabaseUrl, supabaseAnonKey);
}

// Import data to Supabase
export async function importToSupabase(
  processedData: ProcessedData,
  importLogId: string
): Promise<ImportResult> {
  const supabase = getSupabaseClient();
  const { projects, sites, zones, devices, sensors, sensorData } = processedData;
  
  let totalImported = 0;
  let success = true;
  let errorMessage = '';
  
  try {
    // Create import log entry
    const { error: importLogError } = await supabase
      .from('import_logs')
      .insert([
        { 
          id: importLogId,
          source: 'google_sheet',
          status: 'processing',
          metadata: { 
            sheet_url: SHEET_URL 
          }
        }
      ]);
      
    if (importLogError) throw importLogError;
    
    console.log(`Started import with log ID: ${importLogId}`);
    
    // Import projects
    if (projects.length > 0) {
      const { error: projectsError } = await supabase
        .from('projects')
        .upsert(projects, { onConflict: 'id' });
      
      if (projectsError) throw projectsError;
      totalImported += projects.length;
      console.log(`Imported ${projects.length} projects`);
    }
    
    // Import sites
    if (sites.length > 0) {
      const { error: sitesError } = await supabase
        .from('sites')
        .upsert(sites, { onConflict: 'id' });
      
      if (sitesError) throw sitesError;
      totalImported += sites.length;
      console.log(`Imported ${sites.length} sites`);
    }
    
    // Import zones
    if (zones.length > 0) {
      const { error: zonesError } = await supabase
        .from('zones')
        .upsert(zones, { onConflict: 'id' });
      
      if (zonesError) throw zonesError;
      totalImported += zones.length;
      console.log(`Imported ${zones.length} zones`);
    }
    
    // Import devices
    if (devices.length > 0) {
      const { error: devicesError } = await supabase
        .from('devices')
        .upsert(devices, { onConflict: 'id' });
      
      if (devicesError) throw devicesError;
      totalImported += devices.length;
      console.log(`Imported ${devices.length} devices`);
    }
    
    // Import sensors
    if (sensors.length > 0) {
      const { error: sensorsError } = await supabase
        .from('sensors')
        .upsert(sensors, { onConflict: 'id' });
      
      if (sensorsError) throw sensorsError;
      totalImported += sensors.length;
      console.log(`Imported ${sensors.length} sensors`);
    }
    
    // Import sensor data
    if (sensorData.length > 0) {
      // Process in batches of 1000
      const batchSize = 1000;
      for (let i = 0; i < sensorData.length; i += batchSize) {
        const batch = sensorData.slice(i, i + batchSize);
        
        const { error: sensorDataError } = await supabase
          .from('sensor_data')
          .upsert(batch, { onConflict: 'sensor_id, timestamp' });
        
        if (sensorDataError) throw sensorDataError;
        totalImported += batch.length;
        console.log(`Imported batch of ${batch.length} sensor data records`);
      }
      
      console.log(`Imported ${sensorData.length} sensor data records total`);
    }
    
  } catch (error) {
    console.error('Import error:', error);
    success = false;
    errorMessage = error.message || 'Unknown error occurred during import';
  }
  
  // Update import log
  try {
    const { error: updateLogError } = await supabase
      .from('import_logs')
      .update({
        finished_at: new Date().toISOString(),
        status: success ? 'completed' : 'failed',
        rows_imported: totalImported,
        error_message: errorMessage,
        metadata: {
          sheet_url: SHEET_URL,
          projects_count: projects.length,
          sites_count: sites.length,
          zones_count: zones.length,
          devices_count: devices.length,
          sensors_count: sensors.length,
          sensor_data_count: sensorData.length
        }
      })
      .eq('id', importLogId);
      
    if (updateLogError) {
      console.error('Error updating import log:', updateLogError);
    }
  } catch (e) {
    console.error('Failed to update import log:', e);
  }
  
  return {
    success,
    totalImported,
    counts: {
      projects: projects.length,
      sites: sites.length,
      zones: zones.length,
      devices: devices.length,
      sensors: sensors.length,
      sensorData: sensorData.length
    },
    error: errorMessage
  };
}

// Update import log to failed status
export async function markImportAsFailed(importLogId: string, errorMessage: string) {
  const supabase = getSupabaseClient();
  try {
    await supabase
      .from('import_logs')
      .update({
        finished_at: new Date().toISOString(),
        status: 'failed',
        error_message: errorMessage || 'Unknown error'
      })
      .eq('id', importLogId);
  } catch (e) {
    console.error('Failed to update import log:', e);
  }
}
