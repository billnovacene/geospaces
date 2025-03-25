
import React from "react";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";

interface MonthlyChartControlsProps {
  month: string;
  onMonthChange?: (month: string) => void;
  onViewChange?: (view: string) => void;
}

export function MonthlyChartControls({ 
  month, 
  onMonthChange,
  onViewChange
}: MonthlyChartControlsProps) {
  return (
    <div className="flex justify-end gap-2 mb-4">
      <Button variant="outline" className="h-8" onClick={() => onMonthChange?.(month)}>
        {month} <ChevronDown className="ml-2 h-4 w-4" />
      </Button>
      <Button variant="outline" className="h-8" onClick={() => onViewChange?.('days')}>
        Days <ChevronDown className="ml-2 h-4 w-4" />
      </Button>
    </div>
  );
}
