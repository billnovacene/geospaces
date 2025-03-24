
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
}

export function ZonesHierarchy({ siteId: propsSiteId }: ZonesHierarchyProps) {
  const location = useLocation();
  const { zoneId } = useParams<{ zoneId: string }>();
  const activeZoneId = zoneId ? Number(zoneId) : null;
  
  console.log("ZonesHierarchy: Passed siteId:", propsSiteId);
  console.log("ZonesHierarchy: Current activeZoneId:", activeZoneId);
  
  const {
    effectiveSiteId,
    zones,
    isLoading,
    error,
    expandedZones,
    toggleExpanded
  } = useZonesHierarchy(propsSiteId, activeZoneId);
  
  // Log rendering information
  console.log(`Rendering ZonesHierarchy: isLoading=${isLoading}, hasError=${!!error}, zonesCount=${zones?.length}`);
  
  if (!effectiveSiteId) {
    return <NoSiteSelected />;
  }
  
  return (
    <>
      <Link to={`/site/${effectiveSiteId}`} className="block">
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
        zones.map(zone => (
          <ZoneHierarchyItem
            key={zone.id}
            zone={zone}
            activeZoneId={activeZoneId}
            expandedZones={expandedZones}
            toggleExpanded={toggleExpanded}
          />
        ))
      )}
    </>
  );
}
