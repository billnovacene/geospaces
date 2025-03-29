
import { ProcessedData, ImportResult } from "./types.ts";
import { corsHeaders } from "./config.ts";

// Supabase client for the Edge function
const supabaseClient = Deno.env.get('SUPABASE_URL') && Deno.env.get('SUPABASE_ANON_KEY') 
  ? {
    url: Deno.env.get('SUPABASE_URL')!,
    key: Deno.env.get('SUPABASE_ANON_KEY')!
  }
  : {
    url: 'https://byankhnmqnewhdcvsoyz.supabase.co',
    key: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ5YW5raG5tcW5ld2hkY3Zzb3l6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDI4NTg5ODAsImV4cCI6MjA1ODQzNDk4MH0.T4i1-ofCC1Tjm9TAklo5xdj77ggrsXqNBv3GtPwsOm0'
  };

// Import data to Supabase
export async function importToSupabase(data: ProcessedData, importLogId: string): Promise<ImportResult> {
  const URL = supabaseClient.url;
  const KEY = supabaseClient.key;
  
  let totalImported = 0;
  let counts = {
    projects: 0,
    sites: 0,
    zones: 0,
    devices: 0,
    sensors: 0,
    sensorData: 0
  };
  
  try {
    // Create import log entry
    await fetch(`${URL}/rest/v1/import_logs`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': KEY,
        'Authorization': `Bearer ${KEY}`,
        ...corsHeaders
      },
      body: JSON.stringify({
        id: importLogId,
        source: 'google_sheet',
        status: 'processing',
        rows_imported: 0
      })
    });
    
    // Import projects
    if (data.projects.length > 0) {
      const projectsResponse = await fetch(`${URL}/rest/v1/projects`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': KEY,
          'Authorization': `Bearer ${KEY}`,
          'Prefer': 'resolution=merge-duplicates',
          ...corsHeaders
        },
        body: JSON.stringify(data.projects)
      });
      
      if (!projectsResponse.ok) {
        throw new Error(`Failed to import projects: ${projectsResponse.status} ${projectsResponse.statusText}`);
      }
      
      counts.projects = data.projects.length;
      totalImported += data.projects.length;
      console.log(`Imported ${data.projects.length} projects`);
    }
    
    // Import sites
    if (data.sites.length > 0) {
      const sitesResponse = await fetch(`${URL}/rest/v1/sites`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': KEY,
          'Authorization': `Bearer ${KEY}`,
          'Prefer': 'resolution=merge-duplicates',
          ...corsHeaders
        },
        body: JSON.stringify(data.sites)
      });
      
      if (!sitesResponse.ok) {
        throw new Error(`Failed to import sites: ${sitesResponse.status} ${sitesResponse.statusText}`);
      }
      
      counts.sites = data.sites.length;
      totalImported += data.sites.length;
      console.log(`Imported ${data.sites.length} sites`);
    }
    
    // Import zones
    if (data.zones.length > 0) {
      const zonesResponse = await fetch(`${URL}/rest/v1/zones`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': KEY,
          'Authorization': `Bearer ${KEY}`,
          'Prefer': 'resolution=merge-duplicates',
          ...corsHeaders
        },
        body: JSON.stringify(data.zones)
      });
      
      if (!zonesResponse.ok) {
        throw new Error(`Failed to import zones: ${zonesResponse.status} ${zonesResponse.statusText}`);
      }
      
      counts.zones = data.zones.length;
      totalImported += data.zones.length;
      console.log(`Imported ${data.zones.length} zones`);
    }
    
    // Import devices
    if (data.devices.length > 0) {
      const devicesResponse = await fetch(`${URL}/rest/v1/devices`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': KEY,
          'Authorization': `Bearer ${KEY}`,
          'Prefer': 'resolution=merge-duplicates',
          ...corsHeaders
        },
        body: JSON.stringify(data.devices)
      });
      
      if (!devicesResponse.ok) {
        throw new Error(`Failed to import devices: ${devicesResponse.status} ${devicesResponse.statusText}`);
      }
      
      counts.devices = data.devices.length;
      totalImported += data.devices.length;
      console.log(`Imported ${data.devices.length} devices`);
    }
    
    // Import sensors
    if (data.sensors.length > 0) {
      const sensorsResponse = await fetch(`${URL}/rest/v1/sensors`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': KEY,
          'Authorization': `Bearer ${KEY}`,
          'Prefer': 'resolution=merge-duplicates',
          ...corsHeaders
        },
        body: JSON.stringify(data.sensors)
      });
      
      if (!sensorsResponse.ok) {
        throw new Error(`Failed to import sensors: ${sensorsResponse.status} ${sensorsResponse.statusText}`);
      }
      
      counts.sensors = data.sensors.length;
      totalImported += data.sensors.length;
      console.log(`Imported ${data.sensors.length} sensors`);
    }
    
    // Import sensor data
    if (data.sensorData.length > 0) {
      const sensorDataResponse = await fetch(`${URL}/rest/v1/sensor_data`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': KEY,
          'Authorization': `Bearer ${KEY}`,
          'Prefer': 'resolution=merge-duplicates',
          ...corsHeaders
        },
        body: JSON.stringify(data.sensorData)
      });
      
      if (!sensorDataResponse.ok) {
        throw new Error(`Failed to import sensor data: ${sensorDataResponse.status} ${sensorDataResponse.statusText}`);
      }
      
      counts.sensorData = data.sensorData.length;
      totalImported += data.sensorData.length;
      console.log(`Imported ${data.sensorData.length} sensor data records`);
    }
    
    // Update import log entry with successful status
    await fetch(`${URL}/rest/v1/import_logs`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'apikey': KEY,
        'Authorization': `Bearer ${KEY}`,
        ...corsHeaders
      },
      body: JSON.stringify({
        id: importLogId,
        finished_at: new Date().toISOString(),
        status: 'completed',
        rows_imported: totalImported,
        metadata: { counts }
      })
    });
    
    return {
      success: true,
      totalImported,
      counts,
      error: ''
    };
    
  } catch (error) {
    console.error('Error in importToSupabase:', error);
    return {
      success: false,
      totalImported,
      counts,
      error: error.message || 'Unknown error'
    };
  }
}

// Mark import as failed in the database
export async function markImportAsFailed(importLogId: string, errorMessage: string) {
  try {
    const URL = supabaseClient.url;
    const KEY = supabaseClient.key;
    
    await fetch(`${URL}/rest/v1/import_logs`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'apikey': KEY,
        'Authorization': `Bearer ${KEY}`,
        ...corsHeaders
      },
      body: JSON.stringify({
        id: importLogId,
        finished_at: new Date().toISOString(),
        status: 'failed',
        error_message: errorMessage
      })
    });
    
    console.log(`Marked import ${importLogId} as failed: ${errorMessage}`);
  } catch (updateError) {
    console.error('Failed to update import log status:', updateError);
  }
}
