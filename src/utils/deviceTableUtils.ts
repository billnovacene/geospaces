
// Helper function for sorting device data
export const getSortedData = (data: any[], sortField: string | null, sortDirection: 'asc' | 'desc') => {
  if (!sortField || !data) return data;

  return [...data].sort((a, b) => {
    let aValue, bValue;

    if (sortField === 'name') {
      aValue = a.name;
      bValue = b.name;
    } else if (sortField === 'location') {
      aValue = a.location;
      bValue = b.location;
    } else if (sortField === 'co2') {
      aValue = a.co2.value || 0;
      bValue = b.co2.value || 0;
    } else if (sortField === 'temperature') {
      aValue = a.temperature.value || 0;
      bValue = b.temperature.value || 0;
    } else if (sortField === 'humidity') {
      aValue = a.humidity.value || 0;
      bValue = b.humidity.value || 0;
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
      ? String(aValue).localeCompare(String(bValue))
      : String(bValue).localeCompare(String(aValue));
  });
};

// Prepare sensor data from the device for the table
export const prepareDeviceData = (devices: any[]) => {
  if (!devices) return [];
  
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

    // Determine status based on sensor values
    const hasCriticalValue = 
      (co2Value && co2Value > 1000) || 
      (tempValue && (tempValue > 28 || tempValue < 16)) || 
      (humidityValue && (humidityValue > 70 || humidityValue < 20));
      
    const hasWarningValue = 
      (co2Value && co2Value > 800) || 
      (tempValue && (tempValue > 26 || tempValue < 18)) || 
      (humidityValue && (humidityValue > 60 || humidityValue < 30));

    const derivedStatus = hasCriticalValue ? "Inactive" : (hasWarningValue ? "Warning" : "Active");
    
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
  }).filter(device => 
    // Only show devices that have at least one sensor reading
    device.co2.value !== undefined || 
    device.temperature.value !== undefined || 
    device.humidity.value !== undefined
  );
};
