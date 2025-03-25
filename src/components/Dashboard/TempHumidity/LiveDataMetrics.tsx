
import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Thermometer, Cloud, AlertCircle } from "lucide-react";
import { getSensorValueColor } from "@/utils/sensorThresholds";

export function LiveDataMetrics() {
  return (
    <Card className="overflow-hidden border-0 h-full rounded-none shadow-sm">
      <CardContent className="p-0 h-full flex flex-col">
        <div className="px-2 pt-2 flex justify-between items-center">
          <span className="text-sm font-medium">Outside Temp</span>
          <Badge variant="outline" className="bg-amber-50 text-amber-600 border-amber-200">
            API Only
          </Badge>
        </div>
        
        <div className="px-2 py-3 flex-grow flex flex-col gap-3 items-center justify-center">
          <div className="flex items-center gap-2 text-amber-600">
            <AlertCircle size={18} />
            <span className="text-sm font-medium">
              No API data available
            </span>
          </div>
          
          <p className="text-xs text-center text-muted-foreground mt-1">
            Real-time external temperature data<br />requires API connection
          </p>
        </div>
        
        <div className="h-1 w-full bg-gradient-to-r from-gray-200 to-gray-300" />
      </CardContent>
    </Card>
  );
}
