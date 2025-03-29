
import React, { useState } from "react";
import { useTheme } from "@/components/ThemeProvider";
import { generateMonthlyRiskData } from "./utils/mockRiskData";
import { DailyOverviewSection } from "./DailyOverviewSection";
import { MonthlyOverviewSection } from "./MonthlyOverviewSection";
import { RiskGlanceSection } from "./RiskGlanceSection";
import { ScrollbarStyler } from "./ScrollbarStyler";
import { DevelopmentLogPanel } from "./DevelopmentLogPanel";
import { useDampMoldData } from "./hooks/useDampMoldData";

interface DampMoldViewProps {
  contextType?: "zone" | "site" | "all";
  contextId?: string | null;
  siteId?: string;
  zoneId?: string;
  activeFilter?: string | null;
  currentDate?: Date;
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
  const { activeTheme } = useTheme();
  
  // Use our custom hook to fetch data and determine context
  const { 
    contextInfo, 
    data: displayData, 
    isLoading, 
    error 
  } = useDampMoldData(
    propsContextType,
    propsContextId,
    propsSiteId,
    propsZoneId,
    activeFilter
  );
  
  console.log("DampMoldView props:", { 
    contextType: contextInfo.contextType, 
    contextId: contextInfo.contextId, 
    siteId: contextInfo.siteId, 
    zoneId: contextInfo.zoneId, 
    activeFilter, 
    currentDate 
  });
  
  // Get monthly risk data and apply filters
  let monthlyRiskData = generateMonthlyRiskData();
  
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
      {/* Apply scrollbar styling */}
      <ScrollbarStyler />
      
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
      
      {/* Development logs panel */}
      <DevelopmentLogPanel 
        dataPoints={displayData.daily.length} 
        isLoading={isLoading}
        error={error as Error}
        activeTheme={activeTheme}
        activeFilter={activeFilter}
      />
    </div>
  );
}

export default DampMoldView;
