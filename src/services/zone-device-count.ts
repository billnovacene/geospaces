
import { apiRequest } from "./api-client";
import { toast } from "sonner";
import { deviceCountsByZone } from "./device-cache";
import { DevicesResponse } from "./device-types";

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
