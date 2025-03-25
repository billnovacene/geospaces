/**
 * Utility functions for calculating zone areas from different coordinate formats
 */
import * as turf from '@turf/turf';

/**
 * Calculate polygon area using Turf.js with proper projection for accuracy
 * This converts from WGS84 (lat/lon) to a projected coordinate system before calculation
 */
export function calculateArea(coordinates: number[][]) {
  if (!coordinates || coordinates.length < 3) {
    return null;
  }
  
  try {
    // For Turf.js, we need to ensure coordinates are in [longitude, latitude] order
    // Create a GeoJSON polygon from the coordinates
    // Note: We need to close the polygon by adding the first point as the last point
    const closedCoords = [...coordinates];
    
    // Check if polygon is already closed
    const firstPoint = coordinates[0];
    const lastPoint = coordinates[coordinates.length - 1];
    if (firstPoint[0] !== lastPoint[0] || firstPoint[1] !== lastPoint[1]) {
      closedCoords.push(firstPoint); // Close the polygon
    }
    
    // Create a GeoJSON polygon feature
    const polygon = turf.polygon([closedCoords]);
    
    // Calculate area in square meters with proper projection
    const area = turf.area(polygon);
    
    // Return null if area is too small (might be a calculation error)
    if (area < 0.000001) {
      return null;
    }
    
    // Format to 2 decimal places
    return area.toFixed(2);
  } catch (error) {
    console.error("Error calculating area with Turf.js:", error);
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
      // Create a proper GeoJSON feature from the coordinates
      const polygon = turf.polygon([geoJsonLocation.geometry.coordinates[0]]);
      
      // Calculate area in square meters with proper projection
      const area = turf.area(polygon);
      
      return area.toFixed(2);
    }
    return null;
  } catch (error) {
    console.error("Error calculating area from GeoJSON with Turf.js:", error);
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
