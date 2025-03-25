
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ZonesList } from "@/components/Site/ZonesList";
import { ZonesHierarchyList } from "@/components/Site/ZonesHierarchyList";
import { AlertTriangle } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { fetchDevicesCountForSite } from "@/services/api";

interface SiteZonesTabsProps {
  siteId: number;
}

export function SiteZonesTabs({ siteId }: SiteZonesTabsProps) {
  const [activeTab, setActiveTab] = useState<string>("hierarchy");
  
  // Check if we have a valid siteId
  const isValidSiteId = siteId && !isNaN(Number(siteId));

  // Fetch device count with proper query options
  const { data: deviceCount } = useQuery({
    queryKey: ["site-devices-count", siteId],
    queryFn: () => fetchDevicesCountForSite(siteId),
    enabled: isValidSiteId,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    refetchOnWindowFocus: false,
    retry: 1,
  });

  if (!isValidSiteId) {
    return (
      <div className="flex items-center gap-2 p-3 bg-amber-50 text-amber-700 rounded-md">
        <AlertTriangle className="h-4 w-4" />
        <div>
          <h3 className="font-medium text-sm">Invalid Site ID</h3>
          <p className="text-xs">Please select a valid site to view its zones.</p>
        </div>
      </div>
    );
  }

  return (
    <Tabs defaultValue="hierarchy" value={activeTab} onValueChange={setActiveTab} className="w-full">
      <div className="flex justify-between items-center mb-2">
        <TabsList className="h-8">
          <TabsTrigger value="hierarchy" className="text-xs px-3 py-1.5">Hierarchical View</TabsTrigger>
          <TabsTrigger value="list" className="text-xs px-3 py-1.5">List View</TabsTrigger>
        </TabsList>
      </div>
      
      <TabsContent value="hierarchy" className="mt-1">
        <ZonesHierarchyList siteId={siteId} />
      </TabsContent>
      <TabsContent value="list" className="mt-1">
        <ZonesList siteId={siteId} />
      </TabsContent>
    </Tabs>
  );
}
