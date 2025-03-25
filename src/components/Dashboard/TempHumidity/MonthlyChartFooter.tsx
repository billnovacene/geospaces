
import React from "react";
import { Button } from "@/components/ui/button";
import { TooltipProvider, Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

export function MonthlyChartFooter() {
  return (
    <div className="flex justify-between items-center pt-4 border-t mt-4">
      <div></div>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="outline" size="sm">
              Download data
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Download the monthly temperature data as CSV</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
}
