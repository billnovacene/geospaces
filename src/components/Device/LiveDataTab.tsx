
import { useState } from "react";
import { DeviceChart } from "./DeviceChart";
import { DeviceMeasurementsSection } from "./DeviceMeasurementsSection";
import { formatMeasurement, groupSensorsByType } from "./DeviceUtils";

interface LiveDataTabProps {
  device: any;
  formattedLastReadTime: string;
}

export const LiveDataTab = ({ device, formattedLastReadTime }: LiveDataTabProps) => {
  // Get sensors by type
  const { activeSensors, statusSensors } = groupSensorsByType(device);
  
  // Specific sensors for the chart
  const temperatureSensor = device.sensors?.find((s: any) => s.name.includes('temperature'));
  const co2Sensor = device.sensors?.find((s: any) => s.name.includes('co2'));
  
  return (
    <div>
      {/* Chart Section */}
      <DeviceChart 
        temperatureSensor={temperatureSensor} 
        co2Sensor={co2Sensor} 
      />
      
      {/* Active Measures Section */}
      {activeSensors.length > 0 && (
        <DeviceMeasurementsSection
          title="ACTIVE MEASURES"
          sensors={activeSensors}
          formattedLastReadTime={formattedLastReadTime}
          formatMeasurement={formatMeasurement}
        />
      )}
      
      {/* Status Measures Section */}
      {statusSensors.length > 0 && (
        <div className="mt-8">
          <DeviceMeasurementsSection
            title="ASSET STATUS MEASURES"
            sensors={statusSensors}
            formattedLastReadTime={formattedLastReadTime}
            formatMeasurement={formatMeasurement}
          />
        </div>
      )}
    </div>
  );
};
