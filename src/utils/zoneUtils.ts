
import { Zone } from "@/services/interfaces";

export const formatZoneLocation = (zone: Zone | null) => {
  if (!zone?.location) return null;
  
  try {
    // Return a string representation of the location data
    // instead of JSX, which will be converted to JSX where it's used
    return JSON.stringify(zone.location, null, 2);
  } catch (e) {
    return "Error displaying location data";
  }
};
