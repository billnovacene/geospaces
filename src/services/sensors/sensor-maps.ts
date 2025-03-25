
// Cache for zone sensors
export const ZONE_SENSORS_CACHE: Record<string, {
  temperature: string[];
  humidity: string[];
  temperatureSensors: Array<{id: string; name: string; deviceName: string; deviceId: string; lastUpdated: string;}>;
  humiditySensors: Array<{id: string; name: string; deviceName: string; deviceId: string; lastUpdated: string;}>;
}> = {};

// Map of temperature sensors for each site
export const TEMP_SENSORS: Record<string, string[]> = {
  "471": ["e4dd6e3f-8572-4036-84e9-4c6e79cfcb18", "5ba24d9c-efb1-4dce-9a05-78df9284c39b"], // Site 471 temperature sensors
};

// Map of humidity sensors for each site
export const HUMIDITY_SENSORS: Record<string, string[]> = {
  "471": ["a1442adf-1109-4b30-a860-309ef45ae67f", "7c8f5dae-8e86-4577-9933-52cb7c81ea0c"], // Site 471 humidity sensors
};

// Specific zone sensors for important zones
export const ZONE_SENSORS: Record<string, { temperature: string[], humidity: string[] }> = {
  "12658": {
    temperature: ["e4dd6e3f-8572-4036-84e9-4c6e79cfcb18", "5ba24d9c-efb1-4dce-9a05-78df9284c39b"], // Zone 12658 temperature sensors
    humidity: ["a1442adf-1109-4b30-a860-309ef45ae67f", "7c8f5dae-8e86-4577-9933-52cb7c81ea0c"]     // Zone 12658 humidity sensors
  }
};

// Source data for sensor metadata
export const SITE_SENSOR_DETAILS: Record<string, {
  temperatureSensors: Array<{id: string; name: string; deviceName: string; deviceId: string; lastUpdated: string;}>;
  humiditySensors: Array<{id: string; name: string; deviceName: string; deviceId: string; lastUpdated: string;}>;
}> = {
  "471": {
    temperatureSensors: [
      {
        id: "e4dd6e3f-8572-4036-84e9-4c6e79cfcb18",
        name: "Temperature Sensor 1",
        deviceName: "Temperature Monitor",
        deviceId: "temp-device-471-1",
        lastUpdated: new Date().toISOString()
      },
      {
        id: "5ba24d9c-efb1-4dce-9a05-78df9284c39b",
        name: "Temperature Sensor 2",
        deviceName: "Backup Temperature Monitor",
        deviceId: "temp-device-471-2",
        lastUpdated: new Date().toISOString()
      }
    ],
    humiditySensors: [
      {
        id: "a1442adf-1109-4b30-a860-309ef45ae67f",
        name: "Humidity Sensor 1",
        deviceName: "Humidity Monitor",
        deviceId: "humidity-device-471-1",
        lastUpdated: new Date().toISOString()
      },
      {
        id: "7c8f5dae-8e86-4577-9933-52cb7c81ea0c",
        name: "Humidity Sensor 2", 
        deviceName: "Backup Humidity Monitor",
        deviceId: "humidity-device-471-2",
        lastUpdated: new Date().toISOString()
      }
    ]
  }
};

// Similar details for zone-specific sensors
export const ZONE_SENSOR_DETAILS: Record<string, {
  temperatureSensors: Array<{id: string; name: string; deviceName: string; deviceId: string; lastUpdated: string;}>;
  humiditySensors: Array<{id: string; name: string; deviceName: string; deviceId: string; lastUpdated: string;}>;
}> = {
  "12658": {
    temperatureSensors: [
      {
        id: "e4dd6e3f-8572-4036-84e9-4c6e79cfcb18",
        name: "Zone Temperature Sensor Primary",
        deviceName: "Zone Temperature Monitor",
        deviceId: "temp-device-zone-12658-1",
        lastUpdated: new Date().toISOString()
      },
      {
        id: "5ba24d9c-efb1-4dce-9a05-78df9284c39b",
        name: "Zone Temperature Sensor Secondary",
        deviceName: "Zone Backup Temperature Monitor",
        deviceId: "temp-device-zone-12658-2",
        lastUpdated: new Date().toISOString()
      }
    ],
    humiditySensors: [
      {
        id: "a1442adf-1109-4b30-a860-309ef45ae67f",
        name: "Zone Humidity Sensor Primary",
        deviceName: "Zone Humidity Monitor",
        deviceId: "humidity-device-zone-12658-1",
        lastUpdated: new Date().toISOString()
      },
      {
        id: "7c8f5dae-8e86-4577-9933-52cb7c81ea0c",
        name: "Zone Humidity Sensor Secondary",
        deviceName: "Zone Backup Humidity Monitor",
        deviceId: "humidity-device-zone-12658-2",
        lastUpdated: new Date().toISOString()
      }
    ]
  }
};
