
import React from "react";
import { Badge } from "@/components/ui/badge";
import { Info } from "lucide-react";
import { TooltipWrapper } from "@/components/UI/TooltipWrapper";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";

interface ChartHeaderProps {
  realDataPointsCount: number;
  totalDataPoints: number;
  hasRealData: boolean;
  selectedDate: Date;
  isUsingSimulatedData?: boolean;
}

export function ChartHeader({ 
  realDataPointsCount, 
  totalDataPoints, 
  hasRealData,
  selectedDate,
  isUsingSimulatedData = false
}: ChartHeaderProps) {
  return (
    <div className="flex justify-between items-center mb-4">
      <div className="flex items-center gap-2">
        {hasRealData && !isUsingSimulatedData ? (
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            {realDataPointsCount} real data points
          </Badge>
        ) : (
          <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
            Using simulated data
          </Badge>
        )}
        
        <TooltipWrapper content="Data shown is from sensors, some hours may use simulated values when sensor readings are unavailable">
          <Info className="h-4 w-4 text-muted-foreground cursor-help" />
        </TooltipWrapper>
      </div>
      
      <div className="flex gap-2">
        <Button variant="outline" className="h-8">
          {format(selectedDate, "d MMMM")}
        </Button>
        <Button variant="outline" className="h-8">
          Hours
        </Button>
      </div>
    </div>
  );
}
