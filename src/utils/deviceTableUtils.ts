
import { getSensorValueColor, getSensorValueStatus } from "./sensorThresholds";

// Helper function for sorting device data
export const getSortedData = (data: any[], sortField: string | null, sortDirection: 'asc' | 'desc') => {
  if (!sortField || !data || data.length === 0) return data;

  return [...data].sort((a, b) => {
    let aValue, bValue;

    if (sortField === 'name') {
      aValue = a.name;
      bValue = b.name;
    } else if (sortField === 'location') {
      aValue = a.location;
      bValue = b.location;
    } else if (sortField === 'co2') {
      aValue = a.co2?.value || 0;
      bValue = b.co2?.value || 0;
    } else if (sortField === 'temperature') {
      aValue = a.temperature?.value || 0;
      bValue = b.temperature?.value || 0;
    } else if (sortField === 'humidity') {
      aValue = a.humidity?.value || 0;
      bValue = b.humidity?.value || 0;
    } else {
      return 0;
    }

    if (aValue === bValue) return 0;
    
    // For numerical values
    if (typeof aValue === 'number' && typeof bValue === 'number') {
      return sortDirection === 'asc' ? aValue - bValue : bValue - aValue;
    }
    
    // For string values
    return sortDirection === 'asc' 
      ? String(aValue || '').localeCompare(String(bValue || ''))
      : String(bValue || '').localeCompare(String(aValue || ''));
  });
};

// Prepare sensor data from the device for the table
export const prepareDeviceData = (devices: any[]) => {
  if (!devices || devices.length === 0) return [];
  
  console.log("Raw devices data:", devices);
  
  return devices.map(device => {
    // Extract sensor data
    const co2Sensor = device.sensors?.find((s: any) => s.name?.toLowerCase().includes('co2'));
    const tempSensor = device.sensors?.find((s: any) => s.name?.toLowerCase().includes('temp'));
    const humiditySensor = device.sensors?.find((s: any) => s.name?.toLowerCase().includes('humid'));
    
    const co2Value = co2Sensor?.lastReceivedDataValue;
    const tempValue = tempSensor?.lastReceivedDataValue;
    const humidityValue = humiditySensor?.lastReceivedDataValue;
    
    const co2Time = co2Sensor?.lastReceivedDataTime;
    const tempTime = tempSensor?.lastReceivedDataTime;
    const humidityTime = humiditySensor?.lastReceivedDataTime;

    // Determine status based on sensor values using the new threshold system
    const tempStatus = tempValue ? getSensorValueStatus("temperature", tempValue) : "N/A";
    const co2Status = co2Value ? getSensorValueStatus("co2", co2Value) : "N/A";
    const humidityStatus = humidityValue ? getSensorValueStatus("humidity", humidityValue) : "N/A";
    
    // Determine overall device status - prioritize Critical > Warning > Good
    const hasCriticalStatus = [tempStatus, co2Status, humidityStatus].some(
      status => status === "Too Cold" || status === "Too Hot" || 
               status === "Very Poor" || status === "Too Dry" || 
               status === "Too Humid" || status === "Critical"
    );
    
    const hasWarningStatus = [tempStatus, co2Status, humidityStatus].some(
      status => status === "Cool" || status === "Warm" || 
               status === "Poor" || status === "Dry" || 
               status === "Humid" || status === "Warning"
    );
    
    const derivedStatus = hasCriticalStatus ? "Inactive" : (hasWarningStatus ? "Warning" : "Active");
    
    console.log(`Prepared device ${device.id}: ${device.name}`, { 
      co2: co2Value, 
      temp: tempValue, 
      humidity: humidityValue,
      status: derivedStatus
    });
    
    return {
      id: device.id,
      name: device.name,
      location: device.zoneName || 'Unknown',
      status: derivedStatus,
      co2: {
        value: co2Value,
        time: co2Time,
        unit: 'ppm',
        thresholds: {warning: 800, critical: 1000}
      },
      temperature: {
        value: tempValue,
        time: tempTime,
        unit: '°C',
        thresholds: {warning: 25, critical: 28}
      },
      humidity: {
        value: humidityValue,
        time: humidityTime,
        unit: '%',
        thresholds: null
      }
    };
  });
};
