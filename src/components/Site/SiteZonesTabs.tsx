
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ZonesList } from "@/components/Site/ZonesList";
import { ZonesHierarchyList } from "@/components/Site/ZonesHierarchyList";
import { AlertTriangle, Cpu } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { fetchDevicesCountForSite } from "@/services/device-sites";
import { Badge } from "@/components/ui/badge";
import { useState, useEffect } from "react";

interface SiteZonesTabsProps {
  siteId: number;
}

export function SiteZonesTabs({ siteId }: SiteZonesTabsProps) {
  const [deviceCount, setDeviceCount] = useState<number>(0);
  const [isDeviceCountError, setIsDeviceCountError] = useState<boolean>(false);
  
  // Check if we have a valid siteId
  const isValidSiteId = siteId && !isNaN(Number(siteId));
  
  // Fetch device count for this site with proper error handling
  const { data: apiDeviceCount, isLoading, error } = useQuery({
    queryKey: ["devices-count", siteId],
    queryFn: () => fetchDevicesCountForSite(siteId),
    enabled: isValidSiteId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 1, // Limit retries to prevent excessive requests
    refetchOnWindowFocus: false,
  });
  
  // Handle updating deviceCount state when the API response changes
  useEffect(() => {
    if (apiDeviceCount !== undefined) {
      setDeviceCount(apiDeviceCount);
      setIsDeviceCountError(false);
    }
  }, [apiDeviceCount]);
  
  // Handle API errors for device count
  useEffect(() => {
    if (error) {
      console.error("Error fetching device count:", error);
      setIsDeviceCountError(true);
    }
  }, [error]);

  if (!isValidSiteId) {
    return (
      <div className="flex items-center gap-2 p-4 bg-amber-50 text-amber-700 rounded-md">
        <AlertTriangle className="h-5 w-5" />
        <div>
          <h3 className="font-medium">Invalid Site ID</h3>
          <p className="text-sm">Please select a valid site to view its zones.</p>
        </div>
      </div>
    );
  }

  return (
    <Tabs defaultValue="hierarchy" className="w-full">
      <TabsList className="mb-4 bg-gray-100 flex justify-between">
        <div className="flex">
          <TabsTrigger value="hierarchy" className="data-[state=active]:bg-white data-[state=active]:text-[#6CAE3E]">Hierarchical View</TabsTrigger>
          <TabsTrigger value="list" className="data-[state=active]:bg-white data-[state=active]:text-[#6CAE3E]">List View</TabsTrigger>
        </div>
        <Badge variant="outline" className="mr-2 bg-[#6CAE3E]/10 text-[#6CAE3E] border-[#6CAE3E]/20 flex items-center">
          <Cpu className="h-3.5 w-3.5 mr-1" />
          {isLoading ? '...' : isDeviceCountError ? '?' : deviceCount} {deviceCount === 1 ? 'Device' : 'Devices'}
        </Badge>
      </TabsList>
      <TabsContent value="hierarchy">
        <ZonesHierarchyList siteId={siteId} />
      </TabsContent>
      <TabsContent value="list">
        <ZonesList siteId={siteId} />
      </TabsContent>
    </Tabs>
  );
}
