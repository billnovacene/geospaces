
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
  const hasFetchedRef = useRef(false);
  const isLoadingRef = useRef(false);
  const [zones, setZones] = useState<Zone[]>([]);
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const abortControllerRef = useRef<AbortController | null>(null);
  
  // Cleanup function for any pending requests
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);
  
  // Fetch zones once when component mounts or siteId changes
  useEffect(() => {
    const fetchZonesData = async () => {
      if (!siteId || isLoadingRef.current || hasFetchedRef.current) {
        return;
      }
      
      // Abort any existing request
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      
      try {
        isLoadingRef.current = true;
        setIsLoading(true);
        
        console.log(`Manually fetching zones for site ${siteId}`);
        
        // Create a new abort controller with timeout
        abortControllerRef.current = new AbortController();
        const timeoutId = setTimeout(() => {
          if (abortControllerRef.current) {
            console.log("Zones fetch timeout - aborting");
            abortControllerRef.current.abort();
          }
        }, 10000); // 10 second timeout
        
        // Fetch zones with the abort signal
        const fetchedZones = await fetchZones(siteId);
        clearTimeout(timeoutId);
        
        console.log(`Fetched ${fetchedZones.length} zones successfully`);
        setZones(fetchedZones);
        hasFetchedRef.current = true;
      } catch (error) {
        console.error("Error fetching zones:", error);
        setIsError(true);
      } finally {
        isLoadingRef.current = false;
        setIsLoading(false);
      }
    };
    
    fetchZonesData();
  }, [siteId]);

  // Filter zones based on search term - safely handle empty or undefined zones
  const filteredZones = zones && zones.length > 0 
    ? zones.filter(zone => 
        zone && zone.name && zone.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        (zone.type && zone.type.toLowerCase().includes(searchTerm.toLowerCase()))
      )
    : [];

  // Toggle expanded state for a zone
  const toggleExpand = (zoneId: number) => {
    setExpandedZones(prev => 
      prev.includes(zoneId) 
        ? prev.filter(id => id !== zoneId)
        : [...prev, zoneId]
    );
  };

  // Safely organize zones hierarchy
  const hierarchicalZones = filteredZones.length > 0 
    ? organizeZonesHierarchy(filteredZones)
    : [];

  if (isError) {
    return <ZonesErrorState />;
  }

  return (
    <Card className="dashboard-card overflow-hidden shadow-sm border-0">
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
      {siteId && zones && zones.length > 0 && (
        <CardFooter className="p-4 text-sm text-muted-foreground flex justify-between items-center">
          <div>Total zones: {zones.length}</div>
          <div>Showing {filteredZones.length} of {zones.length}</div>
        </CardFooter>
      )}
    </Card>
  );
}
