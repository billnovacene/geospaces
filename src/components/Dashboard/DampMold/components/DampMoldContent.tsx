
import React, { useState } from "react";
import { ScrollbarStyler } from "../ScrollbarStyler";
import { MonthlyOverviewSection } from "../MonthlyOverviewSection";
import { DailyOverviewSection } from "../DailyOverviewSection";
import { RiskGlanceSection } from "../RiskGlanceSection";
import { DevelopmentLogPanel } from "../DevelopmentLogPanel";
import { EmptyStateView } from "./EmptyStateView";
import { ErrorStateView } from "./ErrorStateView";
import { useDampMold } from "../context/DampMoldContext";
import { toast } from "sonner";
import { generateAndInsertDampMoldData } from "@/services/damp-mold-data-generator";

export function DampMoldContent() {
  const [activeTab, setActiveTab] = useState("today");
  const [dailyTimeRange, setDailyTimeRange] = useState("today");
  const [monthlyTimeRange, setMonthlyTimeRange] = useState("month");
  const [isGenerating, setIsGenerating] = useState(false);
  
  const { 
    contextInfo,
    data, 
    isLoading, 
    error, 
    refetch,
    activeFilter
  } = useDampMold();

  const handleGenerateTestData = async () => {
    try {
      setIsGenerating(true);
      await generateAndInsertDampMoldData(contextInfo.zoneId, contextInfo.siteId);
      toast.success("Test data generated successfully", {
        description: "The page will now refresh to show the new data."
      });
      refetch();
    } catch (err) {
      console.error("Failed to generate test data:", err);
      toast.error("Failed to generate test data", {
        description: err instanceof Error ? err.message : "An unknown error occurred"
      });
    } finally {
      setIsGenerating(false);
    }
  };

  // If there's an error, show the error state
  if (error) {
    return <ErrorStateView error={error} onRetry={refetch} isLoading={isLoading} />;
  }

  // If there's no data and we're not loading, show the empty state
  if (!isLoading && (!data || !data.daily || data.daily.length === 0)) {
    return <EmptyStateView onGenerateData={handleGenerateTestData} isLoading={isGenerating} contextInfo={contextInfo} />;
  }

  // We don't have any real monthly data source yet, leaving as empty array
  let monthlyRiskData = [];

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
      <DevelopmentLogPanel />
    </div>
  );
}
