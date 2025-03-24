
import { apiRequest } from "./api-client";
import { toast } from "sonner";

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
  [key: string]: any; // For any additional properties
}

// Interface for Device response
export interface DevicesResponse {
  list: Device[];
  total: number;
  totalPages: number;
  itemTo: number;
  page: number;
  limit: number;
  pageSize: number;
  nextPage: number | null;
  previousPage: number | null;
}

// Cache for device counts by zone
export const deviceCountsByZone: Record<number, number> = {};
// Cache for total device count by site
export const deviceCountsBySite: Record<number, number> = {};

// Function to fetch devices count for a site
export const fetchDevicesCountForSite = async (siteId: number): Promise<number> => {
  try {
    console.log(`Fetching devices count for site ${siteId} from API...`);
    
    // First check if we have a cached count
    if (deviceCountsBySite[siteId]) {
      console.log(`Using cached device count for site ${siteId}: ${deviceCountsBySite[siteId]}`);
      return deviceCountsBySite[siteId];
    }
    
    // If not cached, fetch from API
    const response = await apiRequest<DevicesResponse>(
      `/devices?page=1&limit=1&siteid=${siteId}&nodeveui=false`
    );
    
    console.log(`Devices count API response for site ${siteId}:`, response);
    
    // Store the count in cache
    if (response && typeof response.total === 'number') {
      deviceCountsBySite[siteId] = response.total;
      console.log(`Caching device count ${response.total} for site ${siteId}`);
      return response.total;
    }
    
    return 0;
  } catch (error) {
    console.error(`Error fetching devices count for site ${siteId}:`, error);
    toast.error("Failed to fetch devices count. Please try again later.");
    return 0;
  }
};

// Function to fetch devices count for a zone
export const fetchDevicesCountForZone = async (zoneId: number): Promise<number> => {
  try {
    console.log(`Fetching devices count for zone ${zoneId} from API...`);
    
    // First check if we have a cached count
    if (deviceCountsByZone[zoneId]) {
      console.log(`Using cached device count for zone ${zoneId}: ${deviceCountsByZone[zoneId]}`);
      return deviceCountsByZone[zoneId];
    }
    
    // If not cached, fetch from API
    const response = await apiRequest<DevicesResponse>(
      `/devices?page=1&limit=1&zoneids=${zoneId}&nodeveui=false`
    );
    
    console.log(`Devices count API response for zone ${zoneId}:`, response);
    
    // Store the count in cache
    if (response && typeof response.total === 'number') {
      deviceCountsByZone[zoneId] = response.total;
      console.log(`Caching device count ${response.total} for zone ${zoneId}`);
      return response.total;
    }
    
    return 0;
  } catch (error) {
    console.error(`Error fetching devices count for zone ${zoneId}:`, error);
    toast.error("Failed to fetch devices count. Please try again later.");
    return 0;
  }
};

// Export devices API
export { fetchDevicesCountForSite as fetchDevicesCount };

