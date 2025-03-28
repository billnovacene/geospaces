
import { useParams, useLocation } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { fetchZone } from "@/services/zones";

export function useSidebarData() {
  const { siteId, zoneId } = useParams<{ siteId: string, zoneId: string }>();
  const location = useLocation();
  
  // Check if we're on dashboard routes
  const isDashboardRoute = location.pathname.includes('/dashboard');
  const isTempHumidityRoute = location.pathname.includes('/dashboard/temp-humidity');
  const isDampMoldRoute = location.pathname.includes('/dashboard/damp-mold');
  
  const validSiteId = siteId && !isNaN(Number(siteId)) ? Number(siteId) : null;
  const validZoneId = zoneId && !isNaN(Number(zoneId)) ? Number(zoneId) : null;
  
  // Fetch zone data if we have a zone ID
  const { data: zoneData } = useQuery({
    queryKey: ["zone-for-sidebar", validZoneId],
    queryFn: () => fetchZone(Number(validZoneId)),
    enabled: !!validZoneId,
  });

  // Determine the effective site ID from either direct site ID or from zone data
  const effectiveSiteId = validSiteId || (zoneData?.siteId ? zoneData.siteId : null);
  
  // Determine context path for links
  const contextPath = zoneId ? `/zone/${zoneId}` : (siteId ? `/site/${siteId}` : '');

  return {
    validSiteId,
    validZoneId,
    zoneData,
    effectiveSiteId,
    contextPath,
    isDashboardRoute,
    isTempHumidityRoute,
    isDampMoldRoute
  };
}
