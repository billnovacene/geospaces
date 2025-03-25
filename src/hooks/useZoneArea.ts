
import { useCallback } from "react";
import { Zone } from "@/services/interfaces";

export const useZoneArea = (zone: Zone | null) => {
  const calculateArea = useCallback(() => {
    if (!zone?.location || !Array.isArray(zone.location) || zone.location.length < 3) {
      console.log("Invalid zone location data for area calculation", zone?.location);
      return null;
    }

    try {
      // Check if location is in the expected format
      const coordinates = zone.location;
      console.log("Calculating area for coordinates:", coordinates);
      
      // Ensure we have at least 3 points to form a polygon
      if (coordinates.length < 3) {
        console.log("Not enough coordinates for area calculation");
        return null;
      }
      
      // Calculate area using the Shoelace formula (Gauss's area formula)
      let area = 0;
      
      for (let i = 0; i < coordinates.length; i++) {
        const j = (i + 1) % coordinates.length;
        // Make sure each coordinate is in the expected format [x, y]
        if (!Array.isArray(coordinates[i]) || coordinates[i].length < 2 ||
            !Array.isArray(coordinates[j]) || coordinates[j].length < 2) {
          console.log("Invalid coordinate format at index", i);
          return null;
        }
        
        // Apply Shoelace formula
        area += coordinates[i][0] * coordinates[j][1];
        area -= coordinates[j][0] * coordinates[i][1];
      }
      
      // Take the absolute value and divide by 2
      area = Math.abs(area) / 2;
      console.log("Raw calculated area:", area);
      
      // Return null if area is too small (might be a calculation error)
      if (area < 0.000001) {
        console.log("Area too small, likely an error");
        return null;
      }
      
      // Format to 2 decimal places
      return area.toFixed(2);
    } catch (error) {
      console.error("Error calculating area:", error);
      return null;
    }
  }, [zone]);

  return calculateArea();
};
