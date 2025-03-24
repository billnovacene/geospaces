
import { apiRequest } from "./api-client";
import { Zone, PaginatedResponse } from "./interfaces";
import { toast } from "sonner";

// Cache for zone device counts
export const zoneDevicesCache: Record<number, number> = {};

// Function to organize zones in a hierarchical structure
export const organizeZonesHierarchy = (zones: Zone[]): Zone[] => {
  // Create a map of zones by ID for easy lookup
  const zoneMap = new Map<number, Zone>();
  zones.forEach(zone => {
    // Create a children array for each zone
    zone.children = [];
    zoneMap.set(zone.id, zone);
  });

  // Identify top-level zones and build the hierarchy
  const topLevelZones: Zone[] = [];

  zones.forEach(zone => {
    // If the zone has a parent, add it as a child to the parent
    if (zone.parent !== undefined && zone.parent !== null && zoneMap.has(zone.parent)) {
      const parentZone = zoneMap.get(zone.parent);
      if (parentZone && parentZone.children) {
        parentZone.children.push(zone);
      }
    } else {
      // If it doesn't have a parent, it's a top-level zone
      topLevelZones.push(zone);
    }
  });

  console.log('Organized zones hierarchy:', topLevelZones);
  return topLevelZones;
};

// Function to fetch zones for a site
export const fetchZones = async (siteId: number, parentZoneId?: number): Promise<Zone[]> => {
  try {
    // Determine the API endpoint based on whether we're fetching by site or parent zone
    let endpoint = '';
    if (parentZoneId) {
      console.log(`Fetching sub-zones for parent zone ${parentZoneId} from API...`);
      endpoint = `/zones?parent=${parentZoneId}`;
    } else if (siteId) {
      console.log(`Fetching zones for site ${siteId} from API...`);
      endpoint = `/zones?siteid=${siteId}`;
    } else {
      console.error('Either siteId or parentZoneId must be provided');
      return [];
    }
    
    const data = await apiRequest<PaginatedResponse<Zone>>(endpoint);
    console.log(`Zones API response:`, data);
    
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
    const transformedZones = zones.map((zone: any) => ({
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
      parent: zone.parent,
      ...zone  // Include any other properties
    }));

    // Return all zones as a flat list for compatibility with existing code
    return transformedZones;
  } catch (error) {
    console.error(`Error fetching zones:`, error);
    toast.error("Failed to fetch zones. Please try again later.");
    return [];
  }
};

// Function to fetch zones for a site and organize them hierarchically
export const fetchZonesHierarchy = async (siteId: number): Promise<Zone[]> => {
  const zones = await fetchZones(siteId);
  return organizeZonesHierarchy(zones);
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
      parent: data.parent,
      ...data  // Include any other properties
    };
  } catch (error) {
    console.error(`Error fetching zone ${zoneId}:`, error);
    toast.error("Failed to fetch zone details. Please try again later.");
    return null;
  }
};
