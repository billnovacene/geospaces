
import React from "react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DewPointChart } from "./DewPointChart";
import { cn } from "@/lib/utils";

interface RiskGlanceSectionProps {
  activeTab: string;
  setActiveTab: (value: string) => void;
  timeRange: string;
  setTimeRange: (value: string) => void;
  monthlyRiskData: any[];
}

export function RiskGlanceSection({
  activeTab,
  setActiveTab,
  timeRange,
  setTimeRange,
  monthlyRiskData
}: RiskGlanceSectionProps) {
  const getRiskStyles = (risk: string) => {
    switch(risk) {
      case 'Good':
        return "bg-emerald-100 text-white";
      case 'Caution':
        return "bg-orange-300 text-black";
      case 'Alarm':
        return "bg-red-500 text-white";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return <Card className="border-0 shadow-sm mb-10 w-full">
      <CardContent className="w-full py-8 bg-white">
        {activeTab === "today" ? <div className="w-full space-y-8">
            <div className="relative w-full">
              <DewPointChart data={null} />
            </div>
          </div> : <div className="flex flex-col md:flex-row gap-8">
            <div className="w-full md:w-1/4">
              <p className="text-sm text-gray-700">
                Monthly data shows historical patterns of humidity and temperature, 
                highlighting zones that have experienced sustained high-risk conditions.
              </p>
            </div>
            <div className="w-full md:w-3/4">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[100px]">Building</TableHead>
                      <TableHead>Zone</TableHead>
                      <TableHead className="text-right">Temp (°C)</TableHead>
                      <TableHead className="text-right">RH (%)</TableHead>
                      <TableHead className="text-right">Dew Point (°C)</TableHead>
                      <TableHead>Overall Risk</TableHead>
                      <TableHead>Time in High RH</TableHead>
                      <TableHead>Comments</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {monthlyRiskData.map(row => <TableRow key={row.id}>
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
                        <TableCell>{row.timeInHighRh}</TableCell>
                        <TableCell>{row.comments}</TableCell>
                      </TableRow>)}
                  </TableBody>
                </Table>
              </div>
            </div>
          </div>}
      </CardContent>
    </Card>;
}
