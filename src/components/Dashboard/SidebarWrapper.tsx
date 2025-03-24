
import { ReactNode } from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { DashboardSidebar } from "./DashboardSidebar";
import { Menu } from "lucide-react";

interface SidebarWrapperProps {
  children: React.ReactNode;
}

export function SidebarWrapper({
  children
}: SidebarWrapperProps) {
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
