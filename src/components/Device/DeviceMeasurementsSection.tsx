
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";
import { DeviceMeasurement } from "./DeviceMeasurement";

interface DeviceMeasurementsSectionProps {
  title: string;
  sensors: any[];
  formattedLastReadTime: string;
  formatMeasurement: (sensor: any, defaultUnit?: string) => string;
}

export const DeviceMeasurementsSection = ({
  title,
  sensors,
  formattedLastReadTime,
  formatMeasurement
}: DeviceMeasurementsSectionProps) => {
  const [expanded, setExpanded] = useState(false);
  
  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-lg font-bold flex items-center">
          {title}
        </h3>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => setExpanded(!expanded)}
        >
          Expand all <ChevronDown className="h-4 w-4 ml-1" />
        </Button>
      </div>
      
      {sensors.map((sensor, index) => (
        <DeviceMeasurement
          key={`${sensor.name}-${index}`}
          title={sensor.name}
          value={formatMeasurement(sensor, sensor.defaultUnit)}
          lastReadTime={formattedLastReadTime}
        />
      ))}
    </div>
  );
};
