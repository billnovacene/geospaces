
import { useState } from "react";
import { SidebarProvider, SidebarTrigger, Sidebar, SidebarContent, SidebarGroup, SidebarGroupLabel, SidebarGroupContent, SidebarMenu, SidebarMenuItem, SidebarMenuButton } from "@/components/ui/sidebar";
import { Home, FolderOpen, PieChart, Settings, Users, Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface SidebarWrapperProps {
  children: React.ReactNode;
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

function DashboardSidebar() {
  const [active, setActive] = useState("dashboard");
  
  const menuItems = [
    { id: "dashboard", title: "Dashboard", icon: Home, href: "/" },
    { id: "projects", title: "Projects", icon: FolderOpen, href: "/projects" },
    { id: "analytics", title: "Analytics", icon: PieChart, href: "/analytics" },
    { id: "team", title: "Team", icon: Users, href: "/team" },
    { id: "settings", title: "Settings", icon: Settings, href: "/settings" }
  ];

  return (
    <Sidebar className="border-r border-border">
      <SidebarContent>
        <div className="flex items-center justify-between px-4 py-6">
          <div className="flex items-center space-x-2">
            <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center">
              <span className="text-white font-bold">N</span>
            </div>
            <h1 className="text-xl font-semibold text-foreground">Insight Nova</h1>
          </div>
          <SidebarTrigger className="ml-auto md:hidden">
            <X className="h-5 w-5" />
          </SidebarTrigger>
        </div>
        
        <SidebarGroup>
          <SidebarGroupLabel className="text-xs font-medium uppercase tracking-wider">
            Main Menu
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.id}>
                  <SidebarMenuButton 
                    asChild
                    className={cn(
                      "w-full flex items-center gap-3 px-3 py-2 rounded-md transition-colors",
                      active === item.id 
                        ? "bg-primary text-primary-foreground" 
                        : "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                    )}
                    onClick={() => setActive(item.id)}
                  >
                    <a href={item.href} className="flex items-center gap-3">
                      <item.icon className="h-5 w-5" />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
