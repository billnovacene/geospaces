
import { SensorInfo } from "../interfaces/temp-humidity";

// Map of known temperature sensors by site
export const TEMP_SENSORS: Record<string, string[]> = {
  "471": ["a1442adf-1109-4b30-a860-309ef45ae67f"]
};

// Map of known humidity sensors by site
export const HUMIDITY_SENSORS: Record<string, string[]> = {
  "471": ["e4dd6e3f-8572-4036-84e9-4c6e79cfcb18"]
};

// Detailed sensor information for known site sensors
export const SITE_SENSOR_DETAILS: Record<string, {
  temperatureSensors: SensorInfo[];
  humiditySensors: SensorInfo[];
}> = {
  "471": {
    temperatureSensors: [
      {
        id: "a1442adf-1109-4b30-a860-309ef45ae67f",
        name: "Temperature Sensor",
        deviceName: "Main Temperature Monitor",
        deviceId: "temp-001",
        lastUpdated: new Date().toISOString()
      }
    ],
    humiditySensors: [
      {
        id: "e4dd6e3f-8572-4036-84e9-4c6e79cfcb18",
        name: "Humidity Sensor",
        deviceName: "Main Humidity Monitor",
        deviceId: "hum-001",
        lastUpdated: new Date().toISOString()
      }
    ]
  }
};

// Cache for sensors found in zones
export const ZONE_SENSORS_CACHE: Record<string, {
  temperature: string[];
  humidity: string[];
  temperatureSensors: SensorInfo[];
  humiditySensors: SensorInfo[];
}> = {};
