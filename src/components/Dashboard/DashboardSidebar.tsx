
import React, { useEffect } from "react";
import { Sidebar, SidebarContent as UISidebarContent } from "@/components/ui/sidebar";
import { SidebarHeader } from "./SidebarComponents/SidebarHeader";
import { SidebarDashboardsSection } from "./SidebarComponents/SidebarDashboardsSection";
import { SidebarContent } from "./SidebarComponents/SidebarContent";
import { SidebarFooterContent } from "./SidebarComponents/SidebarFooter";
import { useSidebarData } from "./SidebarComponents/useSidebarData";
import { ScrollArea } from "@/components/ui/scroll-area";

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
  
  // Apply navigation styling from localStorage if available
  useEffect(() => {
    const savedSettings = localStorage.getItem('navigation-settings');
    if (savedSettings) {
      try {
        const settings = JSON.parse(savedSettings);
        
        // Apply CSS variable values from settings
        const bgClass = settings.background.replace('bg-', '');
        const textClass = settings.textColor.replace('text-', '');
        const hoverBgClass = settings.hoverBackground.replace('hover:bg-', '');
        const hoverTextClass = settings.hoverTextColor.replace('hover:text-', '');
        const activeBgClass = settings.activeBackground.replace('bg-', '');
        const activeTextClass = settings.activeTextColor.replace('text-', '');
        
        // Set CSS variables for the sidebar navigation with dark mode considerations
        document.documentElement.style.setProperty('--nav-text-color', `var(--${textClass})`);
        document.documentElement.style.setProperty('--nav-hover-bg-color', `var(--${hoverBgClass.replace('/', '-')})`);
        document.documentElement.style.setProperty('--nav-hover-text-color', `var(--${hoverTextClass})`);
        document.documentElement.style.setProperty('--nav-active-bg-color', `var(--${activeBgClass})`);
        document.documentElement.style.setProperty('--nav-active-text-color', `var(--${activeTextClass})`);
        document.documentElement.style.setProperty('--nav-font-size', settings.fontSize === 'text-xs' ? '0.75rem' : 
                                                     settings.fontSize === 'text-sm' ? '0.875rem' : '1rem');
        document.documentElement.style.setProperty('--nav-font-weight', settings.fontWeight === 'font-light' ? '300' : 
                                                     settings.fontWeight === 'font-normal' ? '400' : 
                                                     settings.fontWeight === 'font-medium' ? '500' : '600');
        
        // Remove borders
        document.documentElement.style.setProperty('--sidebar-border-width', '0');
        document.documentElement.style.setProperty('--sidebar-border-color', 'transparent');
      } catch (e) {
        console.error("Error applying saved navigation settings", e);
      }
    }
  }, []);
  
  return (
    <Sidebar className="border-r border-transparent dark:bg-gray-800 dark:border-gray-700">
      <UISidebarContent className="p-0 flex flex-col h-full bg-sidebar dark:bg-gray-800">
        <SidebarHeader />

        {/* Sticky Dashboards Section at the top */}
        <SidebarDashboardsSection 
          contextPath={contextPath}
          isTempHumidityRoute={isTempHumidityRoute}
          isDampMoldRoute={isDampMoldRoute}
        />

        {/* Main Content with Sites and Zones wrapped in ScrollArea */}
        <ScrollArea className="flex-1">
          <SidebarContent 
            effectiveSiteId={effectiveSiteId}
            validZoneId={validZoneId}
            zoneData={zoneData}
            isDashboardRoute={isDashboardRoute}
            isTempHumidityRoute={isTempHumidityRoute}
            isDampMoldRoute={isDampMoldRoute}
          />
        </ScrollArea>
      </UISidebarContent>

      <SidebarFooterContent />
    </Sidebar>
  );
}
