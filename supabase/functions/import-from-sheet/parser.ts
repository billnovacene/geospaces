
// CSV parsing utilities
import { type ProcessedData, type ProjectRow, type SiteRow, type ZoneRow, type DeviceRow, type SensorRow, type SensorDataRow } from "./types.ts";

// Parse CSV data into structured format
export async function parseCSV(csvData: string) {
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
export function processData(data: Record<string, string>[]): ProcessedData {
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
