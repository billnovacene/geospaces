
import { Clock, Battery, Droplets, Lightbulb, Signal, Thermometer, Wind } from "lucide-react";
import { format } from "date-fns";

interface DeviceSensorProps {
  sensor: any;
}

export const DeviceSensor = ({ sensor }: DeviceSensorProps) => {
  // Get sensor display value with unit
  const getSensorValue = (sensor: any) => {
    if (!sensor) return "N/A";
    
    const value = sensor.lastReceivedDataValue;
    const unit = sensor.unit || "";
    
    if (value === undefined || value === null) return "N/A";
    
    return `${value}${unit}`;
  };

  // Get icon for sensor type
  const getSensorIcon = (sensorName: string) => {
    if (sensorName.includes("temperature")) return <Thermometer className="h-4 w-4 text-orange-500" />;
    if (sensorName.includes("humidity")) return <Droplets className="h-4 w-4 text-blue-500" />;
    if (sensorName.includes("co2")) return <Wind className="h-4 w-4 text-purple-500" />;
    if (sensorName.includes("vdd") || sensorName.includes("battery")) return <Battery className="h-4 w-4 text-green-500" />;
    if (sensorName.includes("light")) return <Lightbulb className="h-4 w-4 text-yellow-500" />;
    if (sensorName.includes("rssi") || sensorName.includes("snr")) return <Signal className="h-4 w-4 text-slate-500" />;
    return null;
  };

  // Format date
  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return "N/A";
    try {
      return format(new Date(dateString), "MMM d, yyyy");
    } catch (e) {
      return dateString;
    }
  };

  // Format time
  const formatTime = (dateString: string | undefined) => {
    if (!dateString) return "N/A";
    try {
      return format(new Date(dateString), "h:mm a");
    } catch (e) {
      return "";
    }
  };

  // Get formatted date-time
  const formatDateTime = (dateString: string | undefined) => {
    if (!dateString) return "N/A";
    
    const date = formatDate(dateString);
    const time = formatTime(dateString);
    
    return `${date}, ${time}`;
  };

  // Get last received data time
  const getLastDataTime = (sensor: any) => {
    if (!sensor || !sensor.lastReceivedDataTime) return null;
    return formatDateTime(sensor.lastReceivedDataTime);
  };

  const sensorName = sensor.name.split('/').pop() || '';
  const sensorValue = getSensorValue(sensor);
  const lastDataTime = getLastDataTime(sensor);
  
  return (
    <div className="flex items-center gap-2 p-3 rounded border bg-slate-50 hover:bg-slate-100 transition-colors">
      <div className="p-1.5 bg-white rounded-full shadow-sm">
        {getSensorIcon(sensorName) || <div className="h-4 w-4" />}
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-xs font-medium capitalize truncate">
          {sensorName.replace(/_/g, ' ')}
        </div>
        <div className="text-sm font-bold">
          {sensorValue}
        </div>
        {lastDataTime && (
          <div className="text-[10px] text-muted-foreground truncate">
            Last update: {lastDataTime}
          </div>
        )}
      </div>
    </div>
  );
};
