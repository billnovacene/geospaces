
import React from "react";
import { TableRow, TableCell } from "@/components/ui/table";
import { DeviceStatusIndicator } from "./DeviceStatusIndicators";
import { SensorMeasurement } from "./SensorMeasurement";

interface DeviceTableRowProps {
  device: {
    id: number;
    name: string;
    location: string;
    status: string;
    co2: {
      value: number | undefined;
      time: string | undefined;
      unit: string;
      thresholds: { warning: number; critical: number } | null;
    };
    temperature: {
      value: number | undefined;
      time: string | undefined;
      unit: string;
      thresholds: { warning: number; critical: number } | null;
    };
    humidity: {
      value: number | undefined;
      time: string | undefined;
      unit: string;
      thresholds: { warning: number; critical: number } | null;
    };
  };
}

export const DeviceTableRow = ({ device }: DeviceTableRowProps) => {
  return (
    <TableRow key={device.id} className="cursor-pointer hover:bg-muted/50">
      <TableCell>
        <DeviceStatusIndicator status={device.status} type="status" />
      </TableCell>
      <TableCell>
        <DeviceStatusIndicator status={device.status} type="signal" />
      </TableCell>
      <TableCell className="font-medium">
        {device.name}
      </TableCell>
      <TableCell>{device.location}</TableCell>
      <TableCell>
        <SensorMeasurement 
          value={device.co2.value} 
          unit={device.co2.unit} 
          name="CO2" 
          time={device.co2.time} 
          thresholds={device.co2.thresholds}
        />
      </TableCell>
      <TableCell>
        <SensorMeasurement 
          value={device.temperature.value} 
          unit={device.temperature.unit} 
          name="Temp" 
          time={device.temperature.time} 
          thresholds={device.temperature.thresholds}
        />
      </TableCell>
      <TableCell>
        <SensorMeasurement 
          value={device.humidity.value} 
          unit={device.humidity.unit} 
          name="Humidity" 
          time={device.humidity.time} 
          thresholds={device.humidity.thresholds}
        />
      </TableCell>
    </TableRow>
  );
};
