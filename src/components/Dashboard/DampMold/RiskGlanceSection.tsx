
import React from "react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
  const chartDescription = "Building Name has been monitored since 12 June 2023";

  return (
    <Card className="border-0 shadow-sm">
      <CardHeader className="pb-2">
        <div>
          <h2 className="text-xl font-medium text-gray-900">Damp & Mold Risk at a glance</h2>
          <p className="text-sm text-gray-500">{chartDescription}</p>
        </div>
        <div className="flex space-x-4 mt-3">
          <Tabs defaultValue={activeTab} className="w-auto" onValueChange={setActiveTab}>
            <TabsList className="bg-gray-100 p-1">
              <TabsTrigger value="today" className="data-[state=active]:bg-white">Today</TabsTrigger>
              <TabsTrigger value="month" className="data-[state=active]:bg-white">Month</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </CardHeader>
      <CardContent>
        {/* Sample time indicator */}
        <div className="text-xs text-center text-gray-500 mb-4">
          14:10 | Fri 4 Oct <span className="text-base font-medium text-gray-700 ml-1">22 °C</span>
        </div>
        
        {activeTab === "today" ? (
          <div className="flex gap-6">
            <div className="w-1/4">
              <p className="text-sm text-gray-700">
                This chart shows the current day's dew point analysis and temperature readings, 
                helping identify potential condensation risks in real-time.
              </p>
            </div>
            <div className="w-3/4">
              <div className="h-[300px]">
                <DewPointChart data={null} />
              </div>
            </div>
          </div>
        ) : (
          <div className="flex gap-6">
            <div className="w-1/4">
              <p className="text-sm text-gray-700">
                Monthly data shows historical patterns of humidity and temperature, 
                highlighting zones that have experienced sustained high-risk conditions.
              </p>
            </div>
            <div className="w-3/4">
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
