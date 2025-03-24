
import { Card, CardContent } from "@/components/ui/card";
import { SensorSourceData } from "@/services/interfaces/temp-humidity";
import { formatDistanceToNow } from "date-fns";
import { Thermometer, Droplets, Info } from "lucide-react";

interface SensorSourceInfoProps {
  sourceData: SensorSourceData;
}

export function SensorSourceInfo({ sourceData }: SensorSourceInfoProps) {
  // No sensors available
  const noSensorsAvailable = 
    sourceData.temperatureSensors.length === 0 && 
    sourceData.humiditySensors.length === 0;

  if (noSensorsAvailable) {
    return (
      <Card className="shadow-sm border border-amber-200 bg-amber-50">
        <CardContent className="p-4 text-sm">
          <div className="flex items-center gap-2">
            <Info className="h-4 w-4 text-amber-500" />
            <span>Using simulated data. No actual sensors connected.</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Format time ago
  const formatTimeAgo = (timestamp: string) => {
    try {
      return formatDistanceToNow(new Date(timestamp), { addSuffix: true });
    } catch (e) {
      return "Unknown";
    }
  };

  return (
    <Card className="shadow-sm">
      <CardContent className="p-4">
        <h3 className="text-sm font-medium mb-3">Data Sources</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Temperature Sensors Section */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm font-medium text-orange-600">
              <Thermometer className="h-4 w-4" />
              <span>Temperature Sensors ({sourceData.temperatureSensors.length})</span>
            </div>
            
            {sourceData.temperatureSensors.length === 0 ? (
              <div className="text-xs text-gray-500 pl-6">No temperature sensors available</div>
            ) : (
              <div className="space-y-2">
                {sourceData.temperatureSensors.map((sensor) => (
                  <div key={sensor.id} className="border rounded-md p-2 bg-gray-50 text-xs">
                    <div className="font-medium">{sensor.name}</div>
                    <div className="text-gray-600">Device: {sensor.deviceName}</div>
                    <div className="text-gray-500 text-[10px]">
                      Last updated: {formatTimeAgo(sensor.lastUpdated)}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Humidity Sensors Section */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm font-medium text-blue-600">
              <Droplets className="h-4 w-4" />
              <span>Humidity Sensors ({sourceData.humiditySensors.length})</span>
            </div>
            
            {sourceData.humiditySensors.length === 0 ? (
              <div className="text-xs text-gray-500 pl-6">No humidity sensors available</div>
            ) : (
              <div className="space-y-2">
                {sourceData.humiditySensors.map((sensor) => (
                  <div key={sensor.id} className="border rounded-md p-2 bg-gray-50 text-xs">
                    <div className="font-medium">{sensor.name}</div>
                    <div className="text-gray-600">Device: {sensor.deviceName}</div>
                    <div className="text-gray-500 text-[10px]">
                      Last updated: {formatTimeAgo(sensor.lastUpdated)}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
