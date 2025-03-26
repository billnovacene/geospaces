
import React from "react";
import { Badge } from "@/components/ui/badge";

interface TimeRangeSelectorProps {
  selectedRange: string;
  setSelectedRange: (range: string) => void;
}

export function TimeRangeSelector({ selectedRange, setSelectedRange }: TimeRangeSelectorProps) {
  return (
    <div className="flex space-x-2">
      <Badge 
        variant={selectedRange === "day" ? "default" : "outline"} 
        className="cursor-pointer"
        onClick={() => setSelectedRange("day")}
      >
        Day
      </Badge>
      <Badge 
        variant={selectedRange === "week" ? "default" : "outline"} 
        className="cursor-pointer"
        onClick={() => setSelectedRange("week")}
      >
        Week
      </Badge>
      <Badge 
        variant={selectedRange === "month" ? "default" : "outline"} 
        className="cursor-pointer"
        onClick={() => setSelectedRange("month")}
      >
        Month
      </Badge>
    </div>
  );
}
