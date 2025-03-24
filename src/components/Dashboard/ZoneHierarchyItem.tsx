
import { useState } from "react";
import { Link } from "react-router-dom";
import { MapPin } from "lucide-react";
import { cn } from "@/lib/utils";
import { Zone } from "@/services/interfaces";

interface ZoneHierarchyItemProps {
  zone: Zone;
  depth?: number;
  activeZoneId: number | null;
  expandedZones: number[];
  toggleExpanded: (zoneId: number) => void;
}

export function ZoneHierarchyItem({ 
  zone, 
  depth = 0, 
  activeZoneId, 
  expandedZones, 
  toggleExpanded 
}: ZoneHierarchyItemProps) {
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
            to={`/zone/${zone.id}`}
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
            />
          ))}
        </div>
      )}
    </div>
  );
}
