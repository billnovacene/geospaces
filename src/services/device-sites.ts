
import { apiRequest } from "./api-client";
import { toast } from "sonner";
import { deviceCountsBySite } from "./device-cache";
import { Device, DevicesResponse } from "./device-types";

// Function to fetch devices count for a site
export const fetchDevicesCountForSite = async (siteId: number): Promise<number> => {
  try {
    console.log(`Fetching devices count for site ${siteId} from API...`);
    
    // First check if we have a cached count
    if (deviceCountsBySite[siteId]) {
      console.log(`Using cached device count for site ${siteId}: ${deviceCountsBySite[siteId]}`);
      return deviceCountsBySite[siteId];
    }
    
    // If not cached, fetch from API with timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000); // 8 second timeout
    
    const response = await apiRequest<DevicesResponse>(
      `/devices?page=1&limit=1&siteid=${siteId}&nodeveui=false`,
      { signal: controller.signal }
    );
    
    clearTimeout(timeoutId);
    
    console.log(`Devices count API response for site ${siteId}:`, response);
    
    // Store the count in cache
    if (response && typeof response.total === 'number') {
      deviceCountsBySite[siteId] = response.total;
      console.log(`Caching device count ${response.total} for site ${siteId}`);
      return response.total;
    }
    
    return 0;
  } catch (error) {
    // Don't show toast for aborted requests
    if ((error as any)?.name !== 'AbortError') {
      console.error(`Error fetching devices count for site ${siteId}:`, error);
      toast.error("Failed to fetch devices count. Please try again later.");
    } else {
      console.warn(`Request for site ${siteId} devices count timed out`);
    }
    return 0;
  }
};

// Function to fetch all devices for a site
export const fetchSiteDevices = async (siteId: number): Promise<Device[]> => {
  try {
    console.log(`Fetching devices for site ${siteId} from API...`);
    
    // Add nocache parameter to avoid caching issues  
    const nocache = new Date().getTime();
    
    // Create abort controller for timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000); // 15 second timeout
    
    const response = await apiRequest<DevicesResponse>(
      `/devices?siteid=${siteId}&limit=100&nodeveui=false&includeSensors=true&nocache=${nocache}`,
      { signal: controller.signal }
    );
    
    clearTimeout(timeoutId);
    
    console.log(`Devices API response for site ${siteId}:`, response);
    
    if (response && response.devices && Array.isArray(response.devices)) {
      // Store the count in cache
      deviceCountsBySite[siteId] = response.total;
      console.log(`Caching device count ${response.total} for site ${siteId}`);
      
      // Transform the response into the Device interface
      return response.devices.map(device => ({
        id: device.id,
        name: device.name || `Device ${device.id}`,
        type: device.type,
        zoneId: device.zoneId,
        siteId: device.siteId,
        projectId: device.projectId,
        modelId: device.modelId,
        createdAt: device.createdAt,
        updatedAt: device.updatedAt,
        sensors: device.sensors || [],
        status: device.isRemoved ? "Inactive" : "Active",
        isRemoved: device.isRemoved,
        zoneName: device.zoneName || (device.zone ? device.zone.name : null),
        ...device // Include any other properties
      }));
    }
    
    return [];
  } catch (error) {
    // Don't show toast for aborted requests
    if ((error as any)?.name !== 'AbortError') {
      console.error(`Error fetching devices for site ${siteId}:`, error);
      toast.error("Failed to fetch devices. Please try again later.");
    } else {
      console.warn(`Request for site ${siteId} devices timed out`);
    }
    return [];
  }
};
