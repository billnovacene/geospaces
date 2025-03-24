
import { Badge } from "@/components/ui/badge";
import { Smartphone, Clock } from "lucide-react";
import { getStatusColor } from "@/utils/formatting";
import { format } from "date-fns";
import { SensorGroup } from "./SensorGroup";

interface DeviceCardProps {
  device: any;
}

export const DeviceCard = ({ device }: DeviceCardProps) => {
  // Format date
  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return "N/A";
    try {
      return format(new Date(dateString), "MMM d, yyyy");
    } catch (e) {
      return dateString;
    }
  };

  // Group sensors by device
  const getSensorGroups = (sensors: any[]) => {
    if (!sensors || sensors.length === 0) return [];
    
    const groups = {
      'Environmental': sensors.filter(s => 
        s.name.includes('temperature') || 
        s.name.includes('humidity') || 
        s.name.includes('co2')),
      'Power': sensors.filter(s => 
        s.name.includes('vdd') || 
        s.name.includes('battery')),
      'Light': sensors.filter(s => 
        s.name.includes('light')),
      'Signal': sensors.filter(s => 
        s.name.includes('rssi') || 
        s.name.includes('snr')),
      'Other': sensors.filter(s => 
        !s.name.includes('temperature') && 
        !s.name.includes('humidity') && 
        !s.name.includes('co2') && 
        !s.name.includes('vdd') && 
        !s.name.includes('battery') && 
        !s.name.includes('light') &&
        !s.name.includes('rssi') && 
        !s.name.includes('snr'))
    };
    
    // Remove empty groups
    return Object.entries(groups).filter(([_, sensors]) => sensors.length > 0);
  };

  return (
    <div className="border rounded-md overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200">
      <div className="bg-gradient-to-r from-slate-50 to-slate-100 p-4 border-b">
        <div className="flex items-center">
          <div className="mr-3 bg-primary/10 p-2 rounded-full">
            <Smartphone className="h-5 w-5 text-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="font-medium text-lg">{device.name}</h3>
              <Badge variant="outline" className={getStatusColor(device.status || "Unknown")}>
                {device.status || "Unknown"}
              </Badge>
            </div>
            <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mt-1">
              <span className="flex items-center">ID: {device.id}</span>
              {device.modelId && <span className="flex items-center">Model: {device.modelId.name || "Unknown"}</span>}
              <span className="flex items-center gap-1">
                <Clock className="h-3.5 w-3.5" />
                Added: {formatDate(device.createdAt)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {device.sensors && device.sensors.length > 0 && (
        <div className="p-4 bg-white">
          {getSensorGroups(device.sensors).map(([groupName, sensors]) => (
            <SensorGroup key={groupName} groupName={groupName} sensors={sensors} />
          ))}
        </div>
      )}
    </div>
  );
};
