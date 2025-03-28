
import React, { useState } from "react";
import { useParams, useLocation } from "react-router-dom";
import { DampMoldView } from "@/components/Dashboard/DampMold/DampMoldView";
import { DashboardLayout } from "@/components/Dashboard/Common/DashboardLayout";
import { DashboardHeader } from "@/components/Dashboard/Common/DashboardHeader";
import { StatItem } from "@/components/Dashboard/Common/SummaryStats";
import { useTheme } from "@/components/ThemeProvider";

const DampMoldDashboard = () => {
  const { siteId, zoneId } = useParams<{ siteId: string; zoneId: string; }>();
  const location = useLocation();
  const [activeFilter, setActiveFilter] = useState<string | null>(null);
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const { activeTheme } = useTheme();
  
  console.log("DampMoldDashboard params:", { siteId, zoneId });
  console.log("Current route:", location.pathname);
  console.log("Current theme:", activeTheme);

  // Summary stats for damp and mold conditions with keys for filtering and secondary labels
  const summaryStats: StatItem[] = [{
    value: "5",
    label: "Buildings",
    secondaryLabel: "Connected",
    type: "normal",
    key: "buildings"
  }, {
    value: "46",
    label: "Zones",
    secondaryLabel: "Monitored", 
    type: "normal",
    key: "zones"
  }, {
    value: "1",
    label: "Zones",
    secondaryLabel: "High Risk",
    type: "high-risk",
    key: "high-risk"
  }, {
    value: "3",
    label: "Zones",
    secondaryLabel: "Caution",
    type: "caution",
    key: "caution"
  }, {
    value: "42",
    label: "Zones",
    secondaryLabel: "Normal",
    type: "success",
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
  
  return (
    <DashboardLayout
      onDateChange={handleDateChange}
      currentDate={currentDate}
      customDashboardType="damp-mold"
    >
      {/* Header section with title and stats */}
      <DashboardHeader
        title="Damp & Mold"
        subtitle="Active Insights & Alert Status"
        stats={summaryStats}
        onStatClick={handleStatClick}
        activeFilter={activeFilter}
      />

      <DampMoldView 
        activeFilter={activeFilter} 
        currentDate={currentDate}
      />
    </DashboardLayout>
  );
};

export default DampMoldDashboard;
