
import { corsHeaders, SHEET_URL } from "./config.ts";
import { parseCSV, processData } from "./parser.ts";
import { importToSupabase, markImportAsFailed } from "./database.ts";

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
    const processedData = processData(rows);
    
    console.log(`Processed data summary:
      - Projects: ${processedData.projects.length}
      - Sites: ${processedData.sites.length}
      - Zones: ${processedData.zones.length}
      - Devices: ${processedData.devices.length}
      - Sensors: ${processedData.sensors.length}
      - Sensor Data: ${processedData.sensorData.length}
    `);
    
    // Import data to Supabase
    const result = await importToSupabase(processedData, importLogId);
    
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
    await markImportAsFailed(importLogId, error.message || 'Unknown error');
    
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
