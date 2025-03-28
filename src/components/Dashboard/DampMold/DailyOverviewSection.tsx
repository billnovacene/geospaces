
import React from "react";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { generateStackedRiskData } from "./Chart/mockRiskDataUtils";
import { StackedRiskColumnChart } from "./Chart/StackedRiskColumnChart";

interface DailyOverviewSectionProps {
  timeRange: string;
  setTimeRange: (value: string) => void;
}

export function DailyOverviewSection({
  timeRange,
  setTimeRange
}: DailyOverviewSectionProps) {
  // Generate appropriate mock data based on the timeRange
  const riskData = generateStackedRiskData(timeRange);
  const chartDescription = "Stacked column chart showing the daily risk distribution by percentage. Each column represents the proportion of measurements falling into Good (green), Caution (amber), or Alarm (red) risk categories based on temperature and humidity levels.";
  
  return <Card className="shadow-sm w-full">
      <CardHeader className="pb-2 w-full">
        <div className="flex flex-row items-center justify-between">
          <CardTitle className="text-xl font-medium">Daily Overview</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="w-full">
        <div className="mt-2 w-full">
          {/* Chart layout with description on the left - using same alignment pattern as header */}
          <div className="flex flex-col md:flex-row gap-6 w-full">
            <div className="w-full md:w-1/4">
              <p className="text-sm text-card-foreground/80">{chartDescription}</p>
              <div className="mt-4 info-panel info-panel-blue">
                <p className="text-xs font-medium">Mould Risk Scoring</p>
                <ul className="text-xs mt-1 list-disc pl-4 space-y-1">
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
    </Card>;
}
