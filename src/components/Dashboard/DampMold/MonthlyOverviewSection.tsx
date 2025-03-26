
import React from "react";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

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
  return (
    <Card className="border-0 shadow-sm">
      <CardHeader className="pb-2">
        <div>
          <CardTitle className="text-xl font-bold text-gray-900">Monthly Overview</CardTitle>
        </div>
        <div className="flex space-x-4 mt-3">
          <Tabs defaultValue={timeRange} className="w-auto" onValueChange={setTimeRange}>
            <TabsList className="bg-gray-100 p-1">
              <TabsTrigger value="month" className="data-[state=active]:bg-white">Month</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-gray-700 mb-6">
          Lowest temps rarely dip below <span className="font-semibold">8°C</span>, 
          highest near <span className="font-semibold">22°C</span>. Humidity remains 
          about <span className="font-semibold">47%</span>, showing steady indoor 
          conditions with minor fluctuations linked to weather or occupancy.
        </p>
        
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
      </CardContent>
    </Card>
  );
}
