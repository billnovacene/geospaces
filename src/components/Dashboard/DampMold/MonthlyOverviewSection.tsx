
import React from "react";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";

interface MonthlyOverviewSectionProps {
  timeRange: string;
  setTimeRange: (value: string) => void;
  monthlyRiskData: any[];
}

export function MonthlyOverviewSection({
  timeRange,
  setTimeRange,
  monthlyRiskData
}: MonthlyOverviewSectionProps) {
  const tableDescription = "Monthly overview displays risk assessment based on temperature and humidity readings. The Overall Risk status is calculated from aggregated 10-minute sensor readings, with alarm counts and time at risk shown in hours.";
  
  const getRiskStyles = (risk: string) => {
    switch (risk) {
      case 'Good':
        return "bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-100";
      case 'Caution':
        return "bg-orange-300 text-black dark:bg-orange-800 dark:text-orange-100";
      case 'Alarm':
        return "bg-red-500 text-white dark:bg-red-700 dark:text-red-100";
      default:
        return "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-200";
    }
  };
  
  return (
    <Card className="shadow-sm dark:bg-gray-800 dark:border-gray-700">
      <CardHeader className="pb-2">
        <CardTitle className="text-xl font-medium dark:text-white">Monthly Overview</CardTitle>
        <div className="flex space-x-4 mt-3">
          <Tabs defaultValue={timeRange} className="w-auto" onValueChange={setTimeRange}>
            <TabsList className="bg-muted">
              <TabsTrigger value="month" className="data-[state=active]:bg-background data-[state=active]:text-foreground">Month</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </CardHeader>
      <CardContent>
        {/* Table layout with description on the left */}
        <div className="flex flex-col md:flex-row gap-6">
          <div className="w-full md:w-1/4">
            <p className="text-sm text-card-foreground/80 dark:text-gray-300">{tableDescription}</p>
            <div className="mt-4 p-3 border border-blue-100 bg-blue-50/30 dark:bg-blue-950/30 dark:border-blue-900/50 rounded-md">
              <p className="text-xs text-blue-700 dark:text-blue-400 font-medium">Risk Calculation Method</p>
              <ul className="text-xs text-blue-700 dark:text-blue-400 mt-1 list-disc pl-4 space-y-1">
                <li>Scores from 10-min readings: RH &lt;60%: 0pts, 60-70%: 1pt, &gt;70%: 2pts</li>
                <li>Temp &lt;16°C: +1pt (condensation risk)</li>
                <li>Good: &lt;20% of max possible score</li>
                <li>Caution: 20-40% of max possible score</li>
                <li>Alarm: &gt;40% of max possible score</li>
              </ul>
            </div>
          </div>
          <div className="w-full md:w-3/4">
            <ScrollArea className="h-[500px]">
              <div className="pr-4">
                <Table>
                  <TableHeader>
                    <TableRow className="hover:bg-muted/50 dark:border-gray-700">
                      <TableHead className="w-[100px] dark:text-gray-300">Building</TableHead>
                      <TableHead className="dark:text-gray-300">Zone</TableHead>
                      <TableHead className="text-right dark:text-gray-300">Temp (°C)</TableHead>
                      <TableHead className="text-right dark:text-gray-300">RH (%)</TableHead>
                      <TableHead className="text-right dark:text-gray-300">Dew Point (°C)</TableHead>
                      <TableHead className="dark:text-gray-300">Overall Risk</TableHead>
                      <TableHead className="text-right dark:text-gray-300">No. of Alarms</TableHead>
                      <TableHead className="text-right dark:text-gray-300">Time at Risk (h)</TableHead>
                      <TableHead className="dark:text-gray-300">Comments</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {monthlyRiskData.map(row => (
                      <TableRow key={row.id} className="hover:bg-muted/50 dark:hover:bg-gray-700/30 dark:border-gray-700">
                        <TableCell className="font-medium dark:text-gray-200">{row.building}</TableCell>
                        <TableCell className="dark:text-gray-200">{row.zone}</TableCell>
                        <TableCell className="text-right dark:text-gray-200">{row.temp}</TableCell>
                        <TableCell className="text-right dark:text-gray-200">{row.rh}</TableCell>
                        <TableCell className="text-right dark:text-gray-200">{row.dewPoint}</TableCell>
                        <TableCell>
                          <Badge className={getRiskStyles(row.overallRisk)}>
                            {row.overallRisk}
                          </Badge>
                        </TableCell>
                        <TableCell className={cn("text-right", row.overallRisk === 'Alarm' ? "text-red-600 dark:text-red-400 font-medium" : "dark:text-gray-200")}>
                          {row.alarmCount}
                        </TableCell>
                        <TableCell className={cn("text-right", row.overallRisk === 'Alarm' ? "text-red-600 dark:text-red-400 font-medium" : "dark:text-gray-200")}>
                          {row.timeAtRisk}
                        </TableCell>
                        <TableCell className="dark:text-gray-200">{row.comments}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </ScrollArea>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
