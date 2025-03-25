
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Zone } from "@/services/interfaces";
import { formatDate } from "@/utils/formatting";
import { formatZoneLocation } from "@/utils/zoneUtils";
import { Badge } from "@/components/ui/badge";
import { useEffect, useState } from "react";

interface ZoneAdditionalInfoCardProps {
  zone: Zone;
}

export const ZoneAdditionalInfoCard = ({ zone }: ZoneAdditionalInfoCardProps) => {
  const locationData = formatZoneLocation(zone);
  const [formattedCoordinates, setFormattedCoordinates] = useState<string | null>(null);
  
  // We'll calculate the area here to ensure it's displayed properly in this component
  const areaValue = zone?.location && Array.isArray(zone.location) && zone.location.length >= 3 
    ? calculateArea(zone.location)
    : (zone?.location && typeof zone.location === 'object' && !Array.isArray(zone.location))
      ? calculateAreaFromGeoJSON(zone.location as any)
      : null;
  
  // Extract and format coordinates for display
  useEffect(() => {
    if (zone?.location) {
      try {
        let coords;
        if (typeof zone.location === 'object' && !Array.isArray(zone.location)) {
          // Extract coordinates from GeoJSON format
          const geoJson = zone.location as any;
          if (geoJson?.geometry?.coordinates?.[0]) {
            coords = geoJson.geometry.coordinates[0].slice(0, 3).map((coord: number[]) => 
              `[${coord[0].toFixed(6)}, ${coord[1].toFixed(6)}]`
            ).join(", ") + (geoJson.geometry.coordinates[0].length > 3 ? ", ..." : "");
          }
        } else if (Array.isArray(zone.location) && zone.location.length > 0) {
          // Format direct coordinate array
          coords = zone.location.slice(0, 3).map((coord: number[]) => 
            `[${coord[0].toFixed(6)}, ${coord[1].toFixed(6)}]`
          ).join(", ") + (zone.location.length > 3 ? ", ..." : "");
        }
        
        setFormattedCoordinates(coords || null);
      } catch (error) {
        console.error("Error formatting coordinates:", error);
        setFormattedCoordinates(null);
      }
    }
  }, [zone?.location]);
  
  function calculateArea(coordinates: number[][]) {
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
  
  function calculateAreaFromGeoJSON(geoJsonLocation: any) {
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

  // Check for location before displaying area section
  let locationDataExists = false;
  let locationCoordinates = null;

  try {
    if (zone.location) {
      // Handle different location data formats
      if (typeof zone.location === 'object' && !Array.isArray(zone.location)) {
        // If location is an object with geometry property (GeoJSON format)
        const geoJson = zone.location as any; 
        if (geoJson?.geometry?.coordinates) {
          locationCoordinates = geoJson.geometry.coordinates[0];
          locationDataExists = Array.isArray(locationCoordinates) && locationCoordinates.length > 0;
        }
      } else if (Array.isArray(zone.location)) {
        // If location is directly an array of coordinates
        locationCoordinates = zone.location;
        locationDataExists = zone.location.length > 0;
      }
    }
  } catch (error) {
    console.error("Error processing location data:", error);
  }
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Additional Information</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <h3 className="font-medium text-sm text-muted-foreground mb-1">Last Updated</h3>
          <p>{formatDate(zone.updatedAt)}</p>
        </div>
        
        {/* Area information displayed more prominently */}
        <div className="mb-2">
          <h3 className="font-medium text-sm text-muted-foreground mb-1">Area</h3>
          {areaValue ? (
            <p>
              <Badge variant="secondary" className="text-sm font-medium mr-2">
                {areaValue} m²
              </Badge>
              <span className="text-sm text-muted-foreground">
                ({parseFloat(areaValue).toLocaleString()} square meters)
              </span>
            </p>
          ) : (
            <p className="text-sm text-muted-foreground">
              Not available (calculated from location GeoJSON)
            </p>
          )}
        </div>
        
        {/* Coordinates preview */}
        {formattedCoordinates && (
          <div className="mb-2">
            <h3 className="font-medium text-sm text-muted-foreground mb-1">
              Location Coordinates
            </h3>
            <p className="text-xs text-muted-foreground border rounded-lg p-2 bg-gray-50 font-mono overflow-auto">
              {formattedCoordinates}
            </p>
          </div>
        )}
        
        {locationDataExists && (
          <div>
            <h3 className="font-medium text-sm text-muted-foreground mb-1">
              Location Data
            </h3>
            <div className="border rounded-lg p-3">
              <pre className="text-xs overflow-auto max-h-48">
                {locationData}
              </pre>
            </div>
          </div>
        )}
        
        {zone.fields && zone.fields.length > 0 && (
          <div>
            <h3 className="font-medium text-sm text-muted-foreground mb-1">Custom Fields</h3>
            <div className="border rounded-lg p-3">
              <pre className="text-xs overflow-auto max-h-48">
                {JSON.stringify(zone.fields, null, 2)}
              </pre>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
