
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { MonthlyChart } from "@/components/Dashboard/TempHumidity/MonthlyChart";
import { MonthlyOverviewPoint } from "@/services/interfaces/temp-humidity";

interface MonthlyOverviewProps {
  data: MonthlyOverviewPoint[];
  contextName: string;
  stats: {
    minTemp: string;
    maxTemp: string;
  };
}

export function MonthlyOverview({ data, contextName, stats }: MonthlyOverviewProps) {
  return (
    <div className="mb-16">
      <Card className="shadow-sm border-0">
        <CardContent className="p-8">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 lg:gap-8 items-center">
            <div className="col-span-1">
              <h2 className="text-xl font-medium mb-4">Monthly Overview - {contextName}</h2>
              <p className="text-sm text-gray-600">
                The last 30 days show peak temps around {stats.maxTemp}°C with minimums
                near {stats.minTemp}°C. Early morning and late evening periods typically
                show the largest temperature variations.
              </p>
            </div>
            <div className="col-span-1 lg:col-span-3">
              <MonthlyChart data={data} />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
