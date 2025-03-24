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
export function SidebarWrapper({
  children
}: SidebarWrapperProps) {
  return <SidebarProvider>
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
    </SidebarProvider>;
}
function SidebarSection({
  title,
  children,
  defaultOpen = true
}: SidebarSectionProps) {
  return <Collapsible defaultOpen={defaultOpen} className="w-full">
      <div className="py-3 px-4 text-xs text-[#8E9196] uppercase tracking-wide flex items-center justify-between bg-zinc-50">
        <span>{title}</span>
        <CollapsibleTrigger className="focus:outline-none hover:text-foreground">
          <span className="inline-block">
            {defaultOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </span>
        </CollapsibleTrigger>
      </div>
      <CollapsibleContent>
        {children}
      </CollapsibleContent>
      <Separator className="mx-0 w-full opacity-50" />
    </Collapsible>;
}
function ZoneItem({
  name,
  count
}: ZoneItemProps) {
  return <div className="flex items-center justify-between py-2 px-4 cursor-pointer bg-zinc-100">
      <div className="flex items-center gap-2">
        <span className="text-xs text-zinc-600">▶</span>
        <span className="text-sm font-medium text-gray-900">{name}</span>
      </div>
      <span className="text-sm text-[#8E9196]">{count}</span>
    </div>;
}
function DashboardItem({
  name,
  count,
  checked = true
}: DashboardItemProps) {
  return <div className="flex items-center justify-between py-2 px-4 cursor-pointer bg-gray-100">
      <div className="flex items-center gap-2">
        <span className="text-xs text-zinc-500">▶</span>
        <span className="text-sm font-medium text-zinc-800">{name}</span>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-sm text-[#8E9196]">{count}</span>
        <Checkbox checked={checked} className="rounded-[3px] border-[#8E9196] bg-neutral-200 hover:bg-neutral-100 text-zinc-400" />
      </div>
    </div>;
}
function DashboardSidebar() {
  return <Sidebar className="border-r border-[#E5E7EB] bg-white w-[280px]">
      <SidebarContent className="p-0">
        <div className="p-4 flex items-center justify-between border-b border-[#E5E7EB] bg-zinc-50">
          <div className="space-y-1">
            <div className="text-sm text-[#8E9196]">Projects</div>
            <h2 className="text-xl font-bold text-zinc-950">Zircon</h2>
          </div>
          <Button variant="ghost" size="icon" className="text-[#8E9196]">
            <Settings className="h-5 w-5" />
          </Button>
        </div>

        <div className="p-4 border-b border-[#E5E7EB] bg-zinc-50">
          <div className="relative">
            <Input placeholder="Search" className="pl-4 h-9 text-sm border-[#E5E7EB] bg-white text-[#8E9196]" />
            <Search className="absolute right-3 top-2.5 h-4 w-4 text-[#8E9196]" />
          </div>
        </div>

        <div className="overflow-y-auto flex-1">
          <SidebarSection title="Zones">
            <div className="bg-[#F6F7F9] py-2 px-4 cursor-pointer hover:bg-[#F0F1F3]">
              <span className="font-medium text-sm text-zinc-950">All zones</span>
            </div>
            <ZoneItem name="Grounds Floor" count={4} />
            <ZoneItem name="1st Floor" count={16} />
            <ZoneItem name="2nd Floor" count={3} />
          </SidebarSection>

          <SidebarSection title="Filter Devices">
            <div className="bg-[#F6F7F9] py-2 px-4 cursor-pointer hover:bg-[#F0F1F3] flex items-center justify-between">
              <span className="font-medium text-sm text-zinc-800">Dashboards</span>
              <Checkbox checked={true} className="rounded-[3px] border-[#8E9196] bg-zinc-200 hover:bg-zinc-100 text-zinc-500" />
            </div>
            <DashboardItem name="All Data" count={20} />
            <DashboardItem name="Temperature & Humidity" count={20} />
            <DashboardItem name="Energy" count={20} />
            <DashboardItem name="Co2" count={3} />
          </SidebarSection>

          <SidebarSection title="Annalytics">
            <div className="py-2 px-4 text-sm text-[#8E9196] bg-zinc-50">
              No analytics available
            </div>
          </SidebarSection>

          <SidebarSection title="Settings">
            <div className="py-2 px-4 text-sm text-[#8E9196] bg-zinc-50">
              System settings
            </div>
          </SidebarSection>
        </div>
      </SidebarContent>

      <SidebarFooter className="border-t border-[#E5E7EB] p-3 bg-zinc-100">
        <div className="flex items-center justify-between bg-zinc-100">
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
    </Sidebar>;
}