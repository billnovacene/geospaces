
import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { FilterNotificationBanner } from "./components/FilterNotificationBanner";
import { MonthlyDataDescription } from "./components/MonthlyDataDescription";
import { RiskAssessmentTable } from "./components/RiskAssessmentTable";
import { DailyRiskSummary } from "./components/DailyRiskSummary";
import { useDampMold } from "./context/DampMoldContext";

interface RiskGlanceSectionProps {
  activeTab: string;
  setActiveTab: (value: string) => void;
  timeRange: string;
  setTimeRange: (value: string) => void;
  monthlyRiskData: any[];
  activeFilter?: string | null;
}

export function RiskGlanceSection({
  activeTab,
  setActiveTab,
  timeRange,
  setTimeRange,
  monthlyRiskData,
  activeFilter = null
}: RiskGlanceSectionProps) {
  const { contextInfo } = useDampMold();
  
  // Filter data based on active filter using standardized terms
  const filteredData = activeFilter ? monthlyRiskData.filter(row => {
    switch (activeFilter) {
      case 'high-risk':
        return row.overallRisk === 'Alarm';
      case 'caution':
        return row.overallRisk === 'Caution';
      case 'normal':
        return row.overallRisk === 'Good';
      default:
        return true;
    }
  }) : monthlyRiskData;
  
  // Debugging data
  console.log("Risk data to display:", filteredData);
  console.log("Risk data buildings/zones:", filteredData.map(d => `${d.building}/${d.zone}`));

  return (
    <Card className="shadow-sm mb-10 w-full dark:bg-gray-800 dark:border-gray-700">
      <FilterNotificationBanner activeFilter={activeFilter} />
      
      <CardContent className="w-full py-8">
        {activeTab === "today" ? (
          <DailyRiskSummary />
        ) : (
          <div className="flex flex-col md:flex-row gap-8">
            <MonthlyDataDescription activeFilter={activeFilter} />
            <RiskAssessmentTable data={filteredData} />
          </div>
        )}
      </CardContent>
    </Card>
  );
}
