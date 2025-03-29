
import { ProcessedData, ProjectRow, SiteRow, ZoneRow, DeviceRow, SensorRow, SensorDataRow } from "./types.ts";

// Parse CSV data into rows
export async function parseCSV(csvData: string) {
  const rows: string[][] = [];
  
  // Simple CSV parsing
  const lines = csvData.split('\n');
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (line) {
      // Split by comma, handling quoted fields properly
      const row: string[] = [];
      let field = '';
      let inQuotes = false;
      
      for (let j = 0; j < line.length; j++) {
        const char = line[j];
        
        if (char === '"') {
          inQuotes = !inQuotes;
        } else if (char === ',' && !inQuotes) {
          row.push(field.trim());
          field = '';
        } else {
          field += char;
        }
      }
      
      // Add the last field
      row.push(field.trim());
      rows.push(row);
    }
  }
  
  console.log(`Parsed ${rows.length} rows from CSV`);
  return { rows };
}

// Process parsed CSV data into structured objects
export function processData(rows: string[][]): ProcessedData {
  // Initialize result containers
  const projects: ProjectRow[] = [];
  const sites: SiteRow[] = [];
  const zones: ZoneRow[] = [];
  const devices: DeviceRow[] = [];
  const sensors: SensorRow[] = [];
  const sensorData: SensorDataRow[] = [];
  
  // Skip header row and process data rows
  if (rows.length > 0) {
    const headerRow = rows[0];
    console.log("CSV Headers:", headerRow.join(", "));
    
    // Validate the CSV format has the necessary columns
    if (headerRow.length < 5) {
      throw new Error("CSV does not have enough columns. Expected at least: projectId, projectName, siteId, siteName, etc.");
    }
  }
  
  // Process each data row
  for (let i = 1; i < rows.length; i++) {
    const row = rows[i];
    
    // Skip rows that don't have enough data
    if (row.length < 5) {
      console.log(`Skipping row ${i} - not enough columns:`, row);
      continue;
    }
    
    // Extract values from row (with explicit null/undefined handling)
    const [
      projectId = "", projectName = "", 
      siteId = "", siteName = "", siteAddress = "",
      zoneId = "", zoneName = "", zoneType = "",
      deviceId = "", deviceName = "", deviceType = "",
      sensorId = "", sensorName = "", sensorType = "", sensorUnit = "",
      timestamp = "", value = ""
    ] = row.map(cell => cell.trim());
    
    // Validate required IDs
    if (!projectId || !siteId) {
      console.log(`Skipping row ${i} - missing required IDs:`, row);
      continue;
    }
    
    // Add project if not already added and ID is valid
    if (projectId && projectName && !isNaN(Number(projectId)) && !projects.some(p => p.id === Number(projectId))) {
      projects.push({
        id: Number(projectId),
        name: projectName,
        description: `Imported project: ${projectName}`,
        status: 'Active'
      });
    }
    
    // Add site if not already added and IDs are valid
    if (siteId && siteName && !isNaN(Number(siteId)) && !isNaN(Number(projectId)) && 
        !sites.some(s => s.id === Number(siteId))) {
      sites.push({
        id: Number(siteId),
        name: siteName,
        project_id: Number(projectId),
        address: siteAddress || undefined,
        description: `Imported site: ${siteName}`,
        status: 'Active'
      });
    }
    
    // Add zone if not already added and IDs are valid
    if (zoneId && zoneName && !isNaN(Number(zoneId)) && !isNaN(Number(siteId)) && 
        !zones.some(z => z.id === Number(zoneId))) {
      const cleanZoneType = zoneType ? String(zoneType).replace(/['"]/g, '') : undefined;
      
      zones.push({
        id: Number(zoneId),
        name: zoneName,
        site_id: Number(siteId),
        type: cleanZoneType,
        description: `Imported zone: ${zoneName}`,
        status: 'Active'
      });
    }
    
    // Add device if not already added and IDs are valid
    if (deviceId && deviceName && !isNaN(Number(deviceId)) && !isNaN(Number(zoneId)) && 
        !devices.some(d => d.id === Number(deviceId))) {
      const cleanDeviceType = deviceType ? String(deviceType).replace(/['"]/g, '') : undefined;
      
      devices.push({
        id: Number(deviceId),
        name: deviceName,
        zone_id: Number(zoneId),
        site_id: Number(siteId),
        project_id: Number(projectId),
        type: cleanDeviceType,
        status: 'Active'
      });
    }
    
    // Add sensor if not already added
    if (sensorId && sensorName && !isNaN(Number(deviceId)) && 
        !sensors.some(s => s.id === sensorId)) {
      const cleanSensorType = sensorType ? String(sensorType).replace(/['"]/g, '') : undefined;
      const cleanSensorUnit = sensorUnit ? String(sensorUnit).replace(/['"]/g, '') : undefined;
      
      sensors.push({
        id: sensorId,
        name: sensorName,
        device_id: Number(deviceId),
        type: cleanSensorType,
        unit: cleanSensorUnit
      });
    }
    
    // Add sensor data if we have all required fields
    if (sensorId && timestamp && value && !isNaN(Number(value))) {
      sensorData.push({
        sensor_id: sensorId,
        timestamp: timestamp,
        value: Number(value),
        is_real: true
      });
    }
  }
  
  // Log summary of processed data
  console.log(`Processed data summary:
      - Projects: ${projects.length}
      - Sites: ${sites.length}
      - Zones: ${zones.length}
      - Devices: ${devices.length}
      - Sensors: ${sensors.length}
      - Sensor Data: ${sensorData.length}
    `);
  
  return {
    projects,
    sites,
    zones,
    devices,
    sensors,
    sensorData
  };
}
