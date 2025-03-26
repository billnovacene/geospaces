
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DropletIcon, AlertCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface DampMoldRiskZonesProps {
  data: any;
  contextType: "zone" | "site" | "all";
}

export function DampMoldRiskZones({ data, contextType }: DampMoldRiskZonesProps) {
  const [timeframe, setTimeframe] = useState("day");
  
  // Generate risk zone data based on context type
  const generateRiskZoneData = () => {
    if (contextType === "zone") {
      // For a specific zone, show areas within that zone
      return [
        { id: 1, name: "North Corner", riskScore: 78, humidity: 82, temperature: 16.4, dewPointDelta: 1.2, riskLevel: "Severe" },
        { id: 2, name: "Window Area", riskScore: 65, humidity: 75, temperature: 17.2, dewPointDelta: 2.8, riskLevel: "High" },
        { id: 3, name: "West Wall", riskScore: 42, humidity: 68, temperature: 18.5, dewPointDelta: 5.3, riskLevel: "Moderate" },
        { id: 4, name: "South Corner", riskScore: 12, humidity: 55, temperature: 21.0, dewPointDelta: 9.1, riskLevel: "Low" }
      ];
    } else if (contextType === "site") {
      // For a site, show zones within that site
      return [
        { id: 1, name: "Office Area", riskScore: 72, humidity: 80, temperature: 16.8, dewPointDelta: 1.8, riskLevel: "Severe" },
        { id: 2, name: "Meeting Room", riskScore: 58, humidity: 72, temperature: 18.2, dewPointDelta: 3.5, riskLevel: "High" },
        { id: 3, name: "Kitchen", riskScore: 64, humidity: 76, temperature: 20.5, dewPointDelta: 2.7, riskLevel: "High" },
        { id: 4, name: "Break Room", riskScore: 28, humidity: 62, temperature: 22.0, dewPointDelta: 7.4, riskLevel: "Low" },
        { id: 5, name: "Storage Area", riskScore: 35, humidity: 65, temperature: 19.3, dewPointDelta: 6.5, riskLevel: "Moderate" }
      ];
    } else {
      // For all locations, show sites
      return [
        { id: 1, name: "Headquarters", riskScore: 60, humidity: 75, temperature: 17.5, dewPointDelta: 2.9, riskLevel: "High" },
        { id: 2, name: "North Branch", riskScore: 32, humidity: 64, temperature: 20.1, dewPointDelta: 6.8, riskLevel: "Moderate" },
        { id: 3, name: "East Office", riskScore: 18, humidity: 58, temperature: 21.7, dewPointDelta: 8.2, riskLevel: "Low" },
        { id: 4, name: "Storage Facility", riskScore: 55, humidity: 73, temperature: 16.2, dewPointDelta: 3.1, riskLevel: "High" },
        { id: 5, name: "Manufacturing Plant", riskScore: 42, humidity: 68, temperature: 19.4, dewPointDelta: 5.6, riskLevel: "Moderate" },
        { id: 6, name: "Research Lab", riskScore: 25, humidity: 60, temperature: 22.3, dewPointDelta: 7.5, riskLevel: "Low" }
      ];
    }
  };
  
  const riskZoneData = data?.riskZones || generateRiskZoneData();
  
  // Sort risk zones by risk score (highest first)
  const sortedRiskZones = [...riskZoneData].sort((a, b) => b.riskScore - a.riskScore);
  
  // Get risk badge variant based on level
  const getRiskBadgeVariant = (riskLevel: string) => {
    switch (riskLevel) {
      case "Severe": return "destructive";
      case "High": return "orange";
      case "Moderate": return "yellow";
      case "Low": return "green";
      default: return "secondary";
    }
  };
  
  return (
    <Card>
      <CardHeader className="pb-2 flex flex-row items-center justify-between">
        <CardTitle className="text-lg font-medium">Risk Zones Analysis</CardTitle>
        <Tabs defaultValue={timeframe} onValueChange={setTimeframe}>
          <TabsList>
            <TabsTrigger value="day">Day</TabsTrigger>
            <TabsTrigger value="week">Week</TabsTrigger>
            <TabsTrigger value="month">Month</TabsTrigger>
          </TabsList>
        </Tabs>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[250px]">Location</TableHead>
                <TableHead>Risk Level</TableHead>
                <TableHead className="text-right">Risk Score</TableHead>
                <TableHead className="text-right">Humidity</TableHead>
                <TableHead className="text-right">Temperature</TableHead>
                <TableHead className="text-right">Dew Point Delta</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedRiskZones.map((zone) => (
                <TableRow key={zone.id}>
                  <TableCell className="font-medium">{zone.name}</TableCell>
                  <TableCell>
                    <Badge variant={getRiskBadgeVariant(zone.riskLevel)}>
                      {zone.riskLevel}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <span className="font-medium">{zone.riskScore}%</span>
                      {zone.riskScore > 50 && <AlertCircle className="h-4 w-4 text-red-500" />}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">{zone.humidity}%</TableCell>
                  <TableCell className="text-right">{zone.temperature}°C</TableCell>
                  <TableCell className="text-right">
                    <div className={`font-medium ${zone.dewPointDelta < 3 ? 'text-red-600' : 'text-green-600'}`}>
                      {zone.dewPointDelta}°C
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        
        <div className="mt-6 text-sm text-gray-500">
          <h3 className="font-medium text-gray-700 mb-2">Understanding Risk Factors:</h3>
          <ul className="list-disc pl-5 space-y-1">
            <li><span className="font-medium">Dew Point Delta</span>: The difference between surface temperature and dew point. Values below 3°C indicate high condensation risk.</li>
            <li><span className="font-medium">Risk Score</span>: Combined assessment based on humidity, temperature, and dew point conditions.</li>
            <li><span className="font-medium">Risk Level</span>: Overall classification of mold risk in the specified area.</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}
