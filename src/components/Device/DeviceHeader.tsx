
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Wifi, MoreHorizontal, X } from "lucide-react";

interface DeviceHeaderProps {
  device: any;
}

export const DeviceHeader = ({ device }: DeviceHeaderProps) => {
  return (
    <div className="flex flex-row items-start justify-between pb-2 space-y-0">
      <div>
        <div className="flex items-center gap-2">
          <h2 className="text-2xl font-bold">{device.name}</h2>
          <Badge variant="outline" className={`ml-2 ${device.status === 'Online' ? 'bg-green-50 text-green-600' : 'bg-gray-50 text-gray-600'}`}>
            {device.status === 'Online' ? 'Online' : device.status || 'Unknown'}
          </Badge>
        </div>
        <div className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
          <Wifi className="h-4 w-4" /> 
          {device.modelId?.name || 'Device'} • {device.location || 'Unknown Location'}
        </div>
      </div>
      <div className="flex gap-2">
        <Button variant="ghost" size="icon">
          <MoreHorizontal className="h-5 w-5" />
        </Button>
        <Button variant="ghost" size="icon">
          <X className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
};
