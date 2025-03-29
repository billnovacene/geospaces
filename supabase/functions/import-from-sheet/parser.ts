
import { ProcessedData, ProjectRow, SiteRow, ZoneRow, DeviceRow, SensorRow, SensorDataRow } from "./types.ts";

// Parse CSV data into rows
export async function parseCSV(csvData: string) {
  const rows: string[][] = [];
  
  // Simple CSV parsing
  const lines = csvData.split('\n');
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (line) {
      // Split by comma, handling quoted fields
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
  for (let i = 1; i < rows.length; i++) {
    const row = rows[i];
    
    // Skip empty rows
    if (row.length < 5) continue;
    
    // Extract values from row
    const [
      projectId, projectName, 
      siteId, siteName, siteAddress,
      zoneId, zoneName, zoneType,
      deviceId, deviceName, deviceType,
      sensorId, sensorName, sensorType, sensorUnit,
      timestamp, value
    ] = row.map(cell => cell.trim());
    
    // Add project if not already added
    if (projectId && projectName && !projects.some(p => p.id === Number(projectId))) {
      projects.push({
        id: Number(projectId),
        name: projectName,
        description: `Imported project: ${projectName}`,
        status: 'Active'
      });
    }
    
    // Add site if not already added
    if (siteId && siteName && !sites.some(s => s.id === Number(siteId))) {
      sites.push({
        id: Number(siteId),
        name: siteName,
        project_id: Number(projectId),
        address: siteAddress || undefined,
        description: `Imported site: ${siteName}`,
        status: 'Active'
      });
    }
    
    // Add zone if not already added
    if (zoneId && zoneName && !zones.some(z => z.id === Number(zoneId))) {
      zones.push({
        id: Number(zoneId),
        name: zoneName,
        site_id: Number(siteId),
        type: zoneType || undefined,
        description: `Imported zone: ${zoneName}`,
        status: 'Active'
      });
    }
    
    // Add device if not already added
    if (deviceId && deviceName && !devices.some(d => d.id === Number(deviceId))) {
      devices.push({
        id: Number(deviceId),
        name: deviceName,
        zone_id: Number(zoneId),
        site_id: Number(siteId),
        project_id: Number(projectId),
        type: deviceType || undefined,
        status: 'Active'
      });
    }
    
    // Add sensor if not already added
    if (sensorId && sensorName && !sensors.some(s => s.id === sensorId)) {
      sensors.push({
        id: sensorId,
        name: sensorName,
        device_id: Number(deviceId),
        type: sensorType || undefined,
        unit: sensorUnit || undefined
      });
    }
    
    // Add sensor data
    if (sensorId && timestamp && value) {
      sensorData.push({
        sensor_id: sensorId,
        timestamp: timestamp,
        value: Number(value),
        is_real: true
      });
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
