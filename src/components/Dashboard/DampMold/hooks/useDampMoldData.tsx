
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
  siteName?: string | null;
  zoneName?: string | null;
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
  const { data: zoneData } = useQuery({
    queryKey: ["zone-name", zoneId],
    queryFn: async () => {
      if (!zoneId) return null;
      const zone = await fetchZone(Number(zoneId));
      console.log("Zone data fetched for sidebar:", zone);
      return zone;
    },
    enabled: !!zoneId,
  });
  
  // Fetch site name if we have a site ID
  const { data: siteData } = useQuery({
    queryKey: ["site-name", siteId],
    queryFn: async () => {
      if (!siteId) return null;
      const site = await fetchSite(Number(siteId));
      console.log("Site data fetched for sidebar:", site);
      return site;
    },
    enabled: !!siteId,
  });
  
  const zoneName = zoneData?.name || "Unknown Zone";
  const siteName = zoneData?.siteId && siteData?.name ? siteData.name : (siteData?.name || "Unknown Site");
  
  // Determine the context name based on available data
  const contextName = zoneId ? `${siteName} - ${zoneName}` : siteId ? siteName : "All Locations";
  
  // Log context info for debugging
  console.log("Context info:", { contextType, contextId, siteId, zoneId, siteName, zoneName, contextName });
  
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
    contextInfo: { 
      contextType, 
      contextId, 
      siteId, 
      zoneId, 
      contextName,
      siteName,
      zoneName
    },
    data: dataWithDefaultStats,
    isLoading,
    error,
    refetch,
    activeFilter
  };
}
