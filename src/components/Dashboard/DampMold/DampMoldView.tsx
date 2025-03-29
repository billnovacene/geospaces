import React, { useState, useEffect } from "react";
import { useParams, useLocation } from "react-router-dom";
import { fetchDampMoldData } from "@/services/damp-mold";
import { useQuery } from "@tanstack/react-query";
import { generateMockData } from "@/services/sensors/mock-data-generator";
import { generateMonthlyRiskData } from "./utils/mockRiskData";
import { DailyOverviewSection } from "./DailyOverviewSection";
import { MonthlyOverviewSection } from "./MonthlyOverviewSection";
import { RiskGlanceSection } from "./RiskGlanceSection";
import { useTheme } from "@/components/ThemeProvider";
import { LogPanel } from "../TempHumidity/LogPanel";

interface DampMoldViewProps {
  contextType?: "zone" | "site" | "all";
  contextId?: string | null;
  siteId?: string;
  zoneId?: string;
  activeFilter?: string | null;
  currentDate?: Date;
}

// Extend TempHumidityResponse with dew point properties
interface ExtendedTempHumidityResponse extends TempHumidityResponse {
  currentDewPoint?: number;
  dewPointRisk?: "default" | "destructive" | "outline" | "secondary" | "success";
  dewPointDifference?: number;
  stats: TempHumidityResponse["stats"];
  daily: TempHumidityResponse["daily"];
  monthly: TempHumidityResponse["monthly"];
  sourceData: TempHumidityResponse["sourceData"];
}

export function DampMoldView({ 
  contextType: propsContextType, 
  contextId: propsContextId,
  siteId: propsSiteId,
  zoneId: propsZoneId,
  activeFilter = null,
  currentDate = new Date()
}: DampMoldViewProps) {
  const [activeTab, setActiveTab] = useState("today");
  const [dailyTimeRange, setDailyTimeRange] = useState("today");
  const [monthlyTimeRange, setMonthlyTimeRange] = useState("month");
  const params = useParams<{ siteId: string; zoneId: string }>();
  const { activeTheme } = useTheme();
  
  // Use params if props are not provided
  const siteId = propsSiteId || params.siteId;
  const zoneId = propsZoneId || params.zoneId;
  
  // Determine context type based on available IDs
  const contextType = propsContextType || (zoneId ? "zone" : siteId ? "site" : "all");
  const contextId = propsContextId || zoneId || siteId || null;
  
  console.log("DampMoldView props:", { contextType, contextId, siteId, zoneId, activeFilter, currentDate });
  console.log("Route params:", params);
  console.log("Current theme:", activeTheme);
  
  // Add specific scrollbar styling for DampMoldView
  useEffect(() => {
    const isDarkMode = document.documentElement.classList.contains('dark');
    console.log("DampMoldView: DOM dark mode:", isDarkMode, "Context theme:", activeTheme);
    
    // Force scrollbar refresh
    const refreshScrollbars = () => {
      document.documentElement.classList.add('scrollbar-refresh');
      setTimeout(() => {
        document.documentElement.classList.add('scrollbar-refresh-done');
        document.documentElement.classList.remove('scrollbar-refresh');
        setTimeout(() => {
          document.documentElement.classList.remove('scrollbar-refresh-done');
        }, 100);
      }, 50);
    };
    
    refreshScrollbars();
    
    // Apply direct styles to ensure dark mode scrollbars work in this view
    try {
      const scrollbarSettings = localStorage.getItem('scrollbar-settings');
      if (scrollbarSettings) {
        const settings = JSON.parse(scrollbarSettings);
        const themeColors = isDarkMode ? settings.darkMode : settings.lightMode;
        
        let styleEl = document.getElementById('damp-mold-view-scrollbar-styles');
        if (!styleEl) {
          styleEl = document.createElement('style');
          styleEl.id = 'damp-mold-view-scrollbar-styles';
          document.head.appendChild(styleEl);
        }
        
        // Apply ultra-specific styles
        const css = `
          /* DampMoldView specific scrollbar styles */
          .dark .space-y-6.dark\\:bg-gray-900 *::-webkit-scrollbar-track {
            background-color: ${settings.darkMode.trackColor} !important;
          }
          
          .dark .space-y-6.dark\\:bg-gray-900 *::-webkit-scrollbar-thumb {
            background-color: ${settings.darkMode.thumbColor} !important;
          }
          
          .dark .space-y-6.dark\\:bg-gray-900 *::-webkit-scrollbar-thumb:hover {
            background-color: ${settings.darkMode.thumbHoverColor} !important;
          }
        `;
        
        styleEl.textContent = css;
        
        console.log(`DampMoldView applied ${isDarkMode ? 'dark' : 'light'} scrollbar styles:`, {
          track: themeColors.trackColor,
          thumb: themeColors.thumbColor,
          hover: themeColors.thumbHoverColor
        });
      }
    } catch (e) {
      console.error("Failed to apply DampMoldView scrollbar styles", e);
    }
    
    return () => {
      const styleEl = document.getElementById('damp-mold-view-scrollbar-styles');
      if (styleEl) {
        styleEl.parentNode?.removeChild(styleEl);
      }
    };
  }, [activeTheme]);
  
  // Fetch context name (site or zone name)
  const { data: zoneName } = useQuery({
    queryKey: ["zone-name", zoneId],
    queryFn: async () => {
      const zone = await fetchZone(Number(zoneId));
      return zone?.name || "Unknown Zone";
    },
    enabled: !!zoneId,
  });
  
  const { data: siteName } = useQuery({
    queryKey: ["site-name", siteId],
    queryFn: async () => {
      const site = await fetchSite(Number(siteId));
      return site?.name || "Unknown Site";
    },
    enabled: !!siteId && !zoneId,
  });
  
  // Use simulated data instead of API data
  const simulatedData = generateMockData();
  const contextName = zoneId ? zoneName : siteId ? siteName : "All Locations";
  
  console.log("Using simulated data:", simulatedData);
  
  // Process the data to add dew point properties
  const data: ExtendedTempHumidityResponse = {
    ...simulatedData,
    currentDewPoint: 12.3,
    dewPointDifference: 5.2,
    dewPointRisk: "secondary"
  };
  
  // Get the monthly risk data and filter based on activeFilter if needed
  let monthlyRiskData = generateMonthlyRiskData();
  
  // Apply filtering based on activeFilter
  if (activeFilter) {
    console.log(`Filtering data by ${activeFilter}`);
    if (activeFilter === 'high-risk') {
      monthlyRiskData = monthlyRiskData.filter(item => item.overallRisk === 'Alarm');
    } else if (activeFilter === 'caution') {
      monthlyRiskData = monthlyRiskData.filter(item => item.overallRisk === 'Caution');
    } else if (activeFilter === 'normal') {
      monthlyRiskData = monthlyRiskData.filter(item => item.overallRisk === 'Good');
    }
    // Other filters like 'buildings' or 'zones' could be implemented similarly
  }
  
  // Generate dewPointData for the chart
  const dewPointData = data?.daily || [];
  
  // Use the new query hook to fetch damp mold data
  const { 
    data: dampMoldData, 
    isLoading, 
    error 
  } = useQuery({
    queryKey: ['damp-mold-data', siteId, zoneId],
    queryFn: () => fetchDampMoldData(siteId, zoneId),
    // Refetch every minute
    refetchInterval: 60000,
  });

  // If no real data, use mock data
  const displayData = dampMoldData || generateMockData();
  monthlyRiskData = generateMonthlyRiskData();

  // Apply filtering based on activeFilter
  if (activeFilter) {
    if (activeFilter === 'high-risk') {
      monthlyRiskData = monthlyRiskData.filter(item => item.overallRisk === 'Alarm');
    } else if (activeFilter === 'caution') {
      monthlyRiskData = monthlyRiskData.filter(item => item.overallRisk === 'Caution');
    } else if (activeFilter === 'normal') {
      monthlyRiskData = monthlyRiskData.filter(item => item.overallRisk === 'Good');
    }
  }

  return (
    <div className="space-y-6 dark:bg-gray-900 transition-colors duration-300">
      {/* Monthly Overview section */}
      <MonthlyOverviewSection 
        timeRange={monthlyTimeRange}
        setTimeRange={setMonthlyTimeRange}
        monthlyRiskData={monthlyRiskData} 
      />
      
      {/* Daily Overview section with description */}
      <DailyOverviewSection 
        timeRange={dailyTimeRange} 
        setTimeRange={setDailyTimeRange}
      />
      
      <RiskGlanceSection 
        activeTab={activeTab} 
        setActiveTab={setActiveTab}
        timeRange={dailyTimeRange} 
        setTimeRange={setDailyTimeRange} 
        monthlyRiskData={monthlyRiskData}
        activeFilter={activeFilter}
      />
      
      {/* Only show logs in development environment */}
      {process.env.NODE_ENV === 'development' && (
        <div className="mt-8">
          <LogPanel 
            logs={[
              { 
                message: `Fetched ${displayData.daily.length} damp mold data points`, 
                type: 'info', 
                timestamp: new Date().toISOString() 
              },
              ...(isLoading ? [{ 
                message: 'Data is loading', 
                type: 'info', 
                timestamp: new Date().toISOString() 
              }] : []),
              ...(error ? [{ 
                message: `Error fetching data: ${error.message}`, 
                type: 'error', 
                timestamp: new Date().toISOString() 
              }] : []),
              { message: 'Using simulated data only', type: 'info' as const, timestamp: new Date().toISOString() },
              ...(activeFilter ? [{ 
                message: `Filtering data by: ${activeFilter}`, 
                type: 'info' as const, 
                timestamp: new Date().toISOString() 
              }] : []),
              { message: `Theme mode: ${activeTheme}`, type: 'info' as const, timestamp: new Date().toISOString() },
              { message: `Dark mode from DOM: ${document.documentElement.classList.contains('dark')}`, type: 'info' as const, timestamp: new Date().toISOString() }
            ]} 
            onClearLogs={() => {}} 
            title="Damp & Mold Monitoring Logs" 
          />
        </div>
      )}
    </div>
  );
}

export default DampMoldView;
