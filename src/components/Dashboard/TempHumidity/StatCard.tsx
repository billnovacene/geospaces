
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { getSensorValueColor } from "@/utils/sensorThresholds";

interface StatCardProps {
  title: string;
  value: number | string;
  unit?: string;
  status: 'good' | 'caution' | 'warning';
  description?: string;
  large?: boolean;
  sensorType?: string;
  sensorValue?: number;
}

export function StatCard({
  title,
  value,
  unit,
  status,
  description,
  large,
  sensorType = "temperature",
  sensorValue
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
  
  return <Card className="overflow-hidden border-0 h-full rounded-none">
      <CardContent className="p-0 h-full flex flex-col">
        <div className="px-[5px] mx-[5px] flex-grow flex flex-col justify-center">
          <div className="flex flex-col items-center text-center">
            <div className="flex items-center">
              <span className="text-center font-medium">{value}</span>
              {unit && <span className="font-thin text-left text-sm">{unit}</span>}
            </div>
            <div className="mt-1 text-sm text-muted-foreground">{title}</div>
            
            <div className={cn("mt-3 text-sm font-medium")} style={{ color: statusColor }}>
              {getStatusText(status)}
            </div>
          </div>
        </div>
        <div className="h-1 w-full rounded-none" style={{ backgroundColor: statusColor }} />
      </CardContent>
    </Card>;
}
