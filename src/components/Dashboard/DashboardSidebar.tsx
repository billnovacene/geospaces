
import { useState, useEffect } from "react";
import { SidebarProvider, SidebarTrigger, Sidebar, SidebarContent, SidebarFooter } from "@/components/ui/sidebar";
import { Settings, Search, MoreVertical, AlertTriangle, Home } from "lucide-react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Link, useParams, useLocation } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { fetchZonesHierarchy } from "@/services/zones";
import { Zone } from "@/services/interfaces";
import { SidebarSection } from "./SidebarSection";
import { SidebarZoneItem } from "./SidebarZoneItem";
import { SidebarDashboardItem } from "./SidebarDashboardItem";

export function DashboardSidebar() {
  const { siteId } = useParams<{ siteId: string }>();
  const [expandedZones, setExpandedZones] = useState<number[]>([]);
  const location = useLocation();
  const zoneId = location.pathname.includes('/zone/') ? Number(location.pathname.split('/zone/')[1]) : null;
  
  // Check if we have a valid siteId
  const validSiteId = siteId && !isNaN(Number(siteId)) ? Number(siteId) : null;
  
  // Fetch zones hierarchy data for the sidebar
  const { data: zones = [], isLoading, error } = useQuery({
    queryKey: ["zones-hierarchy", validSiteId],
    queryFn: () => validSiteId ? fetchZonesHierarchy(validSiteId) : Promise.resolve([]),
    enabled: !!validSiteId,
  });
  
  // Toggle expanded state of parent zones
  const toggleExpanded = (zoneId: number) => {
    setExpandedZones(prev => 
      prev.includes(zoneId) 
        ? prev.filter(id => id !== zoneId)
        : [...prev, zoneId]
    );
  };
  
  // Render zone items recursively
  const renderZoneItems = (zones: Zone[], depth = 0) => {
    return zones.map(zone => {
      const hasChildren = zone.children && zone.children.length > 0;
      const isExpanded = expandedZones.includes(zone.id);
      const isActive = zoneId === zone.id;
      const deviceCount = typeof zone.devices === 'number' ? zone.devices : parseInt(String(zone.devices), 10) || 0;
      
      return (
        <div key={zone.id}>
          <div 
            className={cn(
              "flex items-center justify-between py-2.5 px-5 cursor-pointer bg-white sidebar-hover-item",
              isActive && "bg-[#F9F9FA]",
              depth > 0 && "pl-8"
            )}
            style={{ paddingLeft: depth > 0 ? `${depth * 12 + 20}px` : undefined }}
            onClick={() => hasChildren && toggleExpanded(zone.id)}
          >
            <div className="flex items-center gap-2">
              {hasChildren && (
                <span className="text-xs text-zinc-600">
                  {isExpanded ? '▼' : '▶'}
                </span>
              )}
              <Link 
                to={`/zone/${zone.id}`}
                className="text-sm font-medium text-gray-900"
                onClick={(e) => e.stopPropagation()}
              >
                {zone.name}
              </Link>
            </div>
            <span className="text-sm text-[#8E9196]">{deviceCount}</span>
          </div>
          
          {hasChildren && isExpanded && (
            <div className="zone-children">
              {renderZoneItems(zone.children, depth + 1)}
            </div>
          )}
        </div>
      );
    });
  };
  
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
            {validSiteId ? (
              <>
                <Link to={`/site/${validSiteId}`} className="block">
                  <div className="bg-[#F9F9FA] py-2.5 px-5 cursor-pointer hover:bg-[#F5F5F6]">
                    <span className="font-medium text-sm text-zinc-950">All zones</span>
                  </div>
                </Link>
                
                {isLoading ? (
                  <div className="py-2.5 px-5 text-sm text-[#8E9196]">Loading zones...</div>
                ) : error ? (
                  <div className="py-2.5 px-5 text-sm text-red-500 flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4" />
                    <span>Error loading zones</span>
                  </div>
                ) : zones.length === 0 ? (
                  <div className="py-2.5 px-5 text-sm text-[#8E9196]">No zones available</div>
                ) : (
                  renderZoneItems(zones)
                )}
              </>
            ) : (
              <div className="py-2.5 px-5 text-sm text-zinc-500 flex flex-col gap-2">
                <div className="flex items-center gap-2 text-amber-600">
                  <AlertTriangle className="h-4 w-4" />
                  <span>No site selected</span>
                </div>
                <p className="text-xs text-zinc-400">Select a site to view its zones</p>
                <Link to="/" className="text-xs text-primary hover:underline mt-1">
                  Go to dashboard
                </Link>
              </div>
            )}
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
