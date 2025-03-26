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
  return <div className="flex items-center space-x-4">
      <Select value={chartType} onValueChange={setChartType}>
        <SelectTrigger className="w-[120px]">
          <SelectValue placeholder="Chart Type" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="line">Line Chart</SelectItem>
          <SelectItem value="area">Area Chart</SelectItem>
        </SelectContent>
      </Select>
      
      <div className="flex space-x-2">
        <Badge variant={selectedRange === "day" ? "default" : "outline"} onClick={() => setSelectedRange("day")} className="cursor-pointer bg-green-600">
          Day
        </Badge>
        <Badge variant={selectedRange === "week" ? "default" : "outline"} className="cursor-pointer" onClick={() => setSelectedRange("week")}>
          Week
        </Badge>
        <Badge variant={selectedRange === "month" ? "default" : "outline"} className="cursor-pointer" onClick={() => setSelectedRange("month")}>
          Month
        </Badge>
      </div>
    </div>;
}