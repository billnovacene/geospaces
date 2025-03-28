
import React from "react";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

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
  
  return <Card className="border-0 shadow-sm bg-card text-card-foreground">
      <CardHeader className="pb-2">
        <CardTitle className="text-xl font-medium text-card-foreground">Monthly Overview</CardTitle>
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
        <div className="flex gap-6">
          <div className="w-1/4">
            <p className="text-sm text-card-foreground/80">{tableDescription}</p>
            <div className="mt-4 p-3 border border-blue-100 bg-blue-50 dark:bg-blue-950/30 dark:border-blue-900 rounded-md">
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
          <div className="w-3/4">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-muted/50">
                    <TableHead className="w-[100px]">Building</TableHead>
                    <TableHead>Zone</TableHead>
                    <TableHead className="text-right">Temp (°C)</TableHead>
                    <TableHead className="text-right">RH (%)</TableHead>
                    <TableHead className="text-right">Dew Point (°C)</TableHead>
                    <TableHead>Overall Risk</TableHead>
                    <TableHead className="text-right">No. of Alarms</TableHead>
                    <TableHead className="text-right">Time at Risk (h)</TableHead>
                    <TableHead>Comments</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {monthlyRiskData.map(row => <TableRow key={row.id} className="hover:bg-muted/50">
                      <TableCell className="font-medium">{row.building}</TableCell>
                      <TableCell>{row.zone}</TableCell>
                      <TableCell className="text-right">{row.temp}</TableCell>
                      <TableCell className="text-right">{row.rh}</TableCell>
                      <TableCell className="text-right">{row.dewPoint}</TableCell>
                      <TableCell>
                        <Badge className={getRiskStyles(row.overallRisk)}>
                          {row.overallRisk}
                        </Badge>
                      </TableCell>
                      <TableCell className={cn("text-right", row.overallRisk === 'Alarm' && "text-red-600 dark:text-red-400 font-medium")}>
                        {row.alarmCount}
                      </TableCell>
                      <TableCell className={cn("text-right", row.overallRisk === 'Alarm' && "text-red-600 dark:text-red-400 font-medium")}>
                        {row.timeAtRisk}
                      </TableCell>
                      <TableCell>{row.comments}</TableCell>
                    </TableRow>)}
                </TableBody>
              </Table>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>;
}
