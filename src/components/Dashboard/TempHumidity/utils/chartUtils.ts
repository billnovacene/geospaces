
import { DailyOverviewPoint } from "@/services/temp-humidity";
import { getSensorValueColor } from "@/utils/sensorThresholds";

/**
 * Enhances daily data points with colors for chart rendering
 */
export function enhanceDailyChartData(data: DailyOverviewPoint[]) {
  return data.map(point => {
    // Properly check if the temperature data is real
    // This is important for distinguishing real vs simulated data
    const isRealDataPoint = point.isReal?.temperature === true;
    
    // For real data, use the temperature-based color
    // For simulated data, use a light gray
    let barColor = "#E5E7EB"; // Default gray for simulated data
    
    if (isRealDataPoint) {
      const colorObj = getSensorValueColor("temperature", point.temperature);
      // Extract the color from the background class (assuming the format is consistent)
      if (colorObj.bg.includes("red")) {
        barColor = "#db4f6a"; // Red
      } else if (colorObj.bg.includes("amber")) {
        barColor = "#ebc651"; // Amber
      } else if (colorObj.bg.includes("green")) {
        barColor = "#3cc774"; // Green
      } else if (colorObj.bg.includes("blue")) {
        barColor = "#60a5fa"; // Blue
      }
    }
    
    return {
      ...point,
      barColor, // String type for charts
      // Create a label for the tooltip
      label: isRealDataPoint ? "Real data" : "Simulated data"
    };
  });
}

/**
 * Calculate chart y-axis min and max based on temperature data
 */
export function calculateChartRange(data: DailyOverviewPoint[]) {
  // Calculate actual min and max temps from the data
  const tempValues = data
    .filter(d => d.temperature !== null && d.temperature !== undefined)
    .map(d => d.temperature);
    
  const actualMinTemp = tempValues.length > 0 ? Math.min(...tempValues) : 10;
  const actualMaxTemp = tempValues.length > 0 ? Math.max(...tempValues) : 30;
  
  const yAxisMin = Math.floor(actualMinTemp - 2);
  const yAxisMax = Math.ceil(actualMaxTemp + 2);

  return { yAxisMin, yAxisMax };
}

/**
 * Filter thresholds to only show relevant ones for the current data range
 */
export function filterRelevantThresholds(thresholds: number[], yAxisMin: number, yAxisMax: number) {
  return thresholds
    .filter(threshold => threshold >= yAxisMin && threshold <= yAxisMax)
    .filter(threshold => threshold !== 28); // Exclude 28°C threshold
}

/**
 * Simulate a progressive data load by slicing the data array
 * This is useful for creating animated loading effects for charts
 */
export function getProgressiveData(data: DailyOverviewPoint[], loadPercentage: number) {
  if (!data || data.length === 0) return [];
  
  // Calculate how many items to include based on the percentage
  const itemsToInclude = Math.ceil(data.length * (loadPercentage / 100));
  
  // Return a slice of the data based on the percentage
  return data.slice(0, itemsToInclude);
}

