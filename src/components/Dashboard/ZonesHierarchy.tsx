
import { useState, useEffect } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { AlertTriangle, Home, MapPin } from "lucide-react";
import { cn } from "@/lib/utils";
import { fetchZonesHierarchy, fetchZone } from "@/services/zones";
import { Zone } from "@/services/interfaces";
import { toast } from "sonner";

interface ZonesHierarchyProps {
  siteId: number | null;
}

export function ZonesHierarchy({ siteId: propsSiteId }: ZonesHierarchyProps) {
  const [expandedZones, setExpandedZones] = useState<number[]>([]);
  const location = useLocation();
  const { zoneId } = useParams<{ zoneId: string }>();
  const activeZoneId = zoneId ? Number(zoneId) : null;
  const [effectiveSiteId, setEffectiveSiteId] = useState<number | null>(propsSiteId);
  
  // If we have a zoneId but no siteId, fetch the zone to get its siteId
  const { data: zoneData } = useQuery({
    queryKey: ["zone-for-sidebar", activeZoneId],
    queryFn: () => fetchZone(Number(activeZoneId)),
    enabled: !!activeZoneId && !propsSiteId,
  });
  
  // Update effectiveSiteId when zoneData or propsSiteId changes
  useEffect(() => {
    if (zoneData && zoneData.siteId && zoneData.siteId !== effectiveSiteId) {
      console.log("Setting effective siteId from zone data:", zoneData.siteId);
      setEffectiveSiteId(zoneData.siteId);
    }
  }, [zoneData, effectiveSiteId]);
  
  // Update effectiveSiteId when propsSiteId changes
  useEffect(() => {
    if (propsSiteId) {
      setEffectiveSiteId(propsSiteId);
    } else if (zoneData && zoneData.siteId) {
      setEffectiveSiteId(zoneData.siteId);
    }
  }, [propsSiteId, zoneData]);
  
  console.log("ZonesHierarchy: Passed siteId:", propsSiteId);
  console.log("ZonesHierarchy: Effective siteId:", effectiveSiteId);
  console.log("ZonesHierarchy: Current activeZoneId:", activeZoneId);
  
  // Fetch zones hierarchy data for the sidebar
  const { data: zones = [], isLoading, error } = useQuery({
    queryKey: ["zones-hierarchy", effectiveSiteId],
    queryFn: () => effectiveSiteId ? fetchZonesHierarchy(effectiveSiteId) : Promise.resolve([]),
    enabled: !!effectiveSiteId,
  });
  
  // Log zones data for debugging
  useEffect(() => {
    console.log("ZonesHierarchy: Zones data received:", zones);
    console.log("ZonesHierarchy: Number of zones:", zones.length);
  }, [zones]);
  
  // Expand parent zones of the active zone automatically
  useEffect(() => {
    if (activeZoneId && zones) {
      // Find parent zones of the active zone
      const findParentZones = (zonesList: Zone[], targetId: number, parents: number[] = []): number[] => {
        for (const zone of zonesList) {
          if (zone.id === targetId) {
            return parents;
          }
          
          if (zone.children && zone.children.length > 0) {
            const result = findParentZones(zone.children, targetId, [...parents, zone.id]);
            if (result.length) return result;
          }
        }
        return [];
      };
      
      // Find all parent zones and expand them
      const parentZones = findParentZones(zones, activeZoneId);
      if (parentZones.length > 0) {
        setExpandedZones(prev => [...new Set([...prev, ...parentZones])]);
      }
    }
  }, [activeZoneId, zones]);
  
  // Toggle expanded state of parent zones
  const toggleExpanded = (zoneId: number) => {
    setExpandedZones(prev => 
      prev.includes(zoneId) 
        ? prev.filter(id => id !== zoneId)
        : [...prev, zoneId]
    );
  };
  
  // Render zone items recursively
  const renderZoneItems = (zones: Zone[], depth = 0) => {
    if (!zones || zones.length === 0) {
      console.log(`No zones to render at depth ${depth}`);
      return null;
    }
    
    console.log(`Rendering ${zones.length} zones at depth ${depth}`);
    
    return zones.map(zone => {
      const hasChildren = zone.children && zone.children.length > 0;
      const isExpanded = expandedZones.includes(zone.id);
      const isActive = activeZoneId === zone.id;
      const deviceCount = typeof zone.devices === 'number' ? zone.devices : parseInt(String(zone.devices), 10) || 0;
      
      console.log(`Zone: ${zone.name}, ID: ${zone.id}, isActive: ${isActive}, Children: ${zone.children?.length || 0}`);
      
      return (
        <div key={zone.id}>
          <div 
            className={cn(
              "flex items-center justify-between py-2.5 px-5 cursor-pointer hover:bg-[#F5F5F6]",
              isActive && "bg-[#F9F9FA] font-bold border-l-4 border-primary text-primary", // Enhanced active state
              depth > 0 && "pl-8"
            )}
            style={{ paddingLeft: depth > 0 ? `${depth * 12 + 20}px` : undefined }}
            onClick={() => hasChildren && toggleExpanded(zone.id)}
          >
            <div className="flex items-center gap-2">
              {hasChildren && (
                <span className="text-xs text-zinc-600">
                  {isExpanded ? '▼' : '▶'}
                </span>
              )}
              <Link 
                to={`/zone/${zone.id}`}
                className={cn(
                  "text-sm text-gray-900",
                  isActive && "font-bold" // Bold text for active zone
                )}
                onClick={(e) => e.stopPropagation()}
              >
                {isActive ? (
                  <span className="flex items-center gap-1">
                    <MapPin className="h-3 w-3" /> {zone.name}
                  </span>
                ) : zone.name}
              </Link>
            </div>
            <span className="text-sm text-[#8E9196]">{deviceCount}</span>
          </div>
          
          {hasChildren && isExpanded && (
            <div className="zone-children">
              {renderZoneItems(zone.children, depth + 1)}
            </div>
          )}
        </div>
      );
    });
  };
  
  if (!effectiveSiteId) {
    return (
      <div className="py-2.5 px-5 text-sm text-zinc-500 flex flex-col gap-2">
        <div className="flex items-center gap-2 text-amber-600">
          <AlertTriangle className="h-4 w-4" />
          <span>No site selected</span>
        </div>
        <p className="text-xs text-zinc-400">Select a site to view its zones</p>
        <Link to="/" className="text-xs text-primary hover:underline mt-1">
          Go to dashboard
        </Link>
      </div>
    );
  }
  
  // Log rendering information
  console.log(`Rendering ZonesHierarchy: isLoading=${isLoading}, hasError=${!!error}, zonesCount=${zones?.length}`);
  
  return (
    <>
      <Link to={`/site/${effectiveSiteId}`} className="block">
        <div className="bg-[#F9F9FA] py-2.5 px-5 cursor-pointer hover:bg-[#F5F5F6]">
          <span className="font-medium text-sm text-zinc-950">All zones</span>
        </div>
      </Link>
      
      {isLoading ? (
        <div className="py-2.5 px-5 text-sm text-[#8E9196]">Loading zones...</div>
      ) : error ? (
        <div className="py-2.5 px-5 text-sm text-red-500 flex items-center gap-2">
          <AlertTriangle className="h-4 w-4" />
          <span>Error loading zones</span>
        </div>
      ) : zones.length === 0 ? (
        <div className="py-2.5 px-5 text-sm text-[#8E9196]">No zones available</div>
      ) : (
        renderZoneItems(zones)
      )}
    </>
  );
}
