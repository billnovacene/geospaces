
import { format } from "date-fns";

// Format date
export const formatDate = (dateString: string | undefined) => {
  if (!dateString) return "N/A";
  try {
    return format(new Date(dateString), "MM/dd/yyyy");
  } catch (e) {
    return dateString;
  }
};

// Format time
export const formatTime = (dateString: string | undefined) => {
  if (!dateString) return "N/A";
  try {
    return format(new Date(dateString), "HH:mm:ss");
  } catch (e) {
    return "";
  }
};

// Format measurement value with unit
export const formatMeasurement = (sensor: any, defaultUnit: string = '') => {
  if (!sensor) return 'N/A';
  const value = sensor.lastReceivedDataValue;
  if (value === undefined || value === null) return 'N/A';
  const unit = sensor.unit || defaultUnit;
  return `${value}${unit}`;
};

// Group sensors by type
export const groupSensorsByType = (device: any) => {
  if (!device || !device.sensors) return { activeSensors: [], statusSensors: [] };

  const activeSensors = device.sensors.filter((s: any) => 
    s.name.includes('temperature') || s.name.includes('co2') || s.name.includes('humidity')
  );
  
  const statusSensors = device.sensors.filter((s: any) => 
    s.name.includes('battery') || s.name.includes('vdd') || s.name.includes('rssi') || s.name.includes('snr')
  );

  return { activeSensors, statusSensors };
};

// Get the last read time from any available sensor or device
export const getLastReadTime = (device: any) => {
  const temperatureSensor = device.sensors?.find((s: any) => s.name.includes('temperature'));
  const lastReadTime = temperatureSensor?.lastReceivedDataTime || device.lastUpdated || device.createdAt;
  
  if (!lastReadTime) return 'N/A';
  
  try {
    return `${formatDate(lastReadTime)}, ${formatTime(lastReadTime)}`;
  } catch (e) {
    return 'N/A';
  }
};
