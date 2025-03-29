
import React from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";

interface RiskTableRowData {
  id: string | number;
  building: string;
  zone: string;
  temp: string | number;
  rh: string | number;
  dewPoint: string | number;
  overallRisk: string;
  alarmCount: string | number;
  timeAtRisk: string | number;
  comments: string;
}

interface RiskAssessmentTableProps {
  data: RiskTableRowData[];
}

export function RiskAssessmentTable({ data }: RiskAssessmentTableProps) {
  const getRiskStyles = (risk: string) => {
    switch(risk) {
      case 'Good':
        return "bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-100";
      case 'Caution':
        return "bg-orange-300 text-orange-800 dark:bg-orange-800 dark:text-orange-100";
      case 'Alarm':
        return "bg-red-500 text-white dark:bg-red-700 dark:text-white";
      default:
        return "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-200";
    }
  };

  return (
    <div className="w-full md:w-3/4">
      <ScrollArea className="h-[500px]">
        <div className="pr-4">
          <Table>
            <TableHeader>
              <TableRow className="dark:border-gray-700">
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
              {data.length > 0 ? (
                data.map(row => (
                  <TableRow key={row.id} className="dark:border-gray-700 dark:hover:bg-gray-700/30">
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
                ))
              ) : (
                <TableRow className="dark:border-gray-700">
                  <TableCell colSpan={9} className="text-center py-6 text-muted-foreground dark:text-gray-400">
                    No data available for the current filter.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </ScrollArea>
    </div>
  );
}
