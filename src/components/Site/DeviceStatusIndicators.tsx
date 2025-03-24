
import React from "react";
import { AlertTriangle, ArrowUpRight, SignalHigh, SignalMedium, SignalLow } from "lucide-react";

interface DeviceStatusIndicatorsProps {
  status: string;
  type: "status" | "signal";
}

export const DeviceStatusIndicator = ({ status, type }: DeviceStatusIndicatorsProps) => {
  if (type === "status") {
    if (status === "Inactive") {
      return <AlertTriangle className="h-5 w-5 text-red-500" />;
    } else if (status === "Warning") {
      return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
    } else {
      return <ArrowUpRight className="h-5 w-5 text-green-500" />;
    }
  } else if (type === "signal") {
    if (status === "Active") {
      return <SignalHigh className="h-5 w-5 text-green-500" />;
    } else if (status === "Warning") {
      return <SignalMedium className="h-5 w-5 text-yellow-500" />;
    } else {
      return <SignalLow className="h-5 w-5 text-gray-400" />;
    }
  }
  
  return null;
};
