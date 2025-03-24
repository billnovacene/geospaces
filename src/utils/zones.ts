
import { zoneDevicesCache } from "@/services/zones";
import { Zone } from "@/services/interfaces";
import { AlertTriangle } from "lucide-react";

// Get status color and icon
export const getStatusInfo = (status: string) => {
  switch (status.toLowerCase()) {
    case "active":
      return {
        color: "bg-green-100 text-green-800",
        icon: null
      };
    case "warning":
      return {
        color: "bg-yellow-100 text-yellow-800",
        icon: <AlertTriangle className="h-3.5 w-3.5 mr-1" />
      };
    case "inactive":
      return {
        color: "bg-red-100 text-red-800",
        icon: null
      };
    default:
      return {
        color: "bg-gray-100 text-gray-800",
        icon: null
      };
  }
};

// Get device count (prioritize cache)
export const getDeviceCount = (zone: Zone) => {
  if (zone.id && zoneDevicesCache[zone.id] !== undefined && zoneDevicesCache[zone.id] > 0) {
    return zoneDevicesCache[zone.id];
  }
  return typeof zone.devices === 'number' ? zone.devices : parseInt(String(zone.devices), 10) || 0;
};

// Organize zones into hierarchy
export const organizeZonesHierarchy = (zones: Zone[]): Zone[] => {
  // Create a map of zones by ID for easy lookup
  const zoneMap = new Map<number, Zone>();
  zones.forEach(zone => {
    // Create a children array for each zone if it doesn't exist
    if (!zone.children) zone.children = [];
    zoneMap.set(zone.id, zone);
  });

  // Identify top-level zones and build the hierarchy
  const topLevelZones: Zone[] = [];

  zones.forEach(zone => {
    // If the zone has a parent, add it as a child to the parent
    if (zone.parent !== undefined && zone.parent !== null && zoneMap.has(zone.parent)) {
      const parentZone = zoneMap.get(zone.parent);
      if (parentZone && parentZone.children) {
        // Check if this child is already in the parent's children array
        if (!parentZone.children.some(child => child.id === zone.id)) {
          parentZone.children.push(zone);
        }
      }
    } else {
      // If it doesn't have a parent, it's a top-level zone
      if (!topLevelZones.some(tlz => tlz.id === zone.id)) {
        topLevelZones.push(zone);
      }
    }
  });

  return topLevelZones;
};
