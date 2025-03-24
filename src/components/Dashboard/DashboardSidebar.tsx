import { useState, useEffect } from "react";
import { SidebarProvider, SidebarTrigger, Sidebar, SidebarContent, SidebarFooter } from "@/components/ui/sidebar";
import { Settings, Search, MoreVertical, Home, Building, Package } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Link, useParams } from "react-router-dom";
import { SidebarSection } from "./SidebarSection";
import { SidebarZoneItem } from "./SidebarZoneItem";
import { SidebarDashboardItem } from "./SidebarDashboardItem";
import { ZonesHierarchy } from "./ZonesHierarchy";
import { SitesSidebar } from "./SitesSidebar";
import { useQuery } from "@tanstack/react-query";
import { fetchZone } from "@/services/zones";

export function DashboardSidebar() {
  const { siteId, zoneId } = useParams<{ siteId: string, zoneId: string }>();
  
  const validSiteId = siteId && !isNaN(Number(siteId)) ? Number(siteId) : null;
  const validZoneId = zoneId && !isNaN(Number(zoneId)) ? Number(zoneId) : null;
  
  const { data: zoneData } = useQuery({
    queryKey: ["zone-for-sidebar", validZoneId],
    queryFn: () => fetchZone(Number(validZoneId)),
    enabled: !!validZoneId,
  });

  const effectiveSiteId = validSiteId || (zoneData?.siteId ? zoneData.siteId : null);
  
  return (
    <Sidebar className="border-r border-[#E5E7EB] bg-white w-[280px]">
      <SidebarContent className="p-0">
        <div className="p-5 flex items-center justify-between border-b border-[#E5E7EB] bg-white">
          <div className="space-y-1.5">
            <div className="text-sm text-[#8E9196]">Projects</div>
            <h2 className="text-xl font-bold text-zinc-950">Zircon</h2>
          </div>
          <Button variant="ghost" size="icon" className="text-[#8E9196]">
            <Settings className="h-5 w-5" />
          </Button>
        </div>

        <div className="p-5 border-b border-[#E5E7EB] bg-white">
          <div className="relative">
            <Input placeholder="Search" className="pl-4 h-9 text-sm border-[#E5E7EB] bg-white text-[#8E9196]" />
            <Search className="absolute right-3 top-2.5 h-4 w-4 text-[#8E9196]" />
          </div>
        </div>

        <div className="overflow-y-auto flex-1">
          <SidebarSection title="Sites">
            <SitesSidebar />
          </SidebarSection>

          <SidebarSection title="Zones">
            {effectiveSiteId ? (
              <ZonesHierarchy siteId={effectiveSiteId} />
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

          <SidebarSection title="Filter Devices">
            <div className="bg-[#F9F9FA] py-2.5 px-5 cursor-pointer hover:bg-[#F5F5F6] flex items-center">
              <span className="font-medium text-sm text-zinc-800">Dashboards</span>
            </div>
            <SidebarDashboardItem name="All Data" to="/dashboard" />
            <SidebarDashboardItem name="Temperature & Humidity" to="/dashboard/temp-humidity" />
            <SidebarDashboardItem name="Energy" />
            <SidebarDashboardItem name="Co2" />
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
            <Avatar className="h-9 w-9 bg-black">
              <div className="text-white font-bold">N</div>
            </Avatar>
            <div>
              <div className="font-semibold">Novacene</div>
              <div className="text-xs text-[#8E9196]">1.2.4</div>
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
