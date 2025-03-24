
import { apiRequest } from "./api-client";
import { Device, DevicesResponse } from "./device-types";
import { deviceCountsByZone } from "./device-cache";

// Helper function to fetch devices with zone IDs parameter
export const fetchDevicesWithZoneIds = async (zoneIdsParam: string, primaryZoneId: number): Promise<Device[]> => {
  try {
    // Add nocache parameter to avoid caching issues
    const nocache = new Date().getTime();
    const response = await apiRequest<DevicesResponse>(
      `/devices?zoneids=${zoneIdsParam}&limit=100&nodeveui=false&includeSensors=true&nocache=${nocache}`
    );
    
    console.log(`Devices API response for zones [${zoneIdsParam}]:`, response);
    
    if (response && response.devices && Array.isArray(response.devices)) {
      console.log(`Found ${response.devices.length} devices for zones [${zoneIdsParam}]`);
      
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
    throw error;
  }
};
