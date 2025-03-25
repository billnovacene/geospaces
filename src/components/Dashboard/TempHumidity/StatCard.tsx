
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { getSensorValueColor } from "@/utils/sensorThresholds";
import { formatDistanceToNow } from "date-fns";
import { Thermometer, Droplets, ArrowUp, ArrowDown, Sun } from "lucide-react";

interface StatCardProps {
  title: string;
  value: number | string;
  unit?: string;
  status: 'good' | 'caution' | 'warning';
  description?: string;
  large?: boolean;
  sensorType?: string;
  sensorValue?: number;
  lastSeen?: string | Date;
  icon?: "temperature" | "humidity" | "min" | "max" | "avg";
  trend?: "up" | "down" | "stable";
}

export function StatCard({
  title,
  value,
  unit,
  status,
  description,
  large,
  sensorType = "temperature",
  sensorValue,
  lastSeen,
  icon,
  trend
}: StatCardProps) {
  // Get color based on the same method as charts
  const getStatusColor = (status: 'good' | 'caution' | 'warning', sensorType: string, sensorValue?: number) => {
    // If we have a sensor value and type, use the utility function
    if (sensorValue !== undefined && sensorType) {
      return getSensorValueColor(sensorType, sensorValue);
    }
    
    // Fallback to status-based colors
    switch (status) {
      case 'good':
        return {
          text: "text-green-600",
          bg: "bg-gradient-to-r from-green-300 to-green-400"
        };
      case 'caution':
        return {
          text: "text-amber-600",
          bg: "bg-gradient-to-r from-amber-300 to-amber-400"
        };
      case 'warning':
        return {
          text: "text-red-600",
          bg: "bg-gradient-to-r from-red-300 to-red-400"
        };
      default:
        return {
          text: "text-gray-400",
          bg: "bg-gray-200"
        };
    }
  };
  
  const getStatusText = (status: 'good' | 'caution' | 'warning') => {
    switch (status) {
      case 'good':
        return 'Good';
      case 'caution':
        return 'Caution';
      case 'warning':
        return 'Warning';
      default:
        return 'Unknown';
    }
  };
  
  const statusColor = getStatusColor(status, sensorType, sensorValue);
  
  // Convert Tailwind classes to CSS colors for use with style attribute
  const getColorFromClass = (colorClass: string) => {
    if (colorClass.includes("red")) return "#ef4444";
    if (colorClass.includes("amber")) return "#f59e0b";
    if (colorClass.includes("green")) return "#10b981";
    if (colorClass.includes("blue")) return "#3b82f6";
    if (colorClass.includes("gray")) return "#6b7280";
    return "#6b7280"; // default gray
  };
  
  // Format the last seen timestamp if provided
  const lastSeenText = lastSeen ? formatDistanceToNow(new Date(lastSeen), { addSuffix: true }) : 'N/A';
  
  // Get the appropriate icon
  const getIcon = () => {
    switch (icon) {
      case 'temperature':
        return <Thermometer className="h-5 w-5" style={{ color: getColorFromClass(statusColor.text) }} />;
      case 'humidity':
        return <Droplets className="h-5 w-5" style={{ color: getColorFromClass(statusColor.text) }} />;
      case 'min':
        return <ArrowDown className="h-5 w-5" style={{ color: getColorFromClass(statusColor.text) }} />;
      case 'max':
        return <ArrowUp className="h-5 w-5" style={{ color: getColorFromClass(statusColor.text) }} />;
      case 'avg':
        return <Sun className="h-5 w-5" style={{ color: getColorFromClass(statusColor.text) }} />;
      default:
        return null;
    }
  };

  // Get trend indicator
  const getTrendIndicator = () => {
    if (!trend) return null;
    
    return trend === 'up' ? 
      <ArrowUp className="h-3 w-3 ml-1" /> : 
      trend === 'down' ? 
        <ArrowDown className="h-3 w-3 ml-1" /> : 
        null;
  };
  
  return (
    <Card className="overflow-hidden border-0 h-full rounded-none shadow-sm">
      <CardContent className="p-0 h-full flex flex-col">
        <div className="px-[5px] mx-[5px] py-2 flex-grow flex flex-col justify-center">
          <div className="flex flex-col items-center text-center">
            {getIcon() && (
              <div className="mb-2">
                {getIcon()}
              </div>
            )}
            <div className="flex items-center justify-center">
              <span className="text-center font-medium text-lg">{value}</span>
              {unit && <span className="font-thin text-left text-sm ml-0.5">{unit}</span>}
              {getTrendIndicator()}
            </div>
            <div className="mt-1 text-sm text-muted-foreground">{title}</div>
            
            <div className={cn("mt-3 text-sm font-medium", statusColor.text)}>
              {getStatusText(status)}
            </div>
            
            {lastSeen && (
              <div className="mt-1 text-xs text-muted-foreground">
                Last seen: {lastSeenText}
              </div>
            )}
          </div>
        </div>
        <div className={`h-1 w-full rounded-none ${statusColor.bg}`} />
      </CardContent>
    </Card>
  );
}
