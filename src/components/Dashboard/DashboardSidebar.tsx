
import React from "react";
import { Sidebar, SidebarContent as UISidebarContent } from "@/components/ui/sidebar";
import { SidebarHeader } from "./SidebarComponents/SidebarHeader";
import { SidebarDashboardsSection } from "./SidebarComponents/SidebarDashboardsSection";
import { SidebarContent } from "./SidebarComponents/SidebarContent";
import { SidebarFooterContent } from "./SidebarComponents/SidebarFooter";
import { useSidebarData } from "./SidebarComponents/useSidebarData";

export function DashboardSidebar() {
  const {
    validSiteId,
    validZoneId,
    zoneData,
    effectiveSiteId,
    contextPath,
    isDashboardRoute,
    isTempHumidityRoute,
    isDampMoldRoute
  } = useSidebarData();
  
  return (
    <Sidebar className="border-r border-border">
      <UISidebarContent className="p-0 flex flex-col h-full bg-sidebar">
        <SidebarHeader />

        {/* Sticky Dashboards Section at the top */}
        <SidebarDashboardsSection 
          contextPath={contextPath}
          isTempHumidityRoute={isTempHumidityRoute}
          isDampMoldRoute={isDampMoldRoute}
        />

        {/* Main Content with Sites and Zones */}
        <SidebarContent 
          effectiveSiteId={effectiveSiteId}
          validZoneId={validZoneId}
          zoneData={zoneData}
          isDashboardRoute={isDashboardRoute}
          isTempHumidityRoute={isTempHumidityRoute}
          isDampMoldRoute={isDampMoldRoute}
        />
      </UISidebarContent>

      <SidebarFooterContent />
    </Sidebar>
  );
}
