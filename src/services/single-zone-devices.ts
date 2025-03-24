
import { apiRequest } from "./api-client";
import { Device, DevicesResponse } from "./device-types";
import { deviceCountsByZone } from "./device-cache";

// Helper function to fetch devices for a single zone only
export const fetchDevicesForSingleZone = async (zoneId: number): Promise<Device[]> => {
  console.log(`Fetching devices for single zone ${zoneId} only`);
  
  try {
    // Add nocache parameter to avoid caching issues
    const nocache = new Date().getTime();
    
    // IMPORTANT: Make sure we're using exact matching for zone ID to prevent retrieving devices from other zones
    const response = await apiRequest<DevicesResponse>(
      `/devices?zoneids=${zoneId}&limit=100&nodeveui=false&includeSensors=true&nocache=${nocache}`
    );
    
    console.log(`Devices API response for single zone ${zoneId}:`, response);
    
    if (response && response.devices && Array.isArray(response.devices)) {
      // Filter the devices to make sure they actually belong to this zone
      const filteredDevices = response.devices.filter(device => {
        const matches = device.zoneId === zoneId;
        console.log(`Device ${device.id} (${device.name}) - zoneId: ${device.zoneId}, matches ${zoneId}: ${matches}`);
        return matches;
      });
      
      console.log(`Filtered ${response.devices.length} devices to ${filteredDevices.length} for zone ${zoneId}`);
      
      // Store the count in cache
      deviceCountsByZone[zoneId] = filteredDevices.length;
      console.log(`Caching device count ${filteredDevices.length} for zone ${zoneId}`);
      
      // Transform the response into the Device interface
      return filteredDevices.map(device => ({
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
    console.error(`Error fetching devices for single zone ${zoneId}:`, error);
    throw error;
  }
};
