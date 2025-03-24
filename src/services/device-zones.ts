
import { apiRequest } from "./api-client";
import { toast } from "sonner";
import { fetchZones } from "./api";
import { Zone } from "./interfaces";
import { deviceCountsByZone } from "./device-cache";
import { Device, DevicesResponse } from "./device-types";

// Helper function to get all sub-zone IDs recursively
export const getAllSubZoneIds = async (zoneId: number, siteId: number): Promise<number[]> => {
  try {
    console.log(`Getting sub-zones for zone ${zoneId} in site ${siteId}`);
    // First, get direct sub-zones
    const zones = await fetchZones(siteId, zoneId);
    
    // Start with the current zone ID
    let allZoneIds: number[] = [zoneId];
    
    // For each sub-zone, recursively get its sub-zones
    for (const zone of zones) {
      if (zone.id !== zoneId) { // Avoid the parent zone itself
        allZoneIds.push(zone.id);
        
        // Recursively get sub-zones of this zone
        const childZones = await fetchZones(siteId, zone.id);
        if (childZones.length > 0) {
          for (const childZone of childZones) {
            if (!allZoneIds.includes(childZone.id)) {
              allZoneIds.push(childZone.id);
            }
          }
        }
      }
    }
    
    console.log(`All zone IDs including ${zoneId} and sub-zones:`, allZoneIds);
    return allZoneIds;
  } catch (error) {
    console.error(`Error getting sub-zones for zone ${zoneId}:`, error);
    return [zoneId]; // Return at least the current zone ID
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

// Function to fetch devices for a zone, with option to include subzones
export const fetchDevicesForZone = async (zoneId: number, siteId?: number, includeSubZones: boolean = false): Promise<Device[]> => {
  try {
    console.log(`Fetching devices for zone ${zoneId}, siteId: ${siteId || 'undefined'}, includeSubZones: ${includeSubZones}`);
    
    // If we don't want subzones or no siteId is provided, just fetch for this zone only
    if (!includeSubZones || !siteId) {
      console.log(`Fetching only direct devices for zone ${zoneId}`);
      return fetchDevicesForSingleZone(zoneId);
    }
    
    // Get all sub-zones to fetch devices from all of them
    const zoneIds = await getAllSubZoneIds(zoneId, siteId);
    console.log(`Will fetch devices for zone ${zoneId} and its subzones:`, zoneIds);
    
    // Build a comma-separated list of zone IDs for the API query
    const zoneIdsParam = zoneIds.join(',');
    
    return fetchDevicesWithZoneIds(zoneIdsParam, zoneId);
  } catch (error) {
    console.error(`Error fetching devices for zone ${zoneId}:`, error);
    toast.error("Failed to fetch devices. Please try again later.");
    return [];
  }
};

// Helper function to fetch devices for a single zone only
const fetchDevicesForSingleZone = async (zoneId: number): Promise<Device[]> => {
  console.log(`Fetching devices for single zone ${zoneId} only`);
  return fetchDevicesWithZoneIds(String(zoneId), zoneId);
};

// Helper function to fetch devices with zone IDs parameter
const fetchDevicesWithZoneIds = async (zoneIdsParam: string, primaryZoneId: number): Promise<Device[]> => {
  try {
    // Add nocache parameter to avoid caching issues
    const nocache = new Date().getTime();
    const response = await apiRequest<DevicesResponse>(
      `/devices?zoneids=${zoneIdsParam}&limit=100&nodeveui=false&includeSensors=true&nocache=${nocache}`
    );
    
    console.log(`Devices API response for zones [${zoneIdsParam}]:`, response);
    
    if (response && response.devices && Array.isArray(response.devices)) {
      // Store the count in cache
      deviceCountsByZone[primaryZoneId] = response.total;
      console.log(`Caching device count ${response.total} for zone ${primaryZoneId}`);
      
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
    console.error(`Error fetching devices with zone IDs [${zoneIdsParam}]:`, error);
    throw error; // Let the caller handle the error
  }
};
