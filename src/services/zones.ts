
import { apiRequest } from "./api-client";
import { Zone, PaginatedResponse } from "./interfaces";
import { toast } from "sonner";

// Cache for zone device counts
export const zoneDevicesCache: Record<number, number> = {};

// Function to fetch zones for a site
export const fetchZones = async (siteId: number): Promise<Zone[]> => {
  try {
    console.log(`Fetching zones for site ${siteId} from API...`);
    const data = await apiRequest<PaginatedResponse<Zone>>(`/zones?siteid=${siteId}`);
    console.log(`Zones for site ${siteId} API response:`, data);
    
    const zones = data.list || [];
    console.log('Number of zones received:', zones.length);
    
    // Cache device counts for later use
    zones.forEach(zone => {
      if (zone.id && zone.devices !== undefined) {
        const deviceCount = typeof zone.devices === 'number' 
          ? zone.devices 
          : parseInt(String(zone.devices), 10) || 0;
        
        console.log(`Caching device count ${deviceCount} for zone ${zone.id}`);
        zoneDevicesCache[zone.id] = deviceCount;
      }
    });
    
    // Transform API response to match our Zone interface
    return zones.map((zone: any) => ({
      id: zone.id,
      name: zone.name,
      siteId: zone.siteId,
      description: zone.description,
      devices: zone.devices,
      createdAt: zone.createdAt,
      updatedAt: zone.updatedAt,
      status: zone.warning ? "Warning" : (zone.isRemoved ? "Inactive" : "Active"),
      location: zone.location,
      isRemoved: zone.isRemoved,
      type: zone.type,
      fields: zone.fields,
      ...zone  // Include any other properties
    }));
  } catch (error) {
    console.error(`Error fetching zones for site ${siteId}:`, error);
    toast.error("Failed to fetch zones. Please try again later.");
    return [];
  }
};

// Function to fetch a single zone
export const fetchZone = async (zoneId: number): Promise<Zone | null> => {
  try {
    console.log(`Fetching zone ${zoneId} from API...`);
    
    const data = await apiRequest<Zone>(`/zones/${zoneId}`);
    console.log(`Zone ${zoneId} API response:`, data);
    
    if (!data) {
      console.error("Zone data not found in API response");
      return null;
    }
    
    // Use cached device count if available
    let deviceCount = data.devices;
    if (zoneDevicesCache[zoneId] !== undefined && zoneDevicesCache[zoneId] > 0) {
      console.log(`Using cached device count for zone ${zoneId}: ${zoneDevicesCache[zoneId]}`);
      deviceCount = zoneDevicesCache[zoneId];
    }
    
    return {
      id: data.id,
      name: data.name,
      siteId: data.siteId,
      description: data.description,
      devices: deviceCount,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
      status: data.warning ? "Warning" : (data.isRemoved ? "Inactive" : "Active"),
      location: data.location,
      isRemoved: data.isRemoved,
      type: data.type,
      fields: data.fields,
      ...data  // Include any other properties
    };
  } catch (error) {
    console.error(`Error fetching zone ${zoneId}:`, error);
    toast.error("Failed to fetch zone details. Please try again later.");
    return null;
  }
};
