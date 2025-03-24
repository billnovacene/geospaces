
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchZones, zoneDevicesCache } from "@/services/api";
import { Zone } from "@/services/interfaces";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Search, ChevronRight, ChevronDown, AlertTriangle, Home } from "lucide-react";
import { Input } from "@/components/ui/input";
import { format } from "date-fns";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ZonesHierarchyListProps {
  siteId?: number;
}

export function ZonesHierarchyList({ siteId }: ZonesHierarchyListProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [expandedZones, setExpandedZones] = useState<number[]>([]);
  
  const { data: allZones = [], isLoading, error } = useQuery({
    queryKey: ["zones", siteId],
    queryFn: () => siteId ? fetchZones(siteId) : Promise.resolve([]),
    enabled: !!siteId,
  });

  // Filter zones based on search term
  const filteredZones = allZones.filter(zone => 
    zone.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    (zone.type && zone.type.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Organize zones into hierarchy
  const organizeZonesHierarchy = (zones: Zone[]): Zone[] => {
    // Create a map of zones by ID for easy lookup
    const zoneMap = new Map<number, Zone>();
    zones.forEach(zone => {
      // Create a children array for each zone if it doesn't exist
      if (!zone.children) zone.children = [];
      zoneMap.set(zone.id, zone);
    });

    // Identify top-level zones and build the hierarchy
    const topLevelZones: Zone[] = [];

    zones.forEach(zone => {
      // If the zone has a parent, add it as a child to the parent
      if (zone.parent !== undefined && zone.parent !== null && zoneMap.has(zone.parent)) {
        const parentZone = zoneMap.get(zone.parent);
        if (parentZone && parentZone.children) {
          // Check if this child is already in the parent's children array
          if (!parentZone.children.some(child => child.id === zone.id)) {
            parentZone.children.push(zone);
          }
        }
      } else {
        // If it doesn't have a parent, it's a top-level zone
        if (!topLevelZones.some(tlz => tlz.id === zone.id)) {
          topLevelZones.push(zone);
        }
      }
    });

    return topLevelZones;
  };

  const hierarchicalZones = organizeZonesHierarchy(filteredZones);

  // Toggle expanded state for a zone
  const toggleExpand = (zoneId: number) => {
    setExpandedZones(prev => 
      prev.includes(zoneId) 
        ? prev.filter(id => id !== zoneId)
        : [...prev, zoneId]
    );
  };

  // Get status color and icon
  const getStatusInfo = (status: string) => {
    switch (status.toLowerCase()) {
      case "active":
        return {
          color: "bg-green-100 text-green-800",
          icon: null
        };
      case "warning":
        return {
          color: "bg-yellow-100 text-yellow-800",
          icon: <AlertTriangle className="h-3.5 w-3.5 mr-1" />
        };
      case "inactive":
        return {
          color: "bg-red-100 text-red-800",
          icon: null
        };
      default:
        return {
          color: "bg-gray-100 text-gray-800",
          icon: null
        };
    }
  };

  // Format date
  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "MMM d, yyyy");
    } catch (e) {
      return dateString;
    }
  };

  // Get device count (prioritize cache)
  const getDeviceCount = (zone: Zone) => {
    if (zone.id && zoneDevicesCache[zone.id] !== undefined && zoneDevicesCache[zone.id] > 0) {
      return zoneDevicesCache[zone.id];
    }
    return typeof zone.devices === 'number' ? zone.devices : parseInt(String(zone.devices), 10) || 0;
  };

  // Recursive component to render a zone and its children
  const ZoneItem = ({ zone, depth = 0 }: { zone: Zone, depth?: number }) => {
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
              <ZoneItem key={child.id} zone={child} depth={depth + 1} />
            ))}
          </div>
        )}
      </div>
    );
  };

  if (error) {
    return (
      <Card className="dashboard-card">
        <CardContent className="pt-6">
          <div className="flex flex-col items-center justify-center h-40 text-center">
            <p className="text-destructive mb-2">Failed to load zones</p>
            <p className="text-muted-foreground text-sm">Please try again later or check your connection</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="dashboard-card overflow-hidden">
      <CardHeader className="pb-4">
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
          <div>
            <CardTitle className="text-2xl font-bold">Zones Hierarchy</CardTitle>
            <CardDescription>
              View the hierarchical structure of zones for this site
            </CardDescription>
          </div>
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search zones..."
              className="pl-8 max-w-xs"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="flex items-center gap-4 p-4 border rounded-md">
                <div className="space-y-2">
                  <Skeleton className="h-5 w-40" />
                  <Skeleton className="h-4 w-24" />
                </div>
                <div className="ml-auto">
                  <Skeleton className="h-6 w-20" />
                </div>
              </div>
            ))}
          </div>
        ) : !siteId ? (
          <div className="flex flex-col items-center justify-center h-40 text-center">
            <p className="text-lg font-medium mb-2">No site selected</p>
            <p className="text-muted-foreground text-sm">
              Select a site to view its zones
            </p>
          </div>
        ) : filteredZones.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-40 text-center">
            <p className="text-lg font-medium mb-2">No zones found</p>
            <p className="text-muted-foreground text-sm">
              {searchTerm ? "Try a different search term" : "This site doesn't have any zones yet"}
            </p>
          </div>
        ) : (
          <div className="border rounded-md overflow-hidden">
            {hierarchicalZones.map(zone => (
              <ZoneItem key={zone.id} zone={zone} />
            ))}
          </div>
        )}
      </CardContent>
      {siteId && allZones.length > 0 && (
        <CardFooter className="border-t p-4 text-sm text-muted-foreground flex justify-between items-center">
          <div>Total zones: {allZones.length}</div>
          <div>Showing {filteredZones.length} of {allZones.length}</div>
        </CardFooter>
      )}
    </Card>
  );
}
