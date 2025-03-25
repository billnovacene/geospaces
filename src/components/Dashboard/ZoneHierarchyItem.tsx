
import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { ChevronDown, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Zone } from "@/services/interfaces";
import { useQuery } from "@tanstack/react-query";
import { findZoneSensors } from "@/services/sensors/zone-sensors";

interface ZoneHierarchyItemProps {
  zone: Zone;
  activeZoneId: number | null;
  expandedZones: number[];
  toggleExpanded: (zoneId: number) => void;
  preserveDashboardRoute?: boolean;
  dashboardPath?: string;
  effectiveSiteId: number;
  hideZonesWithoutSensors?: boolean;
}

export function ZoneHierarchyItem({ 
  zone, 
  activeZoneId, 
  expandedZones, 
  toggleExpanded,
  preserveDashboardRoute = false,
  dashboardPath = "",
  effectiveSiteId,
  hideZonesWithoutSensors = false
}: ZoneHierarchyItemProps) {
  const location = useLocation();
  const isExpanded = expandedZones.includes(zone.id);
  const isActive = activeZoneId === zone.id;
  const hasChildren = zone.children && zone.children.length > 0;
  const indentationLevel = zone.level || 0;
  const [hasSensors, setHasSensors] = useState<boolean | null>(null);
  const [isLoadingSensors, setIsLoadingSensors] = useState(false);
  
  // Check if this zone has temperature/humidity sensors if we need to filter
  useEffect(() => {
    const checkForSensors = async () => {
      if (hideZonesWithoutSensors && zone.id && effectiveSiteId) {
        try {
          setIsLoadingSensors(true);
          const sensors = await findZoneSensors(zone.id, effectiveSiteId);
          const hasTempOrHumidity = sensors.temperature.length > 0 || sensors.humidity.length > 0;
          setHasSensors(hasTempOrHumidity);
          console.log(`Zone ${zone.id} (${zone.name}) has sensors: ${hasTempOrHumidity}`);
        } catch (error) {
          console.error(`Failed to check sensors for zone ${zone.id}:`, error);
          setHasSensors(false);
        } finally {
          setIsLoadingSensors(false);
        }
      } else {
        // If not filtering, all zones are valid
        setHasSensors(true);
      }
    };
    
    checkForSensors();
  }, [zone.id, effectiveSiteId, hideZonesWithoutSensors]);
  
  // If we're hiding zones without sensors and this one doesn't have any, don't render
  if (hideZonesWithoutSensors && hasSensors === false) {
    return null;
  }
  
  // Create the zone link with appropriate dashboard path
  const zoneLink = preserveDashboardRoute && dashboardPath 
    ? `/zone/${zone.id}${dashboardPath}`
    : `/zone/${zone.id}`;
  
  return (
    <>
      <div 
        className={cn(
          "flex items-center gap-1.5 py-2 cursor-pointer hover:bg-gray-100/50",
          isActive ? "bg-gray-100" : ""
        )}
        style={{ paddingLeft: `${indentationLevel * 12 + 20}px` }}
      >
        {hasChildren ? (
          <button 
            onClick={() => toggleExpanded(zone.id)}
            className="text-gray-500 hover:text-gray-700 p-0.5"
          >
            {isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
          </button>
        ) : (
          <div className="w-5" />
        )}
        
        <Link to={zoneLink} className="flex-1 flex items-center">
          <span className={`text-sm ${isActive ? "font-medium" : ""}`}>
            {zone.name}
          </span>
          
          {isLoadingSensors && (
            <span className="ml-2 inline-block h-2 w-2 animate-pulse rounded-full bg-gray-200"></span>
          )}
          
          {hasSensors === true && hideZonesWithoutSensors && (
            <span className="ml-2 inline-block h-2 w-2 rounded-full bg-green-500"></span>
          )}
        </Link>
      </div>
      
      {isExpanded && hasChildren && (
        <div>
          {zone.children?.map(childZone => (
            <ZoneHierarchyItem
              key={childZone.id}
              zone={childZone}
              activeZoneId={activeZoneId}
              expandedZones={expandedZones}
              toggleExpanded={toggleExpanded}
              preserveDashboardRoute={preserveDashboardRoute}
              dashboardPath={dashboardPath}
              effectiveSiteId={effectiveSiteId}
              hideZonesWithoutSensors={hideZonesWithoutSensors}
            />
          ))}
        </div>
      )}
    </>
  );
}
