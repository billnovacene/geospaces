
/**
 * Defines the data type configurations for different sensor types
 * including threshold levels and corresponding colors
 */

export interface SensorTypeConfig {
  dataType: string;
  minValue: number;
  maxValue: number;
  thresholds: number[];
  colors: string[];
  unit: string;
  description?: string;
}

/**
 * Collection of sensor type configurations
 */
export const sensorTypes: Record<string, SensorTypeConfig> = {
  temperature: {
    dataType: "temperature",
    minValue: -10,
    maxValue: 50,
    thresholds: [10, 17, 22, 30],
    colors: [
      "#db4f6a",   // Red: too cold (below 10°C)
      "#ebc651",   // Amber: cool (10–17°C)
      "#3cc774",   // Green: comfortable (17–22°C)
      "#ebc651",   // Amber: warm (22–30°C)
      "#db4f6a"    // Red: too hot (30°C+)
    ],
    unit: "°C",
    description: "Ambient temperature"
  },
  humidity: {
    dataType: "humidity",
    minValue: 0,
    maxValue: 100,
    thresholds: [30, 40, 60, 70],
    colors: [
      "#db4f6a",   // Red: too dry (below 30%)
      "#ebc651",   // Amber: dry (30-40%)
      "#3cc774",   // Green: comfortable (40-60%)
      "#ebc651",   // Amber: humid (60-70%)
      "#db4f6a"    // Red: too humid (70%+)
    ],
    unit: "%",
    description: "Relative humidity"
  },
  co2: {
    dataType: "co2",
    minValue: 0,
    maxValue: 5000,
    thresholds: [400, 800, 1000, 1500],
    colors: [
      "#3cc774",   // Green: excellent (below 400ppm)
      "#3cc774",   // Green: good (400-800ppm)
      "#ebc651",   // Amber: moderate (800-1000ppm)
      "#db4f6a",   // Red: poor (1000-1500ppm)
      "#db4f6a"    // Red: very poor (1500ppm+)
    ],
    unit: "ppm",
    description: "Carbon dioxide concentration"
  },
  rssi: {
    dataType: "rssi",
    minValue: -120,
    maxValue: 0,
    thresholds: [-90, -80, -70, -60],
    colors: [
      "#db4f6a",   // Red: very weak signal (below -90dBm)
      "#ebc651",   // Amber: weak signal (-90 to -80dBm)
      "#3cc774",   // Green: moderate signal (-80 to -70dBm)
      "#3cc774",   // Green: good signal (-70 to -60dBm)
      "#3cc774"    // Green: excellent signal (above -60dBm)
    ],
    unit: "dBm",
    description: "Received signal strength indicator"
  },
  batteryVoltage: {
    dataType: "batteryVoltage",
    minValue: 0,
    maxValue: 5,
    thresholds: [2.0, 2.5, 3.0, 3.5],
    colors: [
      "#db4f6a",   // Red: critical (below 2.0V)
      "#db4f6a",   // Red: very low (2.0-2.5V)
      "#ebc651",   // Amber: low (2.5-3.0V)
      "#3cc774",   // Green: good (3.0-3.5V)
      "#3cc774"    // Green: excellent (above 3.5V)
    ],
    unit: "V",
    description: "Battery voltage"
  },
  light: {
    dataType: "light",
    minValue: 0,
    maxValue: 100000,
    thresholds: [100, 300, 500, 1000],
    colors: [
      "#ebc651",   // Amber: very dark (below 100 lux)
      "#3cc774",   // Green: dim (100-300 lux)
      "#3cc774",   // Green: good (300-500 lux)
      "#3cc774",   // Green: bright (500-1000 lux)
      "#ebc651"    // Amber: very bright (above 1000 lux)
    ],
    unit: "lux",
    description: "Ambient light level"
  },
};

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
