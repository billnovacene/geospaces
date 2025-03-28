
import React from "react";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface DewPointChartControlsProps {
  selectedRange: string;
  setSelectedRange: (range: string) => void;
  chartType: string;
  setChartType: (type: string) => void;
}

export function DewPointChartControls({
  selectedRange,
  setSelectedRange,
  chartType,
  setChartType
}: DewPointChartControlsProps) {
  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 mt-2">
      <div className="flex space-x-2">
        <Badge 
          variant={selectedRange === "day" ? "default" : "secondary"} 
          className="cursor-pointer"
          onClick={() => setSelectedRange("day")}
        >
          Day
        </Badge>
        <Badge 
          variant={selectedRange === "week" ? "default" : "secondary"} 
          className="cursor-pointer"
          onClick={() => setSelectedRange("week")}
        >
          Week
        </Badge>
        <Badge 
          variant={selectedRange === "month" ? "default" : "secondary"} 
          className="cursor-pointer"
          onClick={() => setSelectedRange("month")}
        >
          Month
        </Badge>
      </div>
      <div>
        <Select value={chartType} onValueChange={setChartType}>
          <SelectTrigger className="w-[120px]">
            <SelectValue placeholder="Chart Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="line">Line Chart</SelectItem>
            <SelectItem value="area">Area Chart</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
