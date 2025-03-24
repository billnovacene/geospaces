
import { useCallback } from "react";
import { Zone } from "@/services/interfaces";

export const useZoneArea = (zone: Zone | null) => {
  const calculateArea = useCallback(() => {
    if (!zone?.location || !Array.isArray(zone.location) || zone.location.length < 3) {
      return null;
    }

    try {
      let area = 0;
      const coordinates = zone.location;
      
      console.log("Coordinates format:", coordinates);
      
      if (!coordinates.every(coord => Array.isArray(coord) && coord.length >= 2)) {
        console.log("Coordinates not in expected format");
        return null;
      }
      
      for (let i = 0; i < coordinates.length; i++) {
        const j = (i + 1) % coordinates.length;
        area += coordinates[i][0] * coordinates[j][1];
        area -= coordinates[j][0] * coordinates[i][1];
      }
      
      area = Math.abs(area) / 2;
      console.log("Calculated area:", area);
      
      if (area < 0.000001) {
        return null;
      }
      
      return area.toFixed(2);
    } catch (error) {
      console.error("Error calculating area:", error);
      return null;
    }
  }, [zone]);

  return calculateArea();
};
