
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchZones } from "@/services/api";
import { Zone } from "@/services/interfaces";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ZoneItem } from "@/components/Zone/ZoneItem";
import { ZonesEmptyState } from "@/components/Zone/ZonesEmptyState";
import { ZonesHierarchyHeader } from "@/components/Zone/ZonesHierarchyHeader";
import { ZonesErrorState } from "@/components/Zone/ZonesErrorState";
import { organizeZonesHierarchy } from "@/utils/zones";
import { HelpCircle } from "lucide-react";
import { TooltipWrapper } from "@/components/UI/TooltipWrapper";

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

  // Toggle expanded state for a zone
  const toggleExpand = (zoneId: number) => {
    setExpandedZones(prev => 
      prev.includes(zoneId) 
        ? prev.filter(id => id !== zoneId)
        : [...prev, zoneId]
    );
  };

  const hierarchicalZones = organizeZonesHierarchy(filteredZones);

  if (error) {
    return <ZonesErrorState />;
  }

  return (
    <Card className="dashboard-card overflow-hidden">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <ZonesHierarchyHeader searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
          <TooltipWrapper content="For parent zones, device counts show direct devices in this zone">
            <HelpCircle className="h-4 w-4 text-muted-foreground" />
          </TooltipWrapper>
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
        ) : filteredZones.length === 0 ? (
          <ZonesEmptyState siteId={siteId} searchTerm={searchTerm} />
        ) : (
          <div className="border rounded-md overflow-hidden">
            {hierarchicalZones.map(zone => (
              <ZoneItem 
                key={zone.id} 
                zone={zone} 
                expandedZones={expandedZones}
                toggleExpand={toggleExpand}
              />
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
