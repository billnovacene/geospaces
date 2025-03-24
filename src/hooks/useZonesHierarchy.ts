
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchZonesHierarchy, fetchZone } from "@/services/zones";
import { Zone } from "@/services/interfaces";

export function useZonesHierarchy(propsSiteId: number | null, activeZoneId: number | null) {
  const [expandedZones, setExpandedZones] = useState<number[]>([]);
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
    if (activeZoneId && zones && zones.length > 0) {
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

  return {
    effectiveSiteId,
    zones,
    isLoading,
    error,
    expandedZones,
    toggleExpanded
  };
}
