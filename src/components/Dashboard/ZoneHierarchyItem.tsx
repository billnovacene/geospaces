import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { MapPin } from "lucide-react";
import { cn } from "@/lib/utils";
import { Zone } from "@/services/interfaces";
import { useQuery } from "@tanstack/react-query";
import { findZoneSensors } from "@/services/sensors/zone-sensors";

interface ZoneHierarchyItemProps {
  zone: Zone;
  depth?: number;
  activeZoneId: number | null;
  expandedZones: number[];
  toggleExpanded: (zoneId: number) => void;
  preserveDashboardRoute?: boolean;
  dashboardPath?: string;
  effectiveSiteId?: number | null;
  hideZonesWithoutSensors?: boolean;
  hideEmptyZones?: boolean;
}

export function ZoneHierarchyItem({ 
  zone, 
  depth = 0, 
  activeZoneId, 
  expandedZones, 
  toggleExpanded,
  preserveDashboardRoute = false,
  dashboardPath = "",
  effectiveSiteId,
  hideZonesWithoutSensors = false,
  hideEmptyZones = false
}: ZoneHierarchyItemProps) {
  const [shouldRender, setShouldRender] = useState(true);
  
  // Check for sensors in this zone if needed
  const { data: zoneSensors, isLoading: sensorsLoading } = useQuery({
    queryKey: ["zone-sensors-check", zone.id],
    queryFn: () => findZoneSensors(zone.id, zone.siteId || effectiveSiteId || 0),
    enabled: hideZonesWithoutSensors && !!zone.id && !!(zone.siteId || effectiveSiteId),
  });
  
  useEffect(() => {
    // Only apply filtering when explicitly requested AND sensor data is loaded
    if (hideZonesWithoutSensors && !sensorsLoading && zoneSensors) {
      const hasSensors = zoneSensors.temperature.length > 0 || zoneSensors.humidity.length > 0;
      console.log(`Zone ${zone.name} (ID: ${zone.id}) has sensors: ${hasSensors}`, zoneSensors);
      setShouldRender(hasSensors);
    } else if (hideEmptyZones) {
      // Hide zones with fewer than 1 device, but keep parent zones visible regardless
      const hasDevices = typeof zone.devices === 'number' 
        ? zone.devices >= 1 
        : (parseInt(String(zone.devices), 10) || 0) >= 1;
      
      const hasChildren = zone.children && zone.children.length > 0;
      // Always render if it has children (it's a parent) regardless of device count
      setShouldRender(hasDevices || hasChildren);
    } else {
      setShouldRender(true);
    }
  }, [
    hideZonesWithoutSensors, 
    sensorsLoading, 
    zoneSensors, 
    zone.id, 
    zone.name, 
    hideEmptyZones, 
    zone.devices, 
    zone.children
  ]);

  const hasChildren = zone.children && zone.children.length > 0;
  const isExpanded = expandedZones.includes(zone.id);
  const isActive = activeZoneId === zone.id;
  const deviceCount = typeof zone.devices === 'number' ? zone.devices : parseInt(String(zone.devices), 10) || 0;
  
  // If we need to hide this zone and it's not a rendering candidate, return null
  if (!shouldRender && !sensorsLoading) {
    return null;
  }
  
  // Create zone link with dashboard path if needed
  const zoneLink = preserveDashboardRoute && dashboardPath 
    ? `/zone/${zone.id}${dashboardPath}`
    : `/zone/${zone.id}`;
  
  console.log(`Zone: ${zone.name}, ID: ${zone.id}, isActive: ${isActive}, Link: ${zoneLink}, shouldRender: ${shouldRender}`);
  
  return (
    <div key={zone.id}>
      <div 
        className={cn(
          "flex items-center justify-between py-2.5 px-5 cursor-pointer hover:bg-[#F5F5F6]",
          isActive && "bg-[#F9F9FA] font-bold border-l-4 border-primary text-primary",
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
            to={zoneLink}
            className={cn(
              "text-sm text-gray-900",
              isActive && "font-bold"
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
          {zone.children.map(childZone => (
            <ZoneHierarchyItem
              key={childZone.id}
              zone={childZone}
              depth={depth + 1}
              activeZoneId={activeZoneId}
              expandedZones={expandedZones}
              toggleExpanded={toggleExpanded}
              preserveDashboardRoute={preserveDashboardRoute}
              dashboardPath={dashboardPath}
              effectiveSiteId={effectiveSiteId}
              hideZonesWithoutSensors={hideZonesWithoutSensors}
              hideEmptyZones={hideEmptyZones}
            />
          ))}
        </div>
      )}
    </div>
  );
}
