
import { DeviceSensor } from "./DeviceSensor";

interface SensorGroupProps {
  groupName: string;
  sensors: any[];
}

export const SensorGroup = ({ groupName, sensors }: SensorGroupProps) => {
  return (
    <div className="mb-4 last:mb-0">
      <h4 className="text-sm font-medium text-muted-foreground mb-2 px-1">{groupName}</h4>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
        {sensors.map(sensor => (
          <DeviceSensor key={sensor.sensorToken} sensor={sensor} />
        ))}
      </div>
    </div>
  );
};
