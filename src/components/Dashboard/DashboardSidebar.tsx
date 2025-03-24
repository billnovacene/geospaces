
import { useState } from "react";
import { SidebarProvider, SidebarTrigger, Sidebar, SidebarContent, SidebarFooter } from "@/components/ui/sidebar";
import { Settings, Search, MoreVertical, Home } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Link, useParams } from "react-router-dom";
import { SidebarSection } from "./SidebarSection";
import { SidebarZoneItem } from "./SidebarZoneItem";
import { SidebarDashboardItem } from "./SidebarDashboardItem";
import { ZonesHierarchy } from "./ZonesHierarchy";

export function DashboardSidebar() {
  const { siteId } = useParams<{ siteId: string }>();
  
  // Check if we have a valid siteId
  const validSiteId = siteId && !isNaN(Number(siteId)) ? Number(siteId) : null;
  
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
          <SidebarSection title="Zones">
            <ZonesHierarchy siteId={validSiteId} />
          </SidebarSection>

          <SidebarSection title="Filter Devices">
            <div className="bg-[#F9F9FA] py-2.5 px-5 cursor-pointer hover:bg-[#F5F5F6] flex items-center justify-between">
              <span className="font-medium text-sm text-zinc-800">Dashboards</span>
              <Checkbox checked={true} className="rounded-[3px] border-[#8E9196] bg-zinc-200 hover:bg-zinc-100 text-zinc-500" />
            </div>
            <SidebarDashboardItem name="All Data" count={20} />
            <SidebarDashboardItem name="Temperature & Humidity" count={20} to="/dashboard/temp-humidity" />
            <SidebarDashboardItem name="Energy" count={20} />
            <SidebarDashboardItem name="Co2" count={3} />
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
