
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
  
  // Return null to hide this component completely
  return null;
}
