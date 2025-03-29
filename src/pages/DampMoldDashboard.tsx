import React, { useState, useEffect } from "react";
import { useParams, useLocation } from "react-router-dom";
import { DampMoldView } from "@/components/Dashboard/DampMold/DampMoldView";
import { DashboardLayout } from "@/components/Dashboard/Common/DashboardLayout";
import { DashboardHeader } from "@/components/Dashboard/Common/DashboardHeader";
import { StatItem } from "@/components/Dashboard/Common/SummaryStats";
import { useTheme } from "@/components/ThemeProvider";
import { useDampMoldStats } from "@/hooks/useDampMoldStats";
import { Skeleton } from "@/components/ui/skeleton";

const DampMoldDashboard = () => {
  const { siteId, zoneId } = useParams<{ siteId: string; zoneId: string; }>();
  const location = useLocation();
  const [activeFilter, setActiveFilter] = useState<string | null>(null);
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const { activeTheme } = useTheme();
  
  const { data: statsData, isLoading: isLoadingStats, error: statsError } = useDampMoldStats(siteId, zoneId);
  
  console.log("DampMoldDashboard params:", { siteId, zoneId });
  console.log("Current route:", location.pathname);
  console.log("Current theme:", activeTheme);

  useEffect(() => {
    document.body.classList.add('damp-mold-dashboard-active');
    
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
    
    const applyDampMoldScrollbarStyles = () => {
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
          
          const css = `
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
    
    applyDampMoldScrollbarStyles();
    refreshScrollbars();
    
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

  const summaryStats = statsData?.stats || [];
  
  const handleStatClick = (stat: StatItem) => {
    console.log("Stat clicked:", stat);
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
      {isLoadingStats ? (
        <div className="mb-6">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between px-[20px] py-[20px] bg-card dark:bg-gray-800/50">
            <div className="flex flex-col mb-6 md:mb-0 md:w-1/4 pr-4">
              <h1 className="heading-1 mb-1 font-light text-left text-3xl text-gray-800 dark:text-white">Damp & Mold</h1>
              <p className="body-normal text-sm font-extralight text-muted-foreground dark:text-gray-300">Active Insights & Alert Status</p>
            </div>
            
            <div className="md:w-3/4">
              <div className="flex space-x-4 items-stretch w-full">
                {[1, 2, 3, 4, 5].map((_, index) => (
                  <div key={index} className="flex-1 bg-card dark:bg-card rounded-lg overflow-hidden shadow-sm p-4">
                    <Skeleton className="h-8 w-3/4 mb-2" />
                    <Skeleton className="h-4 w-1/2" />
                    <Skeleton className="h-4 w-1/3 mt-2" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <DashboardHeader
          title="Damp & Mold"
          subtitle="Active Insights & Alert Status"
          stats={summaryStats}
          onStatClick={handleStatClick}
          activeFilter={activeFilter}
        />
      )}

      <DampMoldView 
        activeFilter={activeFilter} 
        currentDate={currentDate}
      />
    </DashboardLayout>
  );
};

export default DampMoldDashboard;
