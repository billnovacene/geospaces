
// Type definitions for data structures

export interface ProjectRow {
  id: number;
  name: string;
  customer_id?: number;
  description?: string;
  status?: string;
}

export interface SiteRow {
  id: number;
  name: string;
  project_id: number;
  address?: string;
  description?: string;
  status?: string;
  location_text?: string;
}

export interface ZoneRow {
  id: number;
  name: string;
  site_id: number;
  parent_id?: number;
  description?: string;
  type?: string;
  status?: string;
  area?: number;
}

export interface DeviceRow {
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

export interface SensorRow {
  id: string;
  name: string;
  device_id: number;
  type?: string;
  unit?: string;
}

export interface SensorDataRow {
  sensor_id: string;
  timestamp: string;
  value: number;
  is_real?: boolean;
}

export interface ProcessedData {
  projects: ProjectRow[];
  sites: SiteRow[];
  zones: ZoneRow[];
  devices: DeviceRow[];
  sensors: SensorRow[];
  sensorData: SensorDataRow[];
}

export interface ImportResult {
  success: boolean;
  totalImported: number;
  counts: {
    projects: number;
    sites: number;
    zones: number;
    devices: number;
    sensors: number;
    sensorData: number;
  };
  error: string;
}
