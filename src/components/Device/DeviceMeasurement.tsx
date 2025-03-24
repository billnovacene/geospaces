
import React from "react";
import { ChevronDown } from "lucide-react";

interface DeviceMeasurementProps {
  title: string;
  value: string;
  lastReadTime: string;
  color?: string;
}

export const DeviceMeasurement = ({ 
  title, 
  value, 
  lastReadTime,
  color = "bg-green-500" 
}: DeviceMeasurementProps) => {
  return (
    <div className="border rounded-md mb-4 overflow-hidden">
      <div className="p-4 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${color}`}></div>
          <span className="text-lg">{title}</span>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-sm text-muted-foreground">Last read: {lastReadTime}</div>
          <ChevronDown className="h-5 w-5" />
        </div>
      </div>
      <div className="px-4 pb-4">
        <div className="text-4xl font-bold">{value}</div>
      </div>
    </div>
  );
};
