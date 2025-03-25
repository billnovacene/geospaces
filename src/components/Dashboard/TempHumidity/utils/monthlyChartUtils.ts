
import { MonthlyOverviewPoint } from "@/services/temp-humidity";
import { getSensorValueColor } from "@/utils/sensorThresholds";
import { sensorTypes } from "@/utils/sensorThresholds";

/**
 * Enhances monthly data points with colors for chart rendering
 */
export function enhanceMonthlyChartData(data: MonthlyOverviewPoint[]) {
  return data.map(point => {
    const colorObj = getSensorValueColor("temperature", point.avgTemp);
    
    // Extract a simple color string from the Tailwind classes
    let barColor = "#60a5fa"; // Default blue
    
    if (colorObj.bg.includes("red")) {
      barColor = "#db4f6a"; // Red
    } else if (colorObj.bg.includes("amber")) {
      barColor = "#ebc651"; // Amber
    } else if (colorObj.bg.includes("green")) {
      barColor = "#3cc774"; // Green
    }
    
    return {
      ...point,
      barColor, // String type for charts
    };
  });
}

/**
 * Calculate chart y-axis min and max based on temperature data
 */
export function calculateMonthlyChartRange(data: MonthlyOverviewPoint[]) {
  const actualMinTemp = Math.min(...data.map(d => d.minTemp));
  const actualMaxTemp = Math.max(...data.map(d => d.maxTemp));
  
  const yAxisMin = Math.floor(actualMinTemp - 2);
  const yAxisMax = Math.ceil(actualMaxTemp + 2);

  return { yAxisMin, yAxisMax };
}

/**
 * Filter thresholds to only show relevant ones within the current data range
 */
export function filterRelevantMonthlyThresholds(thresholds: number[], yAxisMin: number, yAxisMax: number) {
  return thresholds
    .filter(threshold => threshold >= yAxisMin && threshold <= yAxisMax)
    .filter(threshold => threshold !== 28); // Exclude 28°C threshold for better readability
}

/**
 * Get temperature threshold legend items for the chart
 */
export function getTemperatureLegendItems() {
  const temperatureConfig = sensorTypes.temperature;
  
  return [
    {
      color: temperatureConfig.colors[2],
      label: "Good (17-22°C)"
    },
    {
      color: temperatureConfig.colors[1],
      label: "Cool/Warm (10-17°C, 22-30°C)"
    },
    {
      color: temperatureConfig.colors[0],
      label: "Too Cold/Hot (<10°C, >30°C)"
    }
  ];
}

/**
 * Simulate progressive loading of monthly data day by day
 * This gives a visual effect of data appearing gradually
 */
export function getProgressiveMonthlyData(data: MonthlyOverviewPoint[], loadPercentage: number) {
  if (!data || data.length === 0) return [];
  
  // Calculate how many days to include based on the percentage
  const daysToInclude = Math.ceil(data.length * (loadPercentage / 100));
  
  // Return a slice of the data based on the percentage (oldest to newest)
  return data.slice(0, daysToInclude);
}

/**
 * Calculate stats based on the currently loaded data
 */
export function calculateStatsFromLoadedData(data: MonthlyOverviewPoint[]) {
  if (!data || data.length === 0) {
    return {
      avgTemp: 0,
      minTemp: 0,
      maxTemp: 0,
      avgHumidity: 0
    };
  }
  
  const sumTemp = data.reduce((sum, point) => sum + point.avgTemp, 0);
  const minTemp = Math.min(...data.map(point => point.minTemp));
  const maxTemp = Math.max(...data.map(point => point.maxTemp));
  const sumHumidity = data.reduce((sum, point) => sum + point.avgHumidity, 0);
  
  return {
    avgTemp: sumTemp / data.length,
    minTemp,
    maxTemp,
    avgHumidity: sumHumidity / data.length
  };
}

