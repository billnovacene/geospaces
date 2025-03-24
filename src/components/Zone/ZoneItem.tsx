
import { useState } from "react";
import { Zone } from "@/services/interfaces";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ChevronRight, ChevronDown, AlertTriangle, Home } from "lucide-react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { getStatusInfo, getDeviceCount } from "@/utils/zones";

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
  const deviceCount = getDeviceCount(zone);
  
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
          <span className="text-sm text-muted-foreground">{deviceCount} devices</span>
          <Badge variant="outline" className={statusInfo.color}>
            {statusInfo.icon}
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
