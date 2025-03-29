
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.6'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// Google Sheet URL
const SHEET_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vTtyaaD9UIdtuhO9BW1q6Mb4-26_jsidDU73HB1DE4Y8FE1tKSQxIAkLasrc3bT-0mvDy4ejjgTPJm1/pub?output=csv";

// Create a Supabase client
const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? '';
const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY') ?? '';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Define row types based on our data structure
interface ProjectRow {
  id: number;
  name: string;
  customer_id?: number;
  description?: string;
  status?: string;
}

interface SiteRow {
  id: number;
  name: string;
  project_id: number;
  address?: string;
  description?: string;
  status?: string;
  location_text?: string;
}

interface ZoneRow {
  id: number;
  name: string;
  site_id: number;
  parent_id?: number;
  description?: string;
  type?: string;
  status?: string;
  area?: number;
}

interface DeviceRow {
  id: number;
  name: string;
  zone_id?: number;
  site_id?: number;
  project_id?: number;
  type?: string;
  type_id?: number;
  status?: string;
  model_id?: string;
}

interface SensorRow {
  id: string;
  name: string;
  device_id: number;
  type?: string;
  unit?: string;
}

interface SensorDataRow {
  sensor_id: string;
  timestamp: string;
  value: number;
  is_real?: boolean;
}

// Parse CSV data
async function parseCSV(csvData: string) {
  const lines = csvData.split('\n');
  const headers = lines[0].split(',').map(header => header.trim());
  
  const rows = [];
  for (let i = 1; i < lines.length; i++) {
    if (!lines[i].trim()) continue;
    
    const values = lines[i].split(',');
    const row: Record<string, string> = {};
    
    for (let j = 0; j < headers.length; j++) {
      row[headers[j]] = values[j]?.trim() || '';
    }
    
    rows.push(row);
  }
  
  return { headers, rows };
}

// Process the data and organize by entity type
function processData(data: Record<string, string>[]) {
  const projects: ProjectRow[] = [];
  const sites: SiteRow[] = [];
  const zones: ZoneRow[] = [];
  const devices: DeviceRow[] = [];
  const sensors: SensorRow[] = [];
  const sensorData: SensorDataRow[] = [];
  
  // Tracking sets to avoid duplicates
  const projectIds = new Set<number>();
  const siteIds = new Set<number>();
  const zoneIds = new Set<number>();
  const deviceIds = new Set<number>();
  const sensorIds = new Set<string>();
  
  for (const row of data) {
    // Check the type of entity in this row
    const entityType = row.entity_type?.toLowerCase();
    
    if (entityType === 'project' && row.id) {
      const projectId = parseInt(row.id);
      if (!projectIds.has(projectId) && !isNaN(projectId)) {
        projectIds.add(projectId);
        projects.push({
          id: projectId,
          name: row.name || `Project ${projectId}`,
          customer_id: row.customer_id ? parseInt(row.customer_id) : undefined,
          description: row.description,
          status: row.status || 'Active'
        });
      }
    } 
    else if (entityType === 'site' && row.id) {
      const siteId = parseInt(row.id);
      const projectId = parseInt(row.project_id || '0');
      
      if (!siteIds.has(siteId) && !isNaN(siteId) && !isNaN(projectId)) {
        siteIds.add(siteId);
        sites.push({
          id: siteId,
          name: row.name || `Site ${siteId}`,
          project_id: projectId,
          address: row.address,
          description: row.description,
          status: row.status || 'Active',
          location_text: row.location_text
        });
      }
    } 
    else if (entityType === 'zone' && row.id) {
      const zoneId = parseInt(row.id);
      const siteId = parseInt(row.site_id || '0');
      
      if (!zoneIds.has(zoneId) && !isNaN(zoneId) && !isNaN(siteId)) {
        zoneIds.add(zoneId);
        zones.push({
          id: zoneId,
          name: row.name || `Zone ${zoneId}`,
          site_id: siteId,
          parent_id: row.parent_id ? parseInt(row.parent_id) : undefined,
          description: row.description,
          type: row.type,
          status: row.status || 'Active',
          area: row.area ? parseFloat(row.area) : undefined
        });
      }
    } 
    else if (entityType === 'device' && row.id) {
      const deviceId = parseInt(row.id);
      
      if (!deviceIds.has(deviceId) && !isNaN(deviceId)) {
        deviceIds.add(deviceId);
        devices.push({
          id: deviceId,
          name: row.name || `Device ${deviceId}`,
          zone_id: row.zone_id ? parseInt(row.zone_id) : undefined,
          site_id: row.site_id ? parseInt(row.site_id) : undefined,
          project_id: row.project_id ? parseInt(row.project_id) : undefined,
          type: row.type,
          type_id: row.type_id ? parseInt(row.type_id) : undefined,
          status: row.status || 'Active',
          model_id: row.model_id
        });
      }
    } 
    else if (entityType === 'sensor' && row.id) {
      const sensorId = row.id;
      const deviceId = parseInt(row.device_id || '0');
      
      if (!sensorIds.has(sensorId) && !isNaN(deviceId)) {
        sensorIds.add(sensorId);
        sensors.push({
          id: sensorId,
          name: row.name || `Sensor ${sensorId}`,
          device_id: deviceId,
          type: row.type,
          unit: row.unit
        });
      }
    } 
    else if (entityType === 'sensor_data' && row.sensor_id) {
      const sensorId = row.sensor_id;
      const timestamp = row.timestamp;
      const value = parseFloat(row.value || '0');
      
      if (sensorId && timestamp && !isNaN(value)) {
        sensorData.push({
          sensor_id: sensorId,
          timestamp: timestamp,
          value: value,
          is_real: row.is_real === 'true' || row.is_real === '1'
        });
      }
    }
  }
  
  return {
    projects,
    sites,
    zones,
    devices,
    sensors,
    sensorData
  };
}

// Import data to Supabase
async function importToSupabase(
  projects: ProjectRow[],
  sites: SiteRow[],
  zones: ZoneRow[],
  devices: DeviceRow[],
  sensors: SensorRow[],
  sensorData: SensorDataRow[],
  importLogId: string
) {
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
      
      console.log(`Imported ${sensorData.length} sensor data records`);
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

// Main handler
Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }
  
  // Only allow POST requests
  if (req.method !== 'POST') {
    return new Response(
      JSON.stringify({ error: 'Method not allowed' }),
      { status: 405, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
  
  // Generate a unique ID for this import
  const importLogId = crypto.randomUUID();
  
  try {
    console.log(`Starting import from Google Sheet: ${SHEET_URL}`);
    
    // Fetch the CSV data from Google Sheets
    const response = await fetch(SHEET_URL);
    if (!response.ok) {
      throw new Error(`Failed to fetch Google Sheet: ${response.status} ${response.statusText}`);
    }
    
    const csvData = await response.text();
    console.log(`Fetched ${csvData.length} bytes of CSV data`);
    
    // Parse the CSV data
    const { rows } = await parseCSV(csvData);
    console.log(`Parsed ${rows.length} rows from CSV`);
    
    // Process the data
    const {
      projects,
      sites,
      zones,
      devices,
      sensors,
      sensorData
    } = processData(rows);
    
    console.log(`Processed data summary:
      - Projects: ${projects.length}
      - Sites: ${sites.length}
      - Zones: ${zones.length}
      - Devices: ${devices.length}
      - Sensors: ${sensors.length}
      - Sensor Data: ${sensorData.length}
    `);
    
    // Import data to Supabase
    const result = await importToSupabase(
      projects,
      sites,
      zones,
      devices,
      sensors,
      sensorData,
      importLogId
    );
    
    return new Response(
      JSON.stringify({ 
        success: result.success,
        import_id: importLogId,
        counts: result.counts,
        total_imported: result.totalImported
      }),
      { 
        status: result.success ? 200 : 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
    
  } catch (error) {
    console.error('Error in import function:', error);
    
    // Update import log to failed status
    try {
      await supabase
        .from('import_logs')
        .update({
          finished_at: new Date().toISOString(),
          status: 'failed',
          error_message: error.message || 'Unknown error'
        })
        .eq('id', importLogId);
    } catch (e) {
      console.error('Failed to update import log:', e);
    }
    
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message || 'Unknown error occurred',
        import_id: importLogId
      }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});
