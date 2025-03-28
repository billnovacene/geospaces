
import { ReactNode } from "react";
import { SidebarProvider, SidebarTrigger, useSidebar } from "@/components/ui/sidebar";
import { DashboardSidebar } from "./DashboardSidebar";
import { Menu } from "lucide-react";

interface SidebarWrapperProps {
  children: React.ReactNode;
}

function MainContent({ children }: { children: React.ReactNode }) {
  const { state } = useSidebar();
  
  return (
    <div className={`flex-1 ${state === "expanded" ? "sidebar-expanded" : "sidebar-collapsed"}`}>
      <div className="md:hidden p-4">
        <SidebarTrigger>
          <Menu className="h-6 w-6 text-foreground" />
        </SidebarTrigger>
      </div>
      <div className="dashboard-container">
        {children}
      </div>
    </div>
  );
}

export function SidebarWrapper({
  children
}: SidebarWrapperProps) {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-background">
        <DashboardSidebar />
        <MainContent>{children}</MainContent>
      </div>
    </SidebarProvider>
  );
}
