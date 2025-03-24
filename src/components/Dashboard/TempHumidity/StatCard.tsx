
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
        return '#3cc774';
      case 'caution':
        return '#ebc651';
      case 'warning':
        return '#db4f6a';
      default:
        return '#a1a1aa';
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
  
  // Format the last seen timestamp if provided
  const lastSeenText = lastSeen ? formatDistanceToNow(new Date(lastSeen), { addSuffix: true }) : 'N/A';
  
  // Get the appropriate icon
  const getIcon = () => {
    switch (icon) {
      case 'temperature':
        return <Thermometer className="h-5 w-5" style={{ color: statusColor }} />;
      case 'humidity':
        return <Droplets className="h-5 w-5" style={{ color: statusColor }} />;
      case 'min':
        return <ArrowDown className="h-5 w-5" style={{ color: statusColor }} />;
      case 'max':
        return <ArrowUp className="h-5 w-5" style={{ color: statusColor }} />;
      case 'avg':
        return <Sun className="h-5 w-5" style={{ color: statusColor }} />;
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
  
  return <Card className="overflow-hidden border-0 h-full rounded-none shadow-sm">
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
            
            <div className={cn("mt-3 text-sm font-medium")} style={{ color: statusColor }}>
              {getStatusText(status)}
            </div>
            
            {lastSeen && (
              <div className="mt-1 text-xs text-muted-foreground">
                Last seen: {lastSeenText}
              </div>
            )}
          </div>
        </div>
        <div className="h-1 w-full rounded-none" style={{ backgroundColor: statusColor }} />
      </CardContent>
    </Card>;
}
