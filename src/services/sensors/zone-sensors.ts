
import { fetchDevicesForZone } from "../device-zones";
import { ZONE_SENSORS, ZONE_SENSORS_CACHE, ZONE_SENSOR_DETAILS } from "./sensor-maps";
import { SensorInfo } from "../interfaces/temp-humidity";

// Function to find temperature and humidity sensors in a zone
export async function findZoneSensors(zoneId: number, siteId: number): Promise<{
  temperature: string[];
  humidity: string[];
  temperatureSensors: SensorInfo[];
  humiditySensors: SensorInfo[];
}> {
  // Check if we already have cached sensors for this zone
  const cacheKey = `${zoneId}`;
  if (ZONE_SENSORS_CACHE[cacheKey]) {
    console.log(`Using cached sensors for zone ${zoneId}:`, ZONE_SENSORS_CACHE[cacheKey]);
    return ZONE_SENSORS_CACHE[cacheKey];
  }
  
  // Check if this is a known zone in our static mapping
  const zoneIdStr = zoneId.toString();
  if (ZONE_SENSORS[zoneIdStr]) {
    console.log(`Using predefined sensors for zone ${zoneId}:`, ZONE_SENSORS[zoneIdStr]);
    
    // Get the predefined sensor details if available
    const sensorDetails = ZONE_SENSOR_DETAILS[zoneIdStr] || {
      temperatureSensors: [],
      humiditySensors: []
    };
    
    // Create result with both sensor IDs and detailed info
    const result = {
      temperature: ZONE_SENSORS[zoneIdStr].temperature,
      humidity: ZONE_SENSORS[zoneIdStr].humidity,
      temperatureSensors: sensorDetails.temperatureSensors,
      humiditySensors: sensorDetails.humiditySensors
    };
    
    // Cache the result
    ZONE_SENSORS_CACHE[cacheKey] = result;
    return result;
  }

  // If not in static mapping, fetch all devices in the zone
  console.log(`Finding sensors for zone ${zoneId} in site ${siteId}`);
  const devices = await fetchDevicesForZone(zoneId, siteId, true);
  console.log(`Found ${devices.length} devices in zone ${zoneId}`);
  
  // Arrays to store sensor IDs
  const temperatureSensors: string[] = [];
  const humiditySensors: string[] = [];
  
  // Arrays to store detailed sensor info
  const temperatureSensorDetails: SensorInfo[] = [];
  const humiditySensorDetails: SensorInfo[] = [];
  
  // Loop through devices to find temperature and humidity sensors
  devices.forEach(device => {
    if (device.sensors && Array.isArray(device.sensors)) {
      device.sensors.forEach(sensor => {
        const sensorName = sensor.name.toLowerCase();
        
        // Check for temperature sensors
        if (sensorName.includes('temperature') && sensor.id) {
          temperatureSensors.push(sensor.id);
          
          // Add detailed sensor info
          temperatureSensorDetails.push({
            id: sensor.id,
            name: sensor.name,
            deviceName: device.name || `Device ${device.id}`,
            deviceId: device.id?.toString() || '',
            lastUpdated: sensor.lastReceivedDataTime || new Date().toISOString()
          });
          
          console.log(`Found temperature sensor: ${sensor.id} (${sensor.name}) in device ${device.name}`);
        }
        
        // Check for humidity sensors
        if (sensorName.includes('humid') && sensor.id) {
          humiditySensors.push(sensor.id);
          
          // Add detailed sensor info
          humiditySensorDetails.push({
            id: sensor.id,
            name: sensor.name,
            deviceName: device.name || `Device ${device.id}`,
            deviceId: device.id?.toString() || '',
            lastUpdated: sensor.lastReceivedDataTime || new Date().toISOString()
          });
          
          console.log(`Found humidity sensor: ${sensor.id} (${sensor.name}) in device ${device.name}`);
        }
      });
    }
  });
  
  // Create result object
  const result = {
    temperature: temperatureSensors,
    humidity: humiditySensors,
    temperatureSensors: temperatureSensorDetails,
    humiditySensors: humiditySensorDetails
  };
  
  // Cache the result
  ZONE_SENSORS_CACHE[cacheKey] = result;
  
  console.log(`Zone ${zoneId} sensors found:`, {
    temperatureSensors: temperatureSensorDetails.length,
    humiditySensors: humiditySensorDetails.length,
    totalSensors: temperatureSensorDetails.length + humiditySensorDetails.length
  });
  return result;
}
