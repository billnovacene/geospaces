
import { sensorTypes } from "./sensorConfigs";

/**
 * Get the color for a sensor value based on thresholds
 * 
 * @param sensorType The type of sensor (temperature, humidity, etc.)
 * @param value The value to get the color for
 * @returns An object with text and background color classes
 */
export function getSensorValueColor(sensorType: string, value: number | null | undefined): { text: string; bg: string } {
  if (value === null || value === undefined) {
    return { 
      text: "text-gray-400",
      bg: "bg-gray-200"
    };
  }

  const config = sensorTypes[sensorType];
  if (!config) {
    return { 
      text: "text-gray-400",
      bg: "bg-gray-200"
    };
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

  const color = config.colors[band];
  
  // Map color to Tailwind classes
  switch (color) {
    case "#db4f6a": // Red
      return { 
        text: "text-red-600",
        bg: "bg-gradient-to-r from-red-300 to-red-400"
      };
    case "#ebc651": // Amber
      return { 
        text: "text-amber-600",
        bg: "bg-gradient-to-r from-amber-300 to-amber-400"
      };
    case "#3cc774": // Green
      return { 
        text: "text-green-600",
        bg: "bg-gradient-to-r from-green-300 to-green-400"
      };
    default:
      return { 
        text: "text-blue-600",
        bg: "bg-gradient-to-r from-blue-300 to-blue-400"
      };
  }
}
