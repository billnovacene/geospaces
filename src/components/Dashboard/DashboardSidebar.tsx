
import { useState, useEffect } from "react";
import { SidebarProvider, SidebarTrigger, Sidebar, SidebarContent, SidebarFooter } from "@/components/ui/sidebar";
import { Settings, MoreVertical, Home, Building, Package } from "lucide-react";
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

const BUILD_NUMBER = "1.3.0";

export function DashboardSidebar() {
  const { siteId, zoneId } = useParams<{ siteId: string, zoneId: string }>();
  const location = useLocation();
  
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

        <div className="sticky top-0 z-10 bg-white border-b border-[#E5E7EB]">
          <SidebarSection title="Dashboards" defaultOpen={true}>
            <div className="bg-[#F9F9FA] py-2.5 px-5 cursor-pointer hover:bg-[#F5F5F6] flex items-center">
              <span className="font-medium text-sm text-zinc-800">Dashboards</span>
            </div>
            <SidebarDashboardItem 
              name="All Data" 
              to="/dashboard" 
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
          <SidebarSection title="Sites">
            <SitesSidebar preserveDashboardRoute={isDashboardRoute} currentDashboard={isTempHumidityRoute ? "temp-humidity" : ""} />
          </SidebarSection>

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
            <Avatar className="h-9 w-9">
              <AvatarImage 
                src="/lovable-uploads/f6f59774-352a-4ce5-aa56-f314fbeab500.png" 
                alt="Zircon Logo"
              />
            </Avatar>
            <div>
              <div className="font-semibold">Zircon</div>
              <div className="text-xs text-[#8E9196]">{BUILD_NUMBER}</div>
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
