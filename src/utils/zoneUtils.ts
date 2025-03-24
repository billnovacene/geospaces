
import { Zone } from "@/services/interfaces";

export const formatZoneLocation = (zone: Zone | null) => {
  if (!zone?.location) return null;
  
  try {
    return (
      <div className="border rounded-lg p-3">
        <pre className="text-xs overflow-auto max-h-48">
          {JSON.stringify(zone.location, null, 2)}
        </pre>
      </div>
    );
  } catch (e) {
    return "Error displaying location data";
  }
};
