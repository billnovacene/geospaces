
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface ImportSummaryProps {
  lastImportStats: any;
}

export const ImportSummary: React.FC<ImportSummaryProps> = ({ lastImportStats }) => {
  if (!lastImportStats) return null;
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Last Import Summary</CardTitle>
        <CardDescription>
          Overview of the data imported in the last successful import.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <div className="flex flex-col">
            <span className="text-sm text-muted-foreground">Projects</span>
            <span className="text-2xl font-bold">{lastImportStats.projects_count || 0}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-sm text-muted-foreground">Sites</span>
            <span className="text-2xl font-bold">{lastImportStats.sites_count || 0}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-sm text-muted-foreground">Zones</span>
            <span className="text-2xl font-bold">{lastImportStats.zones_count || 0}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-sm text-muted-foreground">Devices</span>
            <span className="text-2xl font-bold">{lastImportStats.devices_count || 0}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-sm text-muted-foreground">Sensors</span>
            <span className="text-2xl font-bold">{lastImportStats.sensors_count || 0}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-sm text-muted-foreground">Sensor Data Points</span>
            <span className="text-2xl font-bold">{lastImportStats.sensor_data_count || 0}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
