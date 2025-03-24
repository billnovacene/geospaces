
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ZonesList } from "@/components/Site/ZonesList";
import { ZonesHierarchyList } from "@/components/Site/ZonesHierarchyList";

interface SiteZonesTabsProps {
  siteId: number;
}

export function SiteZonesTabs({ siteId }: SiteZonesTabsProps) {
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
