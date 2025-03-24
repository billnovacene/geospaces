
import { fetchDevicesForZone } from "../device-zones";
import { ZONE_SENSORS_CACHE } from "./sensor-maps";

// Function to find temperature and humidity sensors in a zone
export async function findZoneSensors(zoneId: number, siteId: number): Promise<{
  temperature: string[];
  humidity: string[];
}> {
  // Check if we already have cached sensors for this zone
  const cacheKey = `${zoneId}`;
  if (ZONE_SENSORS_CACHE[cacheKey]) {
    console.log(`Using cached sensors for zone ${zoneId}:`, ZONE_SENSORS_CACHE[cacheKey]);
    return ZONE_SENSORS_CACHE[cacheKey];
  }

  // Fetch all devices in the zone
  console.log(`Finding sensors for zone ${zoneId}`);
  const devices = await fetchDevicesForZone(zoneId, siteId, true);
  
  // Arrays to store sensor IDs
  const temperatureSensors: string[] = [];
  const humiditySensors: string[] = [];
  
  // Loop through devices to find temperature and humidity sensors
  devices.forEach(device => {
    if (device.sensors && Array.isArray(device.sensors)) {
      device.sensors.forEach(sensor => {
        const sensorName = sensor.name.toLowerCase();
        // Check for temperature sensors
        if (sensorName.includes('temperature') && sensor.id) {
          temperatureSensors.push(sensor.id);
          console.log(`Found temperature sensor: ${sensor.id} (${sensor.name}) in device ${device.name}`);
        }
        // Check for humidity sensors
        if (sensorName.includes('humid') && sensor.id) {
          humiditySensors.push(sensor.id);
          console.log(`Found humidity sensor: ${sensor.id} (${sensor.name}) in device ${device.name}`);
        }
      });
    }
  });
  
  // Create result object
  const result = {
    temperature: temperatureSensors,
    humidity: humiditySensors
  };
  
  // Cache the result
  ZONE_SENSORS_CACHE[cacheKey] = result;
  
  console.log(`Zone ${zoneId} sensors found:`, result);
  return result;
}
