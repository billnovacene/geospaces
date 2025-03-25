
import { useCallback } from "react";
import { Zone } from "@/services/interfaces";

// This hook is maintained for backward compatibility
// Most of the calculation logic has been moved to ZoneAdditionalInfoCard
export const useZoneArea = (zone: Zone | null) => {
  const calculateArea = useCallback(() => {
    console.log("useZoneArea is deprecated, calculation moved to ZoneAdditionalInfoCard");
    return null;
  }, [zone]);

  return calculateArea();
};
