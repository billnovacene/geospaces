
import React from "react";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";

interface MonthlyChartControlsProps {
  month: string;
}

export function MonthlyChartControls({ month }: MonthlyChartControlsProps) {
  return (
    <div className="flex justify-end gap-2 mb-4">
      <Button variant="outline" className="h-8">
        {month} <ChevronDown className="ml-2 h-4 w-4" />
      </Button>
      <Button variant="outline" className="h-8">
        Days <ChevronDown className="ml-2 h-4 w-4" />
      </Button>
    </div>
  );
}
