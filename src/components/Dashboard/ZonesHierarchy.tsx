
import { useState, useEffect } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { AlertTriangle, Home } from "lucide-react";
import { cn } from "@/lib/utils";
import { fetchZonesHierarchy } from "@/services/zones";
import { Zone } from "@/services/interfaces";

interface ZonesHierarchyProps {
  siteId: number | null;
}

export function ZonesHierarchy({ siteId }: ZonesHierarchyProps) {
  const [expandedZones, setExpandedZones] = useState<number[]>([]);
  const location = useLocation();
  const zoneId = location.pathname.includes('/zone/') ? Number(location.pathname.split('/zone/')[1]) : null;
  
  // Fetch zones hierarchy data for the sidebar
  const { data: zones = [], isLoading, error } = useQuery({
    queryKey: ["zones-hierarchy", siteId],
    queryFn: () => siteId ? fetchZonesHierarchy(siteId) : Promise.resolve([]),
    enabled: !!siteId,
  });
  
  // Expand parent zones of the active zone automatically
  useEffect(() => {
    if (zoneId && zones) {
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
      const parentZones = findParentZones(zones, zoneId);
      if (parentZones.length > 0) {
        setExpandedZones(prev => [...new Set([...prev, ...parentZones])]);
      }
    }
  }, [zoneId, zones]);
  
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
    return zones.map(zone => {
      const hasChildren = zone.children && zone.children.length > 0;
      const isExpanded = expandedZones.includes(zone.id);
      const isActive = zoneId === zone.id;
      const deviceCount = typeof zone.devices === 'number' ? zone.devices : parseInt(String(zone.devices), 10) || 0;
      
      return (
        <div key={zone.id}>
          <div 
            className={cn(
              "flex items-center justify-between py-2.5 px-5 cursor-pointer bg-white sidebar-hover-item",
              isActive && "bg-[#F9F9FA]",
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
                className="text-sm font-medium text-gray-900"
                onClick={(e) => e.stopPropagation()}
              >
                {zone.name}
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
  
  if (!siteId) {
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
  
  return (
    <>
      <Link to={`/site/${siteId}`} className="block">
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
