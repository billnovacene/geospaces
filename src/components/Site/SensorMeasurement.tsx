
import React from "react";
import { formatDistanceToNow } from "date-fns";
import { AlertTriangle } from "lucide-react";

interface SensorMeasurementProps {
  value: number | null | undefined;
  unit: string;
  name: string;
  time: string | undefined;
  thresholds?: {
    warning: number;
    critical: number;
  };
}

export const SensorMeasurement = ({ 
  value, 
  unit, 
  name, 
  time,
  thresholds
}: SensorMeasurementProps) => {
  // Format time ago
  const formatTimeAgo = (timestamp: string | undefined) => {
    if (!timestamp) return "N/A";
    
    try {
      return `${formatDistanceToNow(new Date(timestamp), { addSuffix: false })} ago`;
    } catch (e) {
      return "N/A";
    }
  };

  // Get status indicator based on value and thresholds
  const getStatusIndicator = () => {
    if (!value || !thresholds) return null;
    
    if (value >= thresholds.critical) {
      return <AlertTriangle className="h-5 w-5 text-red-500" />;
    } else if (value >= thresholds.warning) {
      return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
    }
    
    return null;
  };

  if (!value) return <div>N/A</div>;

  return (
    <div className="flex items-center">
      <div>
        <div className="font-medium flex items-center gap-1">
          {value} {unit}
          {getStatusIndicator()}
        </div>
        <div className="text-xs text-muted-foreground flex items-center gap-1">
          <span className="inline-block w-2 h-2 bg-green-500 rounded-full"></span>
          {name} - {formatTimeAgo(time)}
        </div>
      </div>
    </div>
  );
};
