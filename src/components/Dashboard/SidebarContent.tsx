
import React from "react";
import { SidebarSection } from "./SidebarSection";
import { SitesSidebar } from "./SitesSidebar";
import { ZonesHierarchy } from "./ZonesHierarchy";
import { ScrollArea } from "@/components/ui/scroll-area";

interface SidebarContentProps {
  effectiveSiteId: number | null;
  validZoneId: number | null;
  zoneData: any;
  isDashboardRoute: boolean;
  isTempHumidityRoute: boolean;
  isDampMoldRoute: boolean;
}

export function SidebarContent({
  effectiveSiteId,
  validZoneId,
  zoneData,
  isDashboardRoute,
  isTempHumidityRoute,
  isDampMoldRoute
}: SidebarContentProps) {
  const currentDashboard = isTempHumidityRoute 
    ? "temp-humidity" 
    : isDampMoldRoute 
      ? "damp-mold" 
      : "";

  return (
    <ScrollArea className="flex-1 dark:bg-gray-800">
      {/* Sites Sidebar */}
      <SitesSidebar 
        preserveDashboardRoute={isDashboardRoute} 
        currentDashboard={currentDashboard} 
      />

      {/* Zones Section */}
      <SidebarSection title="Zones">
        {effectiveSiteId ? (
          <ZonesHierarchy 
            siteId={effectiveSiteId} 
            preserveDashboardRoute={isDashboardRoute}
            currentDashboard={currentDashboard}
            hideZonesWithoutSensors={isTempHumidityRoute || isDampMoldRoute}
          />
        ) : validZoneId && zoneData ? (
          <div className="py-2.5 px-5 text-sm dark:text-gray-300">
            <div className="flex items-center gap-1.5 text-sidebar-primary dark:text-primary">
              <span className="font-medium">{zoneData.name}</span>
            </div>
            <div className="text-muted-foreground text-xs mt-1 dark:text-gray-400">
              Module zone (ID: {validZoneId})
            </div>
          </div>
        ) : (
          <div className="py-2.5 px-5 text-sm text-muted-foreground dark:text-gray-400">
            Select a site to view zones
          </div>
        )}
      </SidebarSection>

      {/* Analytics Section */}
      <SidebarSection title="Analytics">
        <div className="py-2.5 px-5 text-sm text-muted-foreground dark:text-gray-400">
          No analytics available
        </div>
      </SidebarSection>

      {/* Settings Section */}
      <SidebarSection title="Settings">
        <div className="py-2.5 px-5 text-sm text-muted-foreground dark:text-gray-400">
          System settings
        </div>
      </SidebarSection>
    </ScrollArea>
  );
}
