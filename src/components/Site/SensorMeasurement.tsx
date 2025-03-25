
import React from "react";
import { formatDistanceToNow } from "date-fns";
import { AlertTriangle } from "lucide-react";
import { getSensorValueColor, getSensorValueStatus } from "@/utils/sensorThresholds";

interface SensorMeasurementProps {
  value: number | null | undefined;
  unit: string;
  name: string;
  time: string | undefined;
  thresholds?: {
    warning: number;
    critical: number;
  };
  sensorType?: string; // Added sensor type parameter
}

export const SensorMeasurement = ({ 
  value, 
  unit, 
  name, 
  time,
  thresholds,
  sensorType = "temperature" // Default to temperature if not specified
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

  // Use the new sensor thresholds utility
  const getColorForValue = () => {
    if (value === null || value === undefined) return { text: "text-gray-400", bg: "bg-gray-200" };
    
    // Use the detected sensor type from the name if not explicitly provided
    const detectedType = sensorType || 
      (name.toLowerCase().includes("temp") ? "temperature" :
       name.toLowerCase().includes("co2") ? "co2" :
       name.toLowerCase().includes("humid") ? "humidity" :
       name.toLowerCase().includes("rssi") ? "rssi" :
       name.toLowerCase().includes("battery") || name.toLowerCase().includes("vdd") ? "batteryVoltage" :
       name.toLowerCase().includes("light") ? "light" :
       "temperature");
    
    return getSensorValueColor(detectedType, value);
  };

  // Get status indicator based on the new thresholds system
  const getStatusIndicator = () => {
    if (!value) return null;
    
    const colorObj = getColorForValue();
    if (colorObj.text.includes("red")) {
      return <AlertTriangle className="h-5 w-5 text-red-500" />;
    } else if (colorObj.text.includes("amber")) {
      return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
    }
    
    return null;
  };

  if (!value) return <div>N/A</div>;

  const valueColor = getColorForValue();

  return (
    <div className="flex items-center">
      <div>
        <div className="font-medium flex items-center gap-1">
          <span className={valueColor.text}>{value}</span> {unit}
          {getStatusIndicator()}
        </div>
        <div className="text-xs text-muted-foreground flex items-center gap-1">
          <span 
            className={`inline-block w-2 h-2 rounded-full ${valueColor.bg}`}
          ></span>
          {name} - {formatTimeAgo(time)}
        </div>
      </div>
    </div>
  );
};
