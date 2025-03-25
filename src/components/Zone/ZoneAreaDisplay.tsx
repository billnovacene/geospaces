
import { Badge } from "@/components/ui/badge";
import { InfoIcon, MapIcon } from "lucide-react";
import { Zone } from "@/services/interfaces";
import { calculateArea, calculateAreaFromGeoJSON, extractCoordinates } from "@/utils/areaCalculations";
import { useEffect, useState } from "react";
import { TooltipWrapper } from "@/components/UI/TooltipWrapper";

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
          <span className="text-sm text-muted-foreground mr-1">
            (Zone area from data)
          </span>
          <TooltipWrapper 
            content="This area value is stored directly in the zone data and was provided during zone creation or update."
          >
            <InfoIcon className="h-4 w-4 text-muted-foreground cursor-help" />
          </TooltipWrapper>
        </div>
      ) : areaValue ? (
        <div className="flex items-center">
          <Badge variant="secondary" className="text-lg font-medium mr-2 py-1.5 px-3">
            {areaValue}m²
          </Badge>
          <span className="text-sm text-muted-foreground mr-1">
            ({parseFloat(areaValue).toLocaleString()} square meters)
          </span>
          <TooltipWrapper 
            content="This area is calculated from the zone's coordinates using Turf.js with proper coordinate projection to ensure accurate measurements regardless of location on Earth."
          >
            <InfoIcon className="h-4 w-4 text-muted-foreground cursor-help" />
          </TooltipWrapper>
        </div>
      ) : calculatedArea ? (
        <div className="flex items-center">
          <Badge variant="success" className="text-lg font-medium mr-2 py-1.5 px-3">
            {calculatedArea}m²
          </Badge>
          <span className="text-sm text-muted-foreground mr-1">
            (Calculated from location coordinates)
          </span>
          <TooltipWrapper 
            content="Area calculated using Turf.js which converts latitude/longitude (WGS84) to a projected coordinate system before calculating the area for accurate measurements."
          >
            <InfoIcon className="h-4 w-4 text-muted-foreground cursor-help" />
          </TooltipWrapper>
        </div>
      ) : locationDataExists ? (
        <div className="flex items-center">
          <span className="text-sm text-muted-foreground mr-1">
            {locationCoordinates && locationCoordinates.length > 0 ? 
              `${locationCoordinates.length} coordinates (need at least 3 for area calculation)` : 
              "Area: Unknown"}
          </span>
          <TooltipWrapper 
            content="Area calculation requires at least 3 valid coordinates. The coordinates will be converted to a projected coordinate system using Turf.js for accurate area measurement."
          >
            <InfoIcon className="h-4 w-4 text-muted-foreground cursor-help" />
          </TooltipWrapper>
        </div>
      ) : (
        <div className="flex items-center">
          <span className="text-sm text-muted-foreground mr-1">
            No valid coordinates found to calculate area
          </span>
          <TooltipWrapper 
            content="Area calculation requires at least 3 valid coordinates in the zone's location data. No valid coordinates were found."
          >
            <InfoIcon className="h-4 w-4 text-muted-foreground cursor-help" />
          </TooltipWrapper>
        </div>
      )}
    </div>
  );
};
