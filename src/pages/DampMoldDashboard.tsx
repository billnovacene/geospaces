
import React, { useState } from "react";
import { DashboardSidebar } from "@/components/Dashboard/DashboardSidebar";
import { SidebarWrapper } from "@/components/Dashboard/SidebarWrapper";
import { useParams, useLocation } from "react-router-dom";
import { DampMoldView } from "@/components/Dashboard/DampMold/DampMoldView";
import { Card } from "@/components/ui/card";
import { SummaryStats, StatItem } from "@/components/Dashboard/DampMold/SummaryStats";
import { GlobalNavigationHeader } from "@/components/Dashboard/Common/GlobalNavigationHeader";

const DampMoldDashboard = () => {
  const { siteId, zoneId } = useParams<{ siteId: string; zoneId: string; }>();
  const location = useLocation();
  const [activeFilter, setActiveFilter] = useState<string | null>(null);
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  
  console.log("DampMoldDashboard params:", { siteId, zoneId });
  console.log("Current route:", location.pathname);

  // Summary stats for damp and mold conditions with keys for filtering and secondary labels
  const summaryStats = [{
    value: "5",
    label: "Buildings",
    secondaryLabel: "Connected",
    type: "normal" as const,
    key: "buildings"
  }, {
    value: "46",
    label: "Zones",
    secondaryLabel: "Monitored", 
    type: "normal" as const,
    key: "zones"
  }, {
    value: "1",
    label: "Zones",
    secondaryLabel: "High Risk",
    type: "high-risk" as const,
    key: "high-risk"
  }, {
    value: "3",
    label: "Zones",
    secondaryLabel: "Caution",
    type: "caution" as const,
    key: "caution"
  }, {
    value: "42",
    label: "Zones",
    secondaryLabel: "Normal",
    type: "success" as const,
    key: "normal"
  }];
  
  const handleStatClick = (stat: StatItem) => {
    console.log("Stat clicked:", stat);
    // Toggle the filter if the same stat is clicked again
    if (activeFilter === stat.key) {
      setActiveFilter(null);
    } else {
      setActiveFilter(stat.key);
    }
  };
  
  const handleDateChange = (date: Date) => {
    console.log("Date changed to:", date);
    setCurrentDate(date);
  };
  
  return <SidebarWrapper>
      <div className="flex-1 overflow-auto bg-background min-h-screen">
        {/* Global Navigation Header added at the top */}
        <GlobalNavigationHeader 
          onDateChange={handleDateChange}
          initialDate={currentDate}
          customDashboardType="damp-mold"
        />
        
        <div className="dashboard-container px-4 md:px-6">
          {/* Header section with title and stats */}
          <div className="mb-6">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between px-[20px] py-[20px] bg-card rounded-lg shadow-sm">
              <div className="flex flex-col mb-6 md:mb-0 md:w-1/4 pr-4">
                <h1 className="heading-1 mb-1 font-light text-left text-3xl">Damp & Mold</h1>
                <p className="body-normal text-sm font-extralight text-muted-foreground">Active Insights & Alert Status</p>
              </div>
              
              {/* Summary stats displayed via the new component */}
              <div className="md:w-3/4">
                <SummaryStats 
                  stats={summaryStats} 
                  onStatClick={handleStatClick}
                  activeFilter={activeFilter}
                />
              </div>
            </div>
          </div>

          <DampMoldView 
            activeFilter={activeFilter} 
            currentDate={currentDate}
          />
        </div>
      </div>
    </SidebarWrapper>;
};
export default DampMoldDashboard;
