
import { useQuery } from "@tanstack/react-query";
import { fetchSite } from "@/services/sites";
import { fetchZone } from "@/services/zones";
import { useParams } from "react-router-dom";

export function useContextName() {
  const { siteId, zoneId } = useParams<{ siteId: string; zoneId: string }>();
  
  const { data: siteData } = useQuery({
    queryKey: ["site-for-context", siteId],
    queryFn: () => fetchSite(Number(siteId)),
    enabled: !!siteId,
  });

  const { data: zoneData } = useQuery({
    queryKey: ["zone-for-context", zoneId],
    queryFn: () => fetchZone(Number(zoneId)),
    enabled: !!zoneId,
  });

  const getContextName = () => {
    if (zoneData) return zoneData.name;
    if (siteData) return siteData.name;
    return "All Locations";
  };

  return { contextName: getContextName(), siteData, zoneData };
}
