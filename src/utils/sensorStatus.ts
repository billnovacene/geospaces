
import { sensorTypes } from "./sensorConfigs";

/**
 * Get the status label for a sensor value
 * 
 * @param sensorType The type of sensor
 * @param value The value to get the status for
 * @returns A string representing the status (e.g., "Good", "Warning", "Critical")
 */
export function getSensorValueStatus(sensorType: string, value: number | null | undefined): string {
  if (value === null || value === undefined) {
    return "N/A";
  }

  const config = sensorTypes[sensorType];
  if (!config) {
    return "Unknown";
  }

  // Temperature-specific statuses
  if (sensorType === "temperature") {
    if (value < config.thresholds[0]) return "Too Cold";
    if (value < config.thresholds[1]) return "Cool";
    if (value < config.thresholds[2]) return "Comfortable";
    if (value < config.thresholds[3]) return "Warm";
    return "Too Hot";
  }
  
  // CO2-specific statuses
  if (sensorType === "co2") {
    if (value < config.thresholds[0]) return "Excellent";
    if (value < config.thresholds[1]) return "Good";
    if (value < config.thresholds[2]) return "Moderate";
    if (value < config.thresholds[3]) return "Poor";
    return "Very Poor";
  }
  
  // Humidity-specific statuses
  if (sensorType === "humidity") {
    if (value < config.thresholds[0]) return "Too Dry";
    if (value < config.thresholds[1]) return "Dry";
    if (value < config.thresholds[2]) return "Optimal";
    if (value < config.thresholds[3]) return "Humid";
    return "Too Humid";
  }
  
  // Generic status for other sensor types
  const colorIndex = config.colors.findIndex(
    (_, i) => i === 0 ? value < config.thresholds[0] : 
              i === config.colors.length - 1 ? value >= config.thresholds[config.thresholds.length - 1] : 
              value >= config.thresholds[i-1] && value < config.thresholds[i]
  );
  
  if (colorIndex === -1) return "Unknown";
  
  // Map color to a status label
  const color = config.colors[colorIndex];
  if (color === "#db4f6a") return "Critical";
  if (color === "#ebc651") return "Warning";
  if (color === "#3cc774") return "Good";
  
  return "Unknown";
}
