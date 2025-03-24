
import { Zone } from "./interfaces";

// Interface for Device data
export interface Device {
  id: number;
  name: string;
  type?: number | string;
  typeId?: number;
  zoneId?: number;
  siteId?: number;
  projectId?: number;
  createdAt: string;
  updatedAt?: string;
  isRemoved?: boolean;
  status?: string;
  sensors?: any[];
  modelId?: any;
  zoneName?: string;
  [key: string]: any; // For any additional properties
}

// Interface for Device response
export interface DevicesResponse {
  devices: Device[];
  total: number;
  totalPages: number;
  itemTo: number;
  page: number;
  limit: number;
  pageSize: number;
  nextPage: number | null;
  previousPage: number | null;
}
