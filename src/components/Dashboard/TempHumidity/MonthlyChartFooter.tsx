
import React from "react";
import { Button } from "@/components/ui/button";
import { TooltipProvider, Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { DownloadCloud, RefreshCw } from "lucide-react";

interface MonthlyChartFooterProps {
  onRefresh?: () => void;
  isCachedData?: boolean;
}

export function MonthlyChartFooter({ onRefresh, isCachedData }: MonthlyChartFooterProps) {
  return (
    <div className="flex justify-between items-center pt-4 border-t mt-4">
      <div>
        {isCachedData && (
          <span className="text-xs text-muted-foreground flex items-center">
            <div className="w-2 h-2 bg-green-400 rounded-full mr-2"></div>
            Using cached data
          </span>
        )}
      </div>
      <div className="flex gap-2">
        {onRefresh && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" size="sm" onClick={onRefresh}>
                  <RefreshCw className="h-4 w-4 mr-1" />
                  Refresh
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Refresh data from the server</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="outline" size="sm">
                <DownloadCloud className="h-4 w-4 mr-1" />
                Download data
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Download the monthly temperature data as CSV</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </div>
  );
}
