
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
  let totalCount = 0;
  
  // Get direct device count from the API data if available
  const directCount = typeof zone.devices === 'number' 
    ? zone.devices 
    : parseInt(String(zone.devices), 10) || 0;
    
  // Add direct devices
  totalCount += directCount;
  
  // Add devices from child zones
  if (zone.children && zone.children.length > 0) {
    // We DON'T recursively call calculateTotalZoneDevices here
    // Instead, we directly add the device counts from each child
    zone.children.forEach(childZone => {
      const childDirectCount = typeof childZone.devices === 'number'
        ? childZone.devices
        : parseInt(String(childZone.devices), 10) || 0;
        
      console.log(`Child zone ${childZone.name} (ID: ${childZone.id}) has ${childDirectCount} direct devices`);
      totalCount += childDirectCount;
    });
  }
  
  console.log(`Zone ${zone.name} (ID: ${zone.id}) calculated total: ${totalCount} devices`);
  return totalCount;
};
