
import { Zone } from "@/services/interfaces";

export const formatZoneLocation = (zone: Zone | null) => {
  if (!zone?.location) return null;
  
  try {
    // Ensure we're returning a string, not an object
    if (typeof zone.location === 'object') {
      return JSON.stringify(zone.location, null, 2);
    } else if (typeof zone.location === 'string') {
      return zone.location;
    } else {
      return String(zone.location);
    }
  } catch (e) {
    console.error("Error formatting location data:", e);
    return "Error displaying location data";
  }
};
