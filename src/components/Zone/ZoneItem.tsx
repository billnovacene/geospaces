
import { useState } from "react";
import { Zone } from "@/services/interfaces";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ChevronRight, ChevronDown, AlertTriangle, Home } from "lucide-react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { getStatusInfo } from "@/utils/zones";
import { useQuery } from "@tanstack/react-query";
import { fetchDevicesCountForZone } from "@/services/devices";
import { Skeleton } from "@/components/ui/skeleton";
import { calculateTotalZoneDevices, sumZoneAndChildrenDevices } from "@/utils/zoneUtils";

interface ZoneItemProps {
  zone: Zone;
  depth?: number;
  expandedZones: number[];
  toggleExpand: (zoneId: number) => void;
}

export function ZoneItem({ zone, depth = 0, expandedZones, toggleExpand }: ZoneItemProps) {
  const isExpanded = expandedZones.includes(zone.id);
  const hasChildren = zone.children && zone.children.length > 0;
  const statusInfo = getStatusInfo(zone.status || "Unknown");
  
  // Get direct device count for this zone via API
  const { data: directDeviceCount, isLoading: deviceCountLoading } = useQuery({
    queryKey: ["zone-devices", zone.id],
    queryFn: () => fetchDevicesCountForZone(zone.id),
    enabled: !!zone.id,
    // Don't refetch unnecessarily
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
  
  // Log the direct device count when it changes
  if (directDeviceCount !== undefined) {
    console.log(`API: Direct device count for zone ${zone.id} (${zone.name}): ${directDeviceCount}`);
  }
  
  // For debugging: log the raw device count from the zone object
  console.log(`RAW: Zone ${zone.name} (ID: ${zone.id}) raw devices property: ${zone.devices} (${typeof zone.devices})`);
  
  // Calculate direct device count from zone data
  const zoneDirectDevices = calculateTotalZoneDevices(zone);
  
  // Only sum up children's devices if this is a parent zone
  let totalDeviceCount = zoneDirectDevices;
  if (hasChildren) {
    // Calculate total by summing this zone's devices with children's devices
    const summedTotal = sumZoneAndChildrenDevices(zone);
    
    console.log(`DISPLAY: Zone ${zone.name} - Direct count: ${zoneDirectDevices}, Total including children: ${summedTotal}`);
    
    // Debug log for child zones
    if (zone.children) {
      console.log(`Children of ${zone.name}:`);
      zone.children.forEach(child => {
        const childDevices = calculateTotalZoneDevices(child);
        console.log(`- ${child.name}: ${childDevices} direct devices`);
      });
    }
  }
  
  // Render the appropriate status icon based on the icon name
  const renderStatusIcon = () => {
    if (statusInfo.icon === "AlertTriangle") {
      return <AlertTriangle className="h-3.5 w-3.5 mr-1" />;
    }
    return null;
  };
  
  return (
    <div className="border-b last:border-b-0">
      <div 
        className={cn(
          "flex items-center py-2 px-3 hover:bg-muted/50 cursor-pointer",
          depth > 0 && "pl-8"
        )}
        style={{ paddingLeft: `${depth * 1.5 + 0.75}rem` }}
        onClick={() => hasChildren && toggleExpand(zone.id)}
      >
        <div className="flex items-center flex-1">
          {hasChildren ? (
            isExpanded ? 
              <ChevronDown className="h-4 w-4 mr-2 flex-shrink-0" /> : 
              <ChevronRight className="h-4 w-4 mr-2 flex-shrink-0" />
          ) : (
            <div className="w-6" /> // Spacer to align items
          )}
          <div className="flex flex-col">
            <span className="font-medium">{zone.name}</span>
            {zone.type && (
              <span className="text-xs text-muted-foreground flex items-center">
                <Home className="h-3 w-3 mr-1" />{zone.type}
              </span>
            )}
          </div>
        </div>
        <div className="flex items-center gap-3">
          {deviceCountLoading ? (
            <Skeleton className="h-4 w-16" />
          ) : (
            <div className="text-sm text-muted-foreground">
              {hasChildren ? (
                // For parent zones with children, ONLY show direct device count
                // This is a key change - we're not showing combined counts anymore
                <span title="Direct devices in this zone">
                  {directDeviceCount || zoneDirectDevices} devices
                </span>
              ) : (
                // For leaf zones, just show device count
                <span>{directDeviceCount || zoneDirectDevices} devices</span>
              )}
            </div>
          )}
          <Badge variant="outline" className={statusInfo.color}>
            {renderStatusIcon()}
            {zone.status || "Unknown"}
          </Badge>
          <Button variant="outline" size="sm" asChild onClick={e => e.stopPropagation()}>
            <Link to={`/zone/${zone.id}`}>View</Link>
          </Button>
        </div>
      </div>
      {isExpanded && hasChildren && (
        <div className="border-t">
          {zone.children!.map(child => (
            <ZoneItem 
              key={child.id} 
              zone={child} 
              depth={depth + 1} 
              expandedZones={expandedZones}
              toggleExpand={toggleExpand}
            />
          ))}
        </div>
      )}
    </div>
  );
}
