
import { Zone } from "@/services/interfaces";

export const formatZoneLocation = (zone: Zone | null) => {
  if (!zone?.location) return null;
  
  try {
    // Handle arrays specifically
    if (Array.isArray(zone.location)) {
      return JSON.stringify(zone.location, null, 2);
    }
    
    // Handle GeoJSON-like objects with type and geometry
    if (typeof zone.location === 'object' && zone.location !== null) {
      return JSON.stringify(zone.location, null, 2);
    } 
    
    // Handle string values
    if (typeof zone.location === 'string') {
      // Try to parse if it's a JSON string
      try {
        const parsed = JSON.parse(zone.location);
        return JSON.stringify(parsed, null, 2);
      } catch {
        // If not valid JSON, return as is
        return zone.location;
      }
    }
    
    // Fallback for any other type
    return String(zone.location);
    
  } catch (e) {
    console.error("Error formatting location data:", e);
    return "Error displaying location data";
  }
};
