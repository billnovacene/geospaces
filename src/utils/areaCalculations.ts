
/**
 * Utility functions for calculating zone areas from different coordinate formats
 */

/**
 * Calculate polygon area using the Shoelace formula (Gauss's area formula)
 */
export function calculateArea(coordinates: number[][]) {
  if (!coordinates || coordinates.length < 3) {
    return null;
  }
  
  try {
    // Calculate area using the Shoelace formula (Gauss's area formula)
    let area = 0;
    
    for (let i = 0; i < coordinates.length; i++) {
      const j = (i + 1) % coordinates.length;
      // Make sure each coordinate is in the expected format [x, y]
      if (!Array.isArray(coordinates[i]) || coordinates[i].length < 2 ||
          !Array.isArray(coordinates[j]) || coordinates[j].length < 2) {
        return null;
      }
      
      // Apply Shoelace formula
      area += coordinates[i][0] * coordinates[j][1];
      area -= coordinates[j][0] * coordinates[i][1];
    }
    
    // Take the absolute value and divide by 2
    area = Math.abs(area) / 2;
    
    // Return null if area is too small (might be a calculation error)
    if (area < 0.000001) {
      return null;
    }
    
    // Format to 2 decimal places
    return area.toFixed(2);
  } catch (error) {
    console.error("Error calculating area:", error);
    return null;
  }
}

/**
 * Calculate area from GeoJSON format
 */
export function calculateAreaFromGeoJSON(geoJsonLocation: any) {
  try {
    if (
      geoJsonLocation?.geometry?.coordinates && 
      Array.isArray(geoJsonLocation.geometry.coordinates) &&
      geoJsonLocation.geometry.coordinates.length > 0 &&
      Array.isArray(geoJsonLocation.geometry.coordinates[0]) &&
      geoJsonLocation.geometry.coordinates[0].length >= 3
    ) {
      return calculateArea(geoJsonLocation.geometry.coordinates[0]);
    }
    return null;
  } catch (error) {
    console.error("Error calculating area from GeoJSON:", error);
    return null;
  }
}

/**
 * Extract coordinates from various location data formats
 */
export function extractCoordinates(location: any) {
  try {
    if (!location) return null;
    
    let extractedCoordinates = null;
    
    if (typeof location === 'object' && !Array.isArray(location)) {
      // Extract coordinates from GeoJSON format
      const geoJson = location as any;
      if (geoJson?.geometry?.coordinates?.[0]) {
        extractedCoordinates = geoJson.geometry.coordinates[0];
      }
    } else if (Array.isArray(location) && location.length > 0) {
      // Direct coordinate array
      extractedCoordinates = location;
    }
    
    return extractedCoordinates;
  } catch (error) {
    console.error("Error extracting coordinates:", error);
    return null;
  }
}

/**
 * Format coordinates for display (shortened version)
 */
export function formatCoordinatesForDisplay(coordinates: number[][]) {
  if (!coordinates || coordinates.length === 0) return null;
  
  return coordinates.slice(0, 3).map((coord: number[]) => 
    `[${coord[0].toFixed(6)}, ${coord[1].toFixed(6)}]`
  ).join(", ") + (coordinates.length > 3 ? ", ..." : "");
}
