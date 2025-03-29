
/**
 * Data processing utilities for damp and mold data
 */
import { assessMoldRisk } from './risk-assessment';
import { DailyOverviewPoint } from '../interfaces/temp-humidity';

/**
 * Generates monthly risk data from daily data points
 * This converts raw data points into risk assessment summaries
 * @param dailyData Array of daily data points
 * @returns Array of risk assessment objects
 */
export const generateMonthlyRiskDataFromDailyData = (dailyData: DailyOverviewPoint[]) => {
  if (!dailyData || dailyData.length === 0) {
    return [];
  }
  
  console.log(`Generating monthly risk data from ${dailyData.length} daily data points`);
  
  // Group data by site and zone
  const groupedData = groupDataBySiteAndZone(dailyData);
  
  // Process each site/zone group to calculate risk metrics
  return Object.keys(groupedData).map((key, index) => {
    const zoneData = groupedData[key];
    const siteData = zoneData[0]; // Taking the first entry for site/zone info
    
    // Calculate average temperature and humidity
    const avgTemp = calculateAverage(zoneData.map(item => item.temperature));
    const avgHumidity = calculateAverage(zoneData.map(item => item.humidity));
    const dewPoint = avgTemp - ((100 - avgHumidity) / 5);
    
    // Count of readings at various risk levels
    const riskCounts = countRiskLevels(zoneData);
    
    // Determine overall risk based on alarm count
    let overallRisk = 'Good';
    if (riskCounts.Alarm > 10 || (riskCounts.Alarm > 5 && riskCounts.Caution > 10)) {
      overallRisk = 'Alarm';
    } else if (riskCounts.Caution > 15 || riskCounts.Alarm > 0) {
      overallRisk = 'Caution';
    }
    
    // Calculate time at risk (each data point represents 4 hours in our mock data)
    const timeAtRisk = Math.round((riskCounts.Alarm + riskCounts.Caution * 0.5) * 4);
    
    return {
      id: index + 1,
      building: siteData.siteName || `Building ${siteData.siteId}`,
      zone: siteData.zoneName || `Zone ${siteData.zoneId}`,
      temp: avgTemp.toFixed(1),
      rh: Math.round(avgHumidity),
      dewPoint: dewPoint.toFixed(1),
      overallRisk,
      alarmCount: riskCounts.Alarm,
      timeAtRisk: `${timeAtRisk}h`,
      comments: generateComments(overallRisk, avgTemp, avgHumidity, dewPoint)
    };
  });
};

/**
 * Group data points by site and zone
 * @param data Array of data points
 * @returns Object with site/zone keys and arrays of data points
 */
const groupDataBySiteAndZone = (data: DailyOverviewPoint[]) => {
  const grouped: Record<string, DailyOverviewPoint[]> = {};
  
  data.forEach(point => {
    const key = `${point.siteId || 'unknown'}_${point.zoneId || 'unknown'}`;
    if (!grouped[key]) {
      grouped[key] = [];
    }
    grouped[key].push(point);
  });
  
  return grouped;
};

/**
 * Calculate average of numerical values
 * @param values Array of numbers
 * @returns Average value
 */
const calculateAverage = (values: number[]) => {
  if (!values || values.length === 0) return 0;
  const sum = values.reduce((acc, val) => acc + val, 0);
  return sum / values.length;
};

/**
 * Count risk levels across data points
 * @param data Array of data points
 * @returns Object with counts for each risk level
 */
const countRiskLevels = (data: DailyOverviewPoint[]) => {
  const counts = {
    Good: 0,
    Caution: 0,
    Alarm: 0
  };
  
  data.forEach(point => {
    const risk = assessMoldRisk(point.temperature, point.humidity);
    counts[risk as keyof typeof counts]++;
  });
  
  return counts;
};

/**
 * Generate comments based on risk assessment
 * @param risk Overall risk level
 * @param temp Average temperature
 * @param humidity Average humidity
 * @param dewPoint Dew point
 * @returns Comment string
 */
const generateComments = (risk: string, temp: number, humidity: number, dewPoint: number) => {
  if (risk === 'Alarm') {
    if (humidity > 70) {
      return 'High humidity detected. Ventilation recommended.';
    }
    return 'High risk conditions detected. Monitor closely.';
  }
  
  if (risk === 'Caution') {
    if (temp < 16) {
      return 'Low temperature increasing condensation risk.';
    }
    return 'Monitor humidity and temperature levels.';
  }
  
  return 'Conditions within acceptable parameters.';
};
