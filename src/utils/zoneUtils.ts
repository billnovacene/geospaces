
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

// Calculate total devices for a zone including all its sub-zones
export const calculateTotalZoneDevices = (zone: Zone): number => {
  // Start with the zone's own device count
  let deviceCount = typeof zone.devices === 'number' 
    ? zone.devices 
    : parseInt(String(zone.devices), 10) || 0;
  
  // Add devices from all child zones recursively
  if (zone.children && zone.children.length > 0) {
    zone.children.forEach(childZone => {
      deviceCount += calculateTotalZoneDevices(childZone);
    });
  }
  
  return deviceCount;
};
