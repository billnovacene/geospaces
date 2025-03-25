
import { Badge } from "@/components/ui/badge";
import { MapIcon } from "lucide-react";
import { Zone } from "@/services/interfaces";
import { calculateArea, calculateAreaFromGeoJSON, extractCoordinates } from "@/utils/areaCalculations";
import { useEffect, useState } from "react";

interface ZoneAreaDisplayProps {
  zone: Zone;
}

export const ZoneAreaDisplay = ({ zone }: ZoneAreaDisplayProps) => {
  const [calculatedArea, setCalculatedArea] = useState<string | null>(null);
  
  // First check if the zone has an area field directly
  const hasAreaField = zone.area !== undefined && zone.area !== null;
  const areaFromField = hasAreaField ? String(zone.area) : null;
  
  // If not, calculate the area from location data as fallback
  const areaValue = areaFromField || (zone?.location && Array.isArray(zone.location) && zone.location.length >= 3 
    ? calculateArea(zone.location)
    : (zone?.location && typeof zone.location === 'object' && !Array.isArray(zone.location))
      ? calculateAreaFromGeoJSON(zone.location as any)
      : null);
  
  // Extract coordinates and calculate area if needed
  useEffect(() => {
    if (zone?.location && !hasAreaField) {
      const coordinates = extractCoordinates(zone.location);
      
      if (coordinates && coordinates.length >= 3) {
        const area = calculateArea(coordinates);
        setCalculatedArea(area);
      }
    }
  }, [zone?.location, hasAreaField]);
  
  // Determine if location data exists for display purposes
  let locationDataExists = false;
  let locationCoordinates = null;

  try {
    if (zone.location) {
      locationCoordinates = extractCoordinates(zone.location);
      locationDataExists = !!locationCoordinates && locationCoordinates.length > 0;
    }
  } catch (error) {
    console.error("Error processing location data:", error);
  }
  
  return (
    <div className="mb-4 p-4 bg-slate-50 rounded-lg border">
      <h3 className="font-semibold text-base text-slate-800 mb-2 flex items-center">
        <MapIcon className="h-5 w-5 mr-2 text-primary" />
        Zone Area
      </h3>
      {hasAreaField ? (
        <div className="flex items-center">
          <Badge variant="secondary" className="text-lg font-medium mr-2 py-1.5 px-3">
            {areaFromField}m²
          </Badge>
          <span className="text-sm text-muted-foreground">
            (Zone area from data)
          </span>
        </div>
      ) : areaValue ? (
        <div className="flex items-center">
          <Badge variant="secondary" className="text-lg font-medium mr-2 py-1.5 px-3">
            {areaValue}m²
          </Badge>
          <span className="text-sm text-muted-foreground">
            ({parseFloat(areaValue).toLocaleString()} square meters)
          </span>
        </div>
      ) : calculatedArea ? (
        <div className="flex items-center">
          <Badge variant="success" className="text-lg font-medium mr-2 py-1.5 px-3">
            {calculatedArea}m²
          </Badge>
          <span className="text-sm text-muted-foreground">
            (Calculated from location coordinates)
          </span>
        </div>
      ) : locationDataExists ? (
        <div className="flex items-center">
          <span className="text-sm text-muted-foreground">
            Calculating from {locationCoordinates?.length || 0} coordinates...
          </span>
        </div>
      ) : (
        <div className="flex items-center">
          <span className="text-sm text-muted-foreground">
            No valid coordinates found to calculate area
          </span>
        </div>
      )}
    </div>
  );
};
