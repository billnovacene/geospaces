
import React from "react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DewPointChart } from "./DewPointChart";

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
  return (
    <Card className="border-0 shadow-sm mb-6 w-full">
      <CardContent className="w-full py-6"> {/* Added py-6 for vertical padding */}
        {activeTab === "today" ? (
          <div className="w-full space-y-4"> {/* Added space-y-4 for consistent spacing */}
            <div className="h-[250px] relative z-10 w-full">
              <DewPointChart data={null} />
            </div>
          </div>
        ) : (
          <div className="flex flex-col md:flex-row gap-6">
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
                      <TableHead>Risk Level</TableHead>
                      <TableHead>Time in High RH</TableHead>
                      <TableHead>Comments</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {monthlyRiskData.map((row) => (
                      <TableRow key={row.id}>
                        <TableCell className="font-medium">{row.building}</TableCell>
                        <TableCell>{row.zone}</TableCell>
                        <TableCell className="text-right">{row.temp}</TableCell>
                        <TableCell className="text-right">{row.rh}</TableCell>
                        <TableCell className="text-right">{row.dewPoint}</TableCell>
                        <TableCell>
                          <Badge variant={row.risk === 'High' ? 'destructive' : row.risk === 'Medium' ? 'secondary' : 'success'}>
                            {row.risk}
                          </Badge>
                        </TableCell>
                        <TableCell>{row.timeInHighRh}</TableCell>
                        <TableCell>{row.comments}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
