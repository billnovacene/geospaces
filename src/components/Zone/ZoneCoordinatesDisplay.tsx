
import { Zone } from "@/services/interfaces";
import { useEffect, useState } from "react";
import { extractCoordinates, formatCoordinatesForDisplay } from "@/utils/areaCalculations";

interface ZoneCoordinatesDisplayProps {
  zone: Zone;
}

export const ZoneCoordinatesDisplay = ({ zone }: ZoneCoordinatesDisplayProps) => {
  const [formattedCoordinates, setFormattedCoordinates] = useState<string | null>(null);
  
  useEffect(() => {
    if (zone?.location) {
      try {
        const extractedCoordinates = extractCoordinates(zone.location);
        
        if (extractedCoordinates && extractedCoordinates.length > 0) {
          const formatted = formatCoordinatesForDisplay(extractedCoordinates);
          setFormattedCoordinates(formatted);
        } else {
          setFormattedCoordinates(null);
        }
      } catch (error) {
        console.error("Error formatting coordinates:", error);
        setFormattedCoordinates(null);
      }
    }
  }, [zone?.location]);
  
  if (!formattedCoordinates) return null;
  
  return (
    <div className="mb-2">
      <h3 className="font-medium text-sm text-muted-foreground mb-1">
        Location Coordinates
      </h3>
      <p className="text-xs text-muted-foreground border rounded-lg p-2 bg-gray-50 font-mono overflow-auto">
        {formattedCoordinates}
      </p>
    </div>
  );
};
