
import { sensorTypes } from "./sensorConfigs";

/**
 * Get the color for a sensor value based on thresholds
 * 
 * @param sensorType The type of sensor (temperature, humidity, etc.)
 * @param value The value to get the color for
 * @returns The corresponding color based on the thresholds
 */
export function getSensorValueColor(sensorType: string, value: number | null | undefined): string {
  if (value === null || value === undefined) {
    return "#a1a1aa"; // Default gray for null/undefined values
  }

  const config = sensorTypes[sensorType];
  if (!config) {
    return "#a1a1aa"; // Default gray for unknown sensor types
  }

  // Find which threshold band the value falls into
  let band = 0;
  for (let i = 0; i < config.thresholds.length; i++) {
    if (value >= config.thresholds[i]) {
      band = i + 1;
    } else {
      break;
    }
  }

  return config.colors[band];
}
