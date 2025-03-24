
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
  // Start with the zone's own direct device count - ensure we're getting a number
  let deviceCount = typeof zone.devices === 'number' 
    ? zone.devices 
    : parseInt(String(zone.devices), 10) || 0;
  
  console.log(`Zone ${zone.name} (ID: ${zone.id}) direct device count: ${deviceCount}`);
  
  // Add devices from all child zones recursively
  if (zone.children && zone.children.length > 0) {
    zone.children.forEach(childZone => {
      const childDeviceCount = calculateTotalZoneDevices(childZone);
      console.log(`Child zone ${childZone.name} (ID: ${childZone.id}) contributes ${childDeviceCount} devices`);
      deviceCount += childDeviceCount;
    });
  }
  
  console.log(`Zone ${zone.name} (ID: ${zone.id}) total device count: ${deviceCount}`);
  return deviceCount;
};
