
import { fetchZones } from "./api";
import { toast } from "sonner";
import { Zone } from "./interfaces";

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
