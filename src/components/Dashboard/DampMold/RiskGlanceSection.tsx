
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { FilterNotificationBanner } from "./components/FilterNotificationBanner";
import { MonthlyDataDescription } from "./components/MonthlyDataDescription";
import { RiskAssessmentTable } from "./components/RiskAssessmentTable";
import { DailyRiskSummary } from "./components/DailyRiskSummary";

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
  return (
    <Card className="shadow-sm mb-10 w-full dark:bg-gray-800 dark:border-gray-700">
      <FilterNotificationBanner activeFilter={activeFilter} />
      
      <CardContent className="w-full py-8">
        {activeTab === "today" ? (
          <DailyRiskSummary data={null} />
        ) : (
          <div className="flex flex-col md:flex-row gap-8">
            <MonthlyDataDescription activeFilter={activeFilter} />
            <RiskAssessmentTable data={monthlyRiskData} />
          </div>
        )}
      </CardContent>
    </Card>
  );
}
