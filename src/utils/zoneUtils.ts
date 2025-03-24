
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
  // Get direct device count from the API data for the current zone
  const directDeviceCount = typeof zone.devices === 'number' 
    ? zone.devices 
    : parseInt(String(zone.devices), 10) || 0;
    
  console.log(`CALCULATION: Zone ${zone.name} (ID: ${zone.id}) has ${directDeviceCount} direct devices`);
    
  // We DON'T want to add child counts to this total for display in the UI
  // We're just returning the direct count
  return directDeviceCount;
};

// A separate function to sum direct device counts from a zone and its children
// This is used for accurate total counts
export const sumZoneAndChildrenDevices = (zone: Zone): number => {
  // Start with direct devices from this zone
  let total = typeof zone.devices === 'number' 
    ? zone.devices 
    : parseInt(String(zone.devices), 10) || 0;
  
  // Add direct devices from each child zone
  if (zone.children && zone.children.length > 0) {
    zone.children.forEach(child => {
      const childDevices = typeof child.devices === 'number'
        ? child.devices
        : parseInt(String(child.devices), 10) || 0;
      
      console.log(`SUMMATION: Child zone ${child.name} (ID: ${child.id}) contributes ${childDevices} direct devices`);
      total += childDevices;
    });
  }
  
  console.log(`SUMMATION: Zone ${zone.name} (ID: ${zone.id}) total sum: ${total} devices`);
  return total;
};
