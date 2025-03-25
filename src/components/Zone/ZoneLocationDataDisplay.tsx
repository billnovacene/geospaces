
import { Zone } from "@/services/interfaces";
import { formatZoneLocation } from "@/utils/zoneUtils";

interface ZoneLocationDataDisplayProps {
  zone: Zone;
}

export const ZoneLocationDataDisplay = ({ zone }: ZoneLocationDataDisplayProps) => {
  const locationData = formatZoneLocation(zone);
  
  if (!locationData) return null;
  
  return (
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
  );
};
