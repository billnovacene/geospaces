import { useState, useEffect } from "react";
import { SidebarProvider, SidebarTrigger, Sidebar, SidebarContent, SidebarFooter } from "@/components/ui/sidebar";
import { Settings, Search, MoreVertical, Home, Building, Package } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Link, useParams, useLocation } from "react-router-dom";
import { SidebarSection } from "./SidebarSection";
import { SidebarZoneItem } from "./SidebarZoneItem";
import { SidebarDashboardItem } from "./SidebarDashboardItem";
import { ZonesHierarchy } from "./ZonesHierarchy";
import { SitesSidebar } from "./SitesSidebar";
import { useQuery } from "@tanstack/react-query";
import { fetchZone } from "@/services/zones";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

// Import process.env to get the build version
const APP_VERSION = import.meta.env.VITE_APP_VERSION || "1.2.4"; // Fallback to hardcoded version if env var not set

export function DashboardSidebar() {
  const { siteId, zoneId } = useParams<{ siteId: string, zoneId: string }>();
  const location = useLocation();
  const [dashboardsCollapsed, setDashboardsCollapsed] = useState(false);
  
  // Check if we're on a dashboard route
  const isDashboardRoute = location.pathname.includes('/dashboard');
  const isTempHumidityRoute = location.pathname.includes('/dashboard/temp-humidity');
  
  const validSiteId = siteId && !isNaN(Number(siteId)) ? Number(siteId) : null;
  const validZoneId = zoneId && !isNaN(Number(zoneId)) ? Number(zoneId) : null;
  
  const { data: zoneData } = useQuery({
    queryKey: ["zone-for-sidebar", validZoneId],
    queryFn: () => fetchZone(Number(validZoneId)),
    enabled: !!validZoneId,
  });

  const effectiveSiteId = validSiteId || (zoneData?.siteId ? zoneData.siteId : null);
  
  // Determine which dashboard is active
  const isOverviewActive = !isDashboardRoute && (
    location.pathname === "/" || 
    location.pathname === "/index" || 
    location.pathname === `/site/${siteId}` || 
    location.pathname === `/zone/${zoneId}`
  );
  
  // Log important information for debugging
  console.log(`DashboardSidebar: siteId=${validSiteId}, zoneId=${validZoneId}, effectiveSiteId=${effectiveSiteId}`);
  console.log(`DashboardSidebar: isDashboardRoute=${isDashboardRoute}, isTempHumidityRoute=${isTempHumidityRoute}`);
  
  return (
    <Sidebar className="border-r border-[#E5E7EB] bg-white w-[280px]">
      <SidebarContent className="p-0 flex flex-col h-full">
        <div className="p-5 flex items-center justify-between border-b border-[#E5E7EB] bg-white">
          <div className="space-y-1.5">
            <div className="text-sm text-[#8E9196]">Projects</div>
            <h2 className="text-xl font-bold text-zinc-950">Zircon</h2>
          </div>
          <Button variant="ghost" size="icon" className="text-[#8E9196]">
            <Settings className="h-5 w-5" />
          </Button>
        </div>

        {/* Sticky Dashboards Section at the top */}
        <div className="sticky top-0 z-10 bg-white border-b border-[#E5E7EB]">
          <SidebarSection title="Dashboards" defaultOpen={true}>
            <div className="bg-[#F9F9FA] py-2.5 px-5 cursor-pointer hover:bg-[#F5F5F6] flex items-center">
              <span className="font-medium text-sm text-zinc-800">Dashboards</span>
            </div>
            <SidebarDashboardItem 
              name="All Data" 
              contextPath={zoneId ? `/zone/${zoneId}` : (siteId ? `/site/${siteId}` : '')}
            />
            <SidebarDashboardItem 
              name="Temperature & Humidity" 
              to="/dashboard/temp-humidity" 
              contextPath={zoneId ? `/zone/${zoneId}` : (siteId ? `/site/${siteId}` : '')}
            />
            <SidebarDashboardItem 
              name="Energy" 
              contextPath={zoneId ? `/zone/${zoneId}` : (siteId ? `/site/${siteId}` : '')}
            />
            <SidebarDashboardItem 
              name="Co2" 
              contextPath={zoneId ? `/zone/${zoneId}` : (siteId ? `/site/${siteId}` : '')}
            />
          </SidebarSection>
        </div>

        <div className="overflow-y-auto flex-1">
          {/* Direct SitesSidebar without SidebarSection wrapper */}
          <SitesSidebar preserveDashboardRoute={isDashboardRoute} currentDashboard={isTempHumidityRoute ? "temp-humidity" : ""} />

          <SidebarSection title="Zones">
            {effectiveSiteId ? (
              <ZonesHierarchy 
                siteId={effectiveSiteId} 
                preserveDashboardRoute={isDashboardRoute}
                currentDashboard={isTempHumidityRoute ? "temp-humidity" : ""}
                hideZonesWithoutSensors={isTempHumidityRoute}
              />
            ) : validZoneId && zoneData ? (
              <div className="py-2.5 px-5 text-sm bg-white">
                <div className="flex items-center gap-1.5 text-primary">
                  <Package className="h-4 w-4" />
                  <span className="font-medium">{zoneData.name}</span>
                </div>
                <div className="text-[#8E9196] text-xs mt-1">
                  Module zone (ID: {validZoneId})
                </div>
              </div>
            ) : (
              <div className="py-2.5 px-5 text-sm text-[#8E9196] bg-white">
                Select a site to view zones
              </div>
            )}
          </SidebarSection>

          <SidebarSection title="Annalytics">
            <div className="py-2.5 px-5 text-sm text-[#8E9196] bg-white">
              No analytics available
            </div>
          </SidebarSection>

          <SidebarSection title="Settings">
            <div className="py-2.5 px-5 text-sm text-[#8E9196] bg-white">
              System settings
            </div>
          </SidebarSection>
        </div>
      </SidebarContent>

      <SidebarFooter className="border-t border-[#E5E7EB] p-4 bg-white">
        <div className="flex items-center justify-between bg-white">
          <div className="flex items-center gap-3">
            <Avatar className="h-8 w-8 bg-transparent">
              <AvatarImage src="/lovable-uploads/e04538fb-8a3f-43c4-ba17-b41d6191317c.png" alt="Zircon Logo" />
            </Avatar>
            <div>
              <div className="font-semibold text-sm">Novacene</div>
              <div className="flex flex-col">
                <span className="text-xs font-medium text-primary">GeoSpaces</span>
                <span className="text-xs text-black font-mono">v{APP_VERSION}</span>
              </div>
            </div>
          </div>
          <Button variant="ghost" size="icon" className="text-[#8E9196]">
            <MoreVertical className="h-5 w-5" />
          </Button>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
