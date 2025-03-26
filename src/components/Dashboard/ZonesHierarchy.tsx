
import { useParams, useLocation, Link } from "react-router-dom";
import { Package } from "lucide-react";
import { useZonesHierarchy } from "@/hooks/useZonesHierarchy";
import { ZoneHierarchyItem } from "./ZoneHierarchyItem";
import { NoSiteSelected } from "./NoSiteSelected";
import { ZonesLoadingState } from "./ZonesLoadingState";
import { ZonesErrorState } from "./ZonesErrorState";
import { EmptyZonesState } from "./EmptyZonesState";

interface ZonesHierarchyProps {
  siteId: number | null;
  preserveDashboardRoute?: boolean;
  currentDashboard?: string;
}

export function ZonesHierarchy({ 
  siteId: propsSiteId, 
  preserveDashboardRoute = false,
  currentDashboard = ""
}: ZonesHierarchyProps) {
  const location = useLocation();
  const { zoneId } = useParams<{ zoneId: string }>();
  const activeZoneId = zoneId ? Number(zoneId) : null;
  
  console.log("🌍 ZonesHierarchy: Passed siteId:", propsSiteId);
  console.log("🔍 ZonesHierarchy: Current activeZoneId:", activeZoneId);
  
  const {
    effectiveSiteId,
    zones,
    isLoading,
    error,
    expandedZones,
    toggleExpanded
  } = useZonesHierarchy(propsSiteId, activeZoneId);
  
  // Log rendering information
  console.log(`📊 Rendering ZonesHierarchy: 
    - isLoading=${isLoading}, 
    - hasError=${!!error}, 
    - zonesCount=${zones?.length},
    - effectiveSiteId=${effectiveSiteId}`);
  console.log(`🌐 Zones data:`, zones);
  
  if (!effectiveSiteId) {
    console.warn("⚠️ No effective site ID found");
    return <NoSiteSelected />;
  }
  
  const dashboardPath = preserveDashboardRoute && currentDashboard === "temp-humidity" 
    ? '/dashboard/temp-humidity' 
    : '';
  
  // Create the site link with appropriate dashboard path
  const siteLink = dashboardPath 
    ? `/site/${effectiveSiteId}${dashboardPath}`
    : `/site/${effectiveSiteId}`;
  
  return (
    <>
      <Link to={siteLink} className="block">
        <div className="bg-[#F9F9FA] py-2.5 px-5 cursor-pointer hover:bg-[#F5F5F6]">
          <div className="flex items-center gap-1.5">
            <Package className="h-4 w-4" />
            <span className="font-medium text-sm text-zinc-950">All zones</span>
          </div>
        </div>
      </Link>
      
      {isLoading ? (
        <ZonesLoadingState />
      ) : error ? (
        <ZonesErrorState />
      ) : zones.length === 0 ? (
        <EmptyZonesState />
      ) : (
        <div>
          {zones.map(zone => (
            <ZoneHierarchyItem
              key={zone.id}
              zone={zone}
              activeZoneId={activeZoneId}
              expandedZones={expandedZones}
              toggleExpanded={toggleExpanded}
              preserveDashboardRoute={preserveDashboardRoute}
              dashboardPath={dashboardPath}
              effectiveSiteId={effectiveSiteId}
            />
          ))}
        </div>
      )}
    </>
  );
}
