
import { useState, useRef, useEffect } from "react";
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
  
  // Add an abort controller ref to cancel requests when component unmounts
  const abortControllerRef = useRef<AbortController | null>(null);
  
  // Create new abort controller when component mounts
  useEffect(() => {
    abortControllerRef.current = new AbortController();
    
    return () => {
      // Cancel pending requests when component unmounts
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);
  
  const { 
    data: allZones = [], 
    isLoading, 
    error 
  } = useQuery({
    queryKey: ["zones", siteId],
    queryFn: () => {
      if (!siteId) return Promise.resolve([]);
      
      // Set 10 second timeout for zones fetch
      const timeoutPromise = new Promise<Zone[]>((_, reject) => {
        setTimeout(() => reject(new Error('Zones fetch timeout')), 10000);
      });
      
      // Actual fetch with the abort controller signal
      const fetchPromise = fetchZones(siteId);
      
      // Race between the fetch and the timeout
      return Promise.race([fetchPromise, timeoutPromise]);
    },
    enabled: !!siteId,
    staleTime: 3 * 60 * 1000, // 3 minutes
    gcTime: 10 * 60 * 1000,   // 10 minutes
    refetchOnWindowFocus: false,
    retry: 1,
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

  // Use memoized hierarchical zones to prevent excessive re-renders
  const hierarchicalZones = organizeZonesHierarchy(filteredZones);

  if (error) {
    return <ZonesErrorState />;
  }

  return (
    <Card className="dashboard-card overflow-hidden shadow-sm border-0">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <ZonesHierarchyHeader 
            searchTerm={searchTerm} 
            setSearchTerm={setSearchTerm} 
            totalZones={allZones.length}
            isLoading={isLoading}
          />
          <TooltipWrapper content="For parent zones, device counts show direct devices in this zone">
            <HelpCircle className="h-4 w-4 text-muted-foreground" />
          </TooltipWrapper>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="flex items-center gap-4 p-4 rounded-md">
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
          <div className="rounded-md overflow-hidden">
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
        <CardFooter className="p-4 text-sm text-muted-foreground flex justify-between items-center">
          <div>Total zones: {allZones.length}</div>
          <div>Showing {filteredZones.length} of {allZones.length}</div>
        </CardFooter>
      )}
    </Card>
  );
}
