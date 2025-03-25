
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ZonesList } from "@/components/Site/ZonesList";
import { ZonesHierarchyList } from "@/components/Site/ZonesHierarchyList";
import { AlertTriangle } from "lucide-react";

interface SiteZonesTabsProps {
  siteId: number;
}

export function SiteZonesTabs({ siteId }: SiteZonesTabsProps) {
  // Check if we have a valid siteId
  const isValidSiteId = siteId && !isNaN(Number(siteId));

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
    <Tabs defaultValue="hierarchy" className="mb-8">
      <TabsList className="mb-4">
        <TabsTrigger value="hierarchy">Hierarchical View</TabsTrigger>
        <TabsTrigger value="list">List View</TabsTrigger>
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
