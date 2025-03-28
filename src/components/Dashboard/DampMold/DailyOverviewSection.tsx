
import React from "react";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { generateStackedRiskData } from "./Chart/mockRiskDataUtils";
import { StackedRiskColumnChart } from "./Chart/StackedRiskColumnChart";
import { useTheme } from "@/components/ThemeProvider";

interface DailyOverviewSectionProps {
  timeRange: string;
  setTimeRange: (value: string) => void;
}

export function DailyOverviewSection({
  timeRange,
  setTimeRange
}: DailyOverviewSectionProps) {
  const { activeTheme } = useTheme();
  const isDarkMode = activeTheme === "dark";
  
  // Generate appropriate mock data based on the timeRange
  const riskData = generateStackedRiskData(timeRange);
  const chartDescription = "Stacked column chart showing the daily risk distribution by percentage. Each column represents the proportion of measurements falling into Good (green), Caution (amber), or Alarm (red) risk categories based on temperature and humidity levels.";
  
  return (
    <Card className="shadow-sm w-full dark:shadow-lg dark:shadow-black/20">
      <CardHeader className="pb-2 w-full">
        <div className="flex flex-row items-center justify-between">
          <CardTitle className="text-xl font-medium dark:text-white">Daily Overview</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="w-full">
        <div className="mt-2 w-full">
          {/* Chart layout with description on the left - using same alignment pattern as header */}
          <div className="flex flex-col md:flex-row gap-6 w-full">
            <div className="w-full md:w-1/4">
              <p className="text-sm text-card-foreground/80 dark:text-gray-200">{chartDescription}</p>
              <div className="mt-4 info-panel bg-accent/10 p-3 rounded-md border border-accent/20 dark:bg-accent/5 dark:border-accent/10">
                <p className="text-xs font-medium dark:text-gray-100">Mould Risk Scoring</p>
                <ul className="text-xs mt-1 list-disc pl-4 space-y-1 dark:text-gray-200">
                  <li>RH &lt;60%: Low risk (Good - green)</li>
                  <li>RH 60-69%: Moderate risk (Caution - amber)</li>
                  <li>RH ≥70%: High risk (Alarm - red)</li>
                  <li>Temperature &lt;16°C adds additional risk</li>
                </ul>
              </div>
            </div>
            <div className="w-full md:w-3/4">
              <div className="h-[250px] relative z-0 w-full">
                <StackedRiskColumnChart data={riskData} />
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
