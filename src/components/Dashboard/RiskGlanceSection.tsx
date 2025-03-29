
import React from "react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DewPointChart } from "./DampMold/DewPointChart";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";

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
  const getRiskStyles = (risk: string) => {
    switch(risk) {
      case 'Good':
        return "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/70 dark:text-emerald-200";
      case 'Caution':
        return "bg-orange-300 text-orange-800 dark:bg-orange-800/70 dark:text-orange-200";
      case 'Alarm':
        return "bg-red-500 text-white dark:bg-red-700/90 dark:text-white";
      default:
        return "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-200";
    }
  };

  return <Card className="shadow-sm mb-10 w-full dark:shadow-lg dark:shadow-black/20">
      {activeFilter && (
        <div className="bg-blue-50/50 dark:bg-blue-900/30 p-3 border-b border-blue-100 dark:border-blue-900/50">
          <p className="text-sm text-blue-700 dark:text-blue-300">
            Filtering by: <span className="font-medium capitalize">{activeFilter}</span>
            {activeFilter === 'high-risk' && " - showing only high risk zones"}
            {activeFilter === 'caution' && " - showing only caution zones"}
            {activeFilter === 'normal' && " - showing only normal zones"}
          </p>
        </div>
      )}
      <CardContent className="w-full py-8">
        {activeTab === "today" ? <div className="w-full space-y-8">
            <div className="relative w-full">
              <DewPointChart />
            </div>
          </div> : <div className="flex flex-col md:flex-row gap-8">
            <div className="w-full md:w-1/4">
              <p className="text-sm text-card-foreground/80 dark:text-gray-200">
                Monthly data shows historical patterns of humidity and temperature, 
                highlighting zones that have experienced sustained high-risk conditions.
                {activeFilter && (
                  <span className="block mt-2 text-blue-700 dark:text-blue-300 font-medium">
                    Currently filtering data by {activeFilter}.
                  </span>
                )}
              </p>
            </div>
            <div className="w-full md:w-3/4">
              <ScrollArea className="h-[500px]">
                <div className="pr-4">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[100px] dark:text-gray-200">Building</TableHead>
                        <TableHead className="dark:text-gray-200">Zone</TableHead>
                        <TableHead className="text-right dark:text-gray-200">Temp (°C)</TableHead>
                        <TableHead className="text-right dark:text-gray-200">RH (%)</TableHead>
                        <TableHead className="text-right dark:text-gray-200">Dew Point (°C)</TableHead>
                        <TableHead className="dark:text-gray-200">Overall Risk</TableHead>
                        <TableHead className="text-right dark:text-gray-200">No. of Alarms</TableHead>
                        <TableHead className="text-right dark:text-gray-200">Time at Risk (h)</TableHead>
                        <TableHead className="dark:text-gray-200">Comments</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {monthlyRiskData.length > 0 ? (
                        monthlyRiskData.map(row => (
                          <TableRow key={row.id} className="dark:hover:bg-gray-800/70">
                            <TableCell className="font-medium dark:text-gray-100">{row.building}</TableCell>
                            <TableCell className="dark:text-gray-100">{row.zone}</TableCell>
                            <TableCell className="text-right dark:text-gray-100">{row.temp}</TableCell>
                            <TableCell className="text-right dark:text-gray-100">{row.rh}</TableCell>
                            <TableCell className="text-right dark:text-gray-100">{row.dewPoint}</TableCell>
                            <TableCell>
                              <Badge className={getRiskStyles(row.overallRisk)}>
                                {row.overallRisk}
                              </Badge>
                            </TableCell>
                            <TableCell className={cn("text-right", row.overallRisk === 'Alarm' ? "text-red-600 dark:text-red-300 font-medium" : "dark:text-gray-100")}>
                              {row.alarmCount}
                            </TableCell>
                            <TableCell className={cn("text-right", row.overallRisk === 'Alarm' ? "text-red-600 dark:text-red-300 font-medium" : "dark:text-gray-100")}>
                              {row.timeAtRisk}
                            </TableCell>
                            <TableCell className="dark:text-gray-100">{row.comments}</TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={9} className="text-center py-6 text-muted-foreground dark:text-gray-300">
                            No data available for the current filter.
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              </ScrollArea>
            </div>
          </div>}
      </CardContent>
    </Card>;
}
