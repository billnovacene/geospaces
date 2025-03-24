
import { useState, ReactNode } from "react";
import { SidebarProvider, SidebarTrigger, Sidebar, SidebarContent, SidebarFooter } from "@/components/ui/sidebar";
import { Settings, Search, ChevronUp, ChevronDown, Menu, MoreVertical } from "lucide-react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Checkbox } from "@/components/ui/checkbox";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

interface SidebarWrapperProps {
  children: React.ReactNode;
}

interface SidebarSectionProps {
  title: string;
  children: ReactNode;
  defaultOpen?: boolean;
}

interface ZoneItemProps {
  name: string;
  count: number;
}

interface DashboardItemProps {
  name: string;
  count: number;
  checked?: boolean;
}

export function SidebarWrapper({ children }: SidebarWrapperProps) {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <DashboardSidebar />
        <main className="flex-1 overflow-x-hidden">
          <div className="flex items-center p-4 md:hidden">
            <SidebarTrigger>
              <Menu className="h-6 w-6" />
            </SidebarTrigger>
          </div>
          {children}
        </main>
      </div>
    </SidebarProvider>
  );
}

function SidebarSection({ title, children, defaultOpen = true }: SidebarSectionProps) {
  return (
    <Collapsible defaultOpen={defaultOpen} className="w-full">
      <div className="py-3 px-4 text-xs text-[#8E9196] uppercase tracking-wide flex items-center justify-between">
        <span>{title}</span>
        <CollapsibleTrigger className="focus:outline-none hover:text-foreground">
          {({ open }) => open ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </CollapsibleTrigger>
      </div>
      <CollapsibleContent>
        {children}
      </CollapsibleContent>
      <Separator className="mx-0 w-full opacity-50" />
    </Collapsible>
  );
}

function ZoneItem({ name, count }: ZoneItemProps) {
  return (
    <div className="flex items-center justify-between py-2 px-4 cursor-pointer hover:bg-muted/50">
      <div className="flex items-center gap-2">
        <span className="text-xs">▶</span>
        <span className="text-sm font-medium">{name}</span>
      </div>
      <span className="text-sm text-[#8E9196]">{count}</span>
    </div>
  );
}

function DashboardItem({ name, count, checked = true }: DashboardItemProps) {
  return (
    <div className="flex items-center justify-between py-2 px-4 cursor-pointer hover:bg-muted/50">
      <div className="flex items-center gap-2">
        <span className="text-xs">▶</span>
        <span className="text-sm font-medium">{name}</span>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-sm text-[#8E9196]">{count}</span>
        <Checkbox checked={checked} className="rounded-[3px] border-[#8E9196]" />
      </div>
    </div>
  );
}

function DashboardSidebar() {
  return (
    <Sidebar className="border-r border-[#E5E7EB] bg-white w-[280px]">
      <SidebarContent className="p-0">
        <div className="p-4 flex items-center justify-between border-b border-[#E5E7EB]">
          <div className="space-y-1">
            <div className="text-sm text-[#8E9196]">Projects</div>
            <h2 className="text-xl font-bold">Zircon</h2>
          </div>
          <Button variant="ghost" size="icon" className="text-[#8E9196]">
            <Settings className="h-5 w-5" />
          </Button>
        </div>

        <div className="p-4 border-b border-[#E5E7EB]">
          <div className="relative">
            <Input 
              placeholder="Search" 
              className="pl-4 h-9 text-sm border-[#E5E7EB] bg-white text-[#8E9196]" 
            />
            <Search className="absolute right-3 top-2.5 h-4 w-4 text-[#8E9196]" />
          </div>
        </div>

        <div className="overflow-y-auto flex-1">
          <SidebarSection title="Zones">
            <div className="bg-[#F6F7F9] py-2 px-4 cursor-pointer hover:bg-[#F0F1F3]">
              <span className="font-medium text-sm">All zones</span>
            </div>
            <ZoneItem name="Grounds Floor" count={4} />
            <ZoneItem name="1st Floor" count={16} />
            <ZoneItem name="2nd Floor" count={3} />
          </SidebarSection>

          <SidebarSection title="Filter Devices">
            <div className="bg-[#F6F7F9] py-2 px-4 cursor-pointer hover:bg-[#F0F1F3] flex items-center justify-between">
              <span className="font-medium text-sm">Dashboards</span>
              <Checkbox checked={true} className="rounded-[3px] border-[#8E9196]" />
            </div>
            <DashboardItem name="All Data" count={20} />
            <DashboardItem name="Temperature & Humidity" count={20} />
            <DashboardItem name="Energy" count={20} />
            <DashboardItem name="Co2" count={3} />
          </SidebarSection>

          <SidebarSection title="Annalytics">
            {/* Analytics content would go here */}
          </SidebarSection>

          <SidebarSection title="Settings">
            {/* Settings content would go here */}
          </SidebarSection>
        </div>
      </SidebarContent>

      <SidebarFooter className="border-t border-[#E5E7EB] p-3">
        <div className="flex items-center justify-between">
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
