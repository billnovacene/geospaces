
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
