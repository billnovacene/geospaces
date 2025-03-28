
import React, { ReactNode } from "react";
import { SidebarWrapper } from "@/components/Dashboard/SidebarWrapper";
import { GlobalNavigationHeader } from "@/components/Dashboard/Common/GlobalNavigationHeader";

interface DashboardLayoutProps {
  children: ReactNode;
  onDateChange?: (date: Date) => void;
  currentDate?: Date;
  customDashboardType?: string;
  title?: string;
}

export function DashboardLayout({
  children,
  onDateChange,
  currentDate = new Date(),
  customDashboardType,
  title
}: DashboardLayoutProps) {
  return (
    <SidebarWrapper>
      <div className="flex-1 overflow-auto bg-background min-h-screen">
        {/* Global Navigation Header at the top */}
        <GlobalNavigationHeader 
          onDateChange={onDateChange}
          initialDate={currentDate}
          customDashboardType={customDashboardType}
        />
        
        <div className="dashboard-container">
          {children}
        </div>
      </div>
    </SidebarWrapper>
  );
}
