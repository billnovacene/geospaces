
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { fetchDampMoldData } from "@/services/damp-mold";
import { fetchSite } from "@/services/sites";
import { fetchZone } from "@/services/zones";
import { generateMockData } from "@/services/sensors/mock-data-generator";
import { TempHumidityResponse } from "@/services/interfaces/temp-humidity";

export interface DampMoldContextInfo {
  contextType: "zone" | "site" | "all";
  contextId: string | null;
  siteId?: string;
  zoneId?: string;
  contextName?: string | null;
}

export function useDampMoldData(
  propsContextType?: "zone" | "site" | "all",
  propsContextId?: string | null,
  propsSiteId?: string,
  propsZoneId?: string,
  activeFilter?: string | null
) {
  const params = useParams<{ siteId: string; zoneId: string }>();
  
  // Use params if props are not provided
  const siteId = propsSiteId || params.siteId;
  const zoneId = propsZoneId || params.zoneId;
  
  // Determine context type based on available IDs
  const contextType = propsContextType || (zoneId ? "zone" : siteId ? "site" : "all");
  const contextId = propsContextId || zoneId || siteId || null;
  
  // Fetch zone name if we have a zone ID
  const { data: zoneName } = useQuery({
    queryKey: ["zone-name", zoneId],
    queryFn: async () => {
      const zone = await fetchZone(Number(zoneId));
      return zone?.name || "Unknown Zone";
    },
    enabled: !!zoneId,
  });
  
  // Fetch site name if we have a site ID but no zone ID
  const { data: siteName } = useQuery({
    queryKey: ["site-name", siteId],
    queryFn: async () => {
      const site = await fetchSite(Number(siteId));
      return site?.name || "Unknown Site";
    },
    enabled: !!siteId && !zoneId,
  });
  
  // Determine the context name
  const contextName = zoneId ? zoneName : siteId ? siteName : "All Locations";
  
  // Fetch the damp mold data
  const { 
    data: dampMoldData, 
    isLoading, 
    error 
  } = useQuery({
    queryKey: ['damp-mold-data', siteId, zoneId],
    queryFn: () => fetchDampMoldData(siteId, zoneId),
    // Refetch every minute
    refetchInterval: 60000,
  });

  // Use mock data if no real data is available
  const displayData: TempHumidityResponse = dampMoldData || generateMockData();
  
  return {
    contextInfo: { contextType, contextId, siteId, zoneId, contextName },
    data: displayData,
    isLoading,
    error
  };
}
