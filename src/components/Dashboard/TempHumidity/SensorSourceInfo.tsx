
import { Card, CardContent } from "@/components/ui/card";
import { SensorSourceData } from "@/services/interfaces/temp-humidity";
import { Thermometer, Droplets, Clock, ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";

interface SensorSourceInfoProps {
  sourceData: SensorSourceData;
  isLoading: boolean;
  isMockData?: boolean;
  operatingHours?: {
    startTime: string;
    endTime: string;
  };
}

export function SensorSourceInfo({ 
  sourceData, 
  isLoading, 
  isMockData = false,
  operatingHours
}: SensorSourceInfoProps) {
  const [isOpen, setIsOpen] = useState(false);
  const hasTempSensors = sourceData?.temperatureSensors?.length > 0;
  const hasHumiditySensors = sourceData?.humiditySensors?.length > 0;
  
  return (
    <Card className="shadow-sm">
      <CardContent className="pt-6 px-6 pb-8">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium">Data Sources</h3>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => setIsOpen(!isOpen)}
            className="flex items-center gap-1"
          >
            {isOpen ? (
              <>Hide details <ChevronUp className="h-4 w-4" /></>
            ) : (
              <>Show details <ChevronDown className="h-4 w-4" /></>
            )}
          </Button>
        </div>
        
        {isOpen && (
          <>
            {isLoading ? (
              <div className="text-sm text-gray-500">Loading sensor information...</div>
            ) : isMockData || (!hasTempSensors && !hasHumiditySensors) ? (
              <div className="text-sm text-gray-500">
                Using simulated data. No real sensors detected for this location.
              </div>
            ) : (
              <div className="space-y-4">
                {operatingHours && (
                  <div className="bg-blue-50 text-blue-800 rounded-md p-3 flex items-start mb-4">
                    <Clock className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
                    <div>
                      <div className="font-medium mb-1">Operating Hours</div>
                      <div className="text-sm">
                        Data is filtered to only include readings between {operatingHours.startTime} and {operatingHours.endTime}
                      </div>
                    </div>
                  </div>
                )}
                
                {hasTempSensors && (
                  <div>
                    <div className="flex items-center mb-2">
                      <Thermometer className="h-4 w-4 mr-2 text-red-500" />
                      <span className="font-medium">Temperature Sensors ({sourceData.temperatureSensors.length})</span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                      {sourceData.temperatureSensors.map((sensor, i) => (
                        <div key={i} className="bg-gray-50 p-2 rounded text-sm">
                          <div className="font-medium">{sensor.name}</div>
                          <div className="text-gray-500 text-xs">{sensor.deviceName}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                {hasHumiditySensors && (
                  <div>
                    <div className="flex items-center mb-2">
                      <Droplets className="h-4 w-4 mr-2 text-blue-500" />
                      <span className="font-medium">Humidity Sensors ({sourceData.humiditySensors.length})</span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                      {sourceData.humiditySensors.map((sensor, i) => (
                        <div key={i} className="bg-gray-50 p-2 rounded text-sm">
                          <div className="font-medium">{sensor.name}</div>
                          <div className="text-gray-500 text-xs">{sensor.deviceName}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </>
        )}
        
        {!isOpen && (
          <div className="text-sm text-gray-500">
            {isMockData || (!hasTempSensors && !hasHumiditySensors) 
              ? "Using simulated data. Click 'Show details' for more information."
              : `${hasTempSensors ? sourceData.temperatureSensors.length : 0} temperature sensors and ${hasHumiditySensors ? sourceData.humiditySensors.length : 0} humidity sensors available.`}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
