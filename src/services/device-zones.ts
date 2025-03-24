
import { toast } from "sonner";
import { Device } from "./device-types";
import { getAllSubZoneIds } from "./zone-utils";
import { fetchDevicesCountForZone } from "./zone-device-count";
import { fetchDevicesForSingleZone } from "./single-zone-devices";
import { fetchDevicesWithZoneIds } from "./multi-zone-devices";

// Re-export the device count function to maintain API consistency
export { fetchDevicesCountForZone } from "./zone-device-count";

// Function to fetch devices for a zone, with option to include subzones
export const fetchDevicesForZone = async (zoneId: number, siteId?: number, includeSubZones: boolean = false): Promise<Device[]> => {
  try {
    console.log(`Fetching devices for zone ${zoneId}, siteId: ${siteId || 'undefined'}, includeSubZones: ${includeSubZones}`);
    
    // If we don't want subzones or no siteId is provided, just fetch for this zone only
    if (!includeSubZones || !siteId) {
      console.log(`Fetching only direct devices for zone ${zoneId}`);
      const devices = await fetchDevicesForSingleZone(zoneId);
      console.log(`Found ${devices.length} devices directly in zone ${zoneId}`);
      return devices;
    }
    
    // Get all sub-zones to fetch devices from all of them
    const zoneIds = await getAllSubZoneIds(zoneId, siteId);
    console.log(`Will fetch devices for zone ${zoneId} and its subzones:`, zoneIds);
    
    // Build a comma-separated list of zone IDs for the API query
    const zoneIdsParam = zoneIds.join(',');
    
    const devices = await fetchDevicesWithZoneIds(zoneIdsParam, zoneId);
    console.log(`Found ${devices.length} devices in zone ${zoneId} and its subzones`);
    return devices;
  } catch (error) {
    console.error(`Error fetching devices for zone ${zoneId}:`, error);
    toast.error("Failed to fetch devices. Please try again later.");
    return [];
  }
};
