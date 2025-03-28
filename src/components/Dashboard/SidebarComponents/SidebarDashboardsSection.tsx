
import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import { SidebarSection } from "../SidebarSection";
import { SidebarDashboardItem } from "../SidebarDashboardItem";

interface SidebarDashboardsSectionProps {
  contextPath: string;
  isTempHumidityRoute: boolean;
  isDampMoldRoute: boolean;
}

export function SidebarDashboardsSection({
  contextPath,
  isTempHumidityRoute,
  isDampMoldRoute
}: SidebarDashboardsSectionProps) {
  const [dashboardsCollapsed, setDashboardsCollapsed] = useState(false);
  const location = useLocation();
  
  // Check if we're on an overview page (not a dashboard route)
  const isOverviewActive = !location.pathname.includes('/dashboard');

  return (
    <div className="sticky top-0 z-10 bg-sidebar dark:bg-gray-800 dark:border-gray-700">
      <SidebarSection title="Dashboards" defaultOpen={true}>
        <div className="py-2.5 px-5 cursor-pointer sidebar-hover-item flex items-center dark:hover:bg-gray-700 dark:text-gray-200">
          <span className="nav-item dark:text-gray-200">Dashboards</span>
        </div>
        <SidebarDashboardItem 
          name="All Data" 
          contextPath={contextPath}
        />
        <SidebarDashboardItem 
          name="Temperature & Humidity" 
          to="/dashboard/temp-humidity" 
          contextPath={contextPath}
        />
        <SidebarDashboardItem 
          name="Damp & Mold" 
          to="/dashboard/damp-mold" 
          contextPath={contextPath}
        />
        <SidebarDashboardItem 
          name="Energy" 
          contextPath={contextPath}
        />
        <SidebarDashboardItem 
          name="Co2" 
          contextPath={contextPath}
        />
      </SidebarSection>
    </div>
  );
}
