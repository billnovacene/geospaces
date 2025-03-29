
import React, { useState, useEffect } from "react";
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

  // Add a body class for damp-mold dashboard specific styling
  useEffect(() => {
    document.body.classList.add('damp-mold-dashboard-active');
    
    // Force a scrollbar refresh when this component mounts
    const refreshScrollbars = () => {
      console.log("DampMoldDashboard: Forcing scrollbar refresh");
      document.documentElement.classList.add('scrollbar-refresh');
      setTimeout(() => {
        document.documentElement.classList.add('scrollbar-refresh-done');
        document.documentElement.classList.remove('scrollbar-refresh');
        setTimeout(() => {
          document.documentElement.classList.remove('scrollbar-refresh-done');
        }, 100);
      }, 50);
    };
    
    // Apply scrollbar styles with the highest specificity possible
    const applyDampMoldScrollbarStyles = () => {
      // Get scrollbar settings or use defaults
      try {
        const savedSettings = localStorage.getItem('scrollbar-settings');
        if (savedSettings) {
          const settings = JSON.parse(savedSettings);
          const isDarkMode = document.documentElement.classList.contains('dark');
          const colors = isDarkMode ? settings.darkMode : settings.lightMode;
          
          let styleEl = document.getElementById('damp-mold-scrollbar-styles');
          if (!styleEl) {
            styleEl = document.createElement('style');
            styleEl.id = 'damp-mold-scrollbar-styles';
            document.head.appendChild(styleEl);
          }
          
          // Ultra-specific CSS just for this page
          const css = `
            /* DampMold page scrollbar styles with maximum specificity */
            body.damp-mold-dashboard-active *::-webkit-scrollbar-track {
              background-color: ${colors.trackColor} !important;
            }
            
            body.damp-mold-dashboard-active *::-webkit-scrollbar-thumb {
              background-color: ${colors.thumbColor} !important;
            }
            
            body.damp-mold-dashboard-active *::-webkit-scrollbar-thumb:hover {
              background-color: ${colors.thumbHoverColor} !important;
            }
            
            body.damp-mold-dashboard-active [data-radix-scroll-area-viewport]::-webkit-scrollbar-track {
              background-color: ${colors.trackColor} !important;
            }
            
            body.damp-mold-dashboard-active [data-radix-scroll-area-viewport]::-webkit-scrollbar-thumb {
              background-color: ${colors.thumbColor} !important;
            }
            
            body.damp-mold-dashboard-active [data-radix-scroll-area-viewport]::-webkit-scrollbar-thumb:hover {
              background-color: ${colors.thumbHoverColor} !important;
            }
          `;
          
          styleEl.textContent = css;
          console.log("Applied DampMold-specific scrollbar styles", { isDarkMode, colors });
        }
      } catch (e) {
        console.error("Failed to apply DampMold scrollbar styles", e);
      }
    };
    
    // Apply both techniques
    applyDampMoldScrollbarStyles();
    refreshScrollbars();
    
    // Do this again in 500ms to catch any lazy-loaded components
    const timer = setTimeout(() => {
      applyDampMoldScrollbarStyles();
      refreshScrollbars();
    }, 500);
    
    return () => {
      document.body.classList.remove('damp-mold-dashboard-active');
      const styleEl = document.getElementById('damp-mold-scrollbar-styles');
      if (styleEl) {
        styleEl.parentNode?.removeChild(styleEl);
      }
      clearTimeout(timer);
    };
  }, [activeTheme]);

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
