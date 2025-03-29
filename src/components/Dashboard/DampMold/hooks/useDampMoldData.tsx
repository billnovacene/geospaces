
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { fetchDampMoldData } from "@/services/damp-mold";
import { fetchSite } from "@/services/sites";
import { fetchZone } from "@/services/zones";
import { TempHumidityResponse } from "@/services/interfaces/temp-humidity";
import { toast } from "sonner";

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
    error,
    refetch
  } = useQuery({
    queryKey: ['damp-mold-data', siteId, zoneId],
    queryFn: async () => {
      try {
        const data = await fetchDampMoldData(siteId, zoneId);
        if (!data) {
          throw new Error("No data received from API");
        }
        return data;
      } catch (err) {
        console.error('Failed to fetch damp mold data:', err);
        toast.error("Failed to fetch damp mold data", {
          description: err instanceof Error ? err.message : "Unknown error"
        });
        throw err;
      }
    },
    // Refetch every minute
    refetchInterval: 60000,
  });

  // Ensure we have stats even if they weren't provided
  const dataWithDefaultStats: TempHumidityResponse = dampMoldData ? {
    ...dampMoldData,
    stats: dampMoldData.stats || {
      avgTemp: 0,
      minTemp: 0,
      maxTemp: 0,
      avgHumidity: 0,
      activeSensors: 0,
      status: {
        avgTemp: 'good',
        minTemp: 'good',
        maxTemp: 'good',
        avgHumidity: 'good'
      }
    }
  } : {
    daily: [],
    monthly: [],
    stats: {
      avgTemp: 0,
      minTemp: 0,
      maxTemp: 0,
      avgHumidity: 0,
      activeSensors: 0,
      status: {
        avgTemp: 'good',
        minTemp: 'good',
        maxTemp: 'good',
        avgHumidity: 'good'
      }
    }
  };

  return {
    contextInfo: { contextType, contextId, siteId, zoneId, contextName },
    data: dataWithDefaultStats,
    isLoading,
    error,
    refetch,
    activeFilter
  };
}
