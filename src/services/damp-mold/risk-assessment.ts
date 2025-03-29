
/**
 * Risk assessment functions for damp and mold conditions
 */

/**
 * Standardized risk assessment function used across the application
 * @param temperature Temperature in Celsius
 * @param humidity Relative humidity percentage
 * @returns {string} Risk level: 'Good', 'Caution', or 'Alarm'
 */
export const assessMoldRisk = (temperature: number, humidity: number): string => {
  // Primary factor is humidity
  if (humidity >= 70) {
    return 'Alarm'; // High risk
  } else if (humidity >= 60) {
    // Additional risk if temperature is below 16°C (risk of condensation)
    return temperature < 16 ? 'Alarm' : 'Caution';
  } else {
    // Low humidity is generally good, but still watch for very cold temps
    return temperature < 12 ? 'Caution' : 'Good';
  }
};

/**
 * Calculates a numeric risk score based on temperature and humidity
 * @param temperature Temperature in Celsius
 * @param humidity Relative humidity percentage
 * @returns {number} Risk score (0-3)
 */
export const calculateMoldRiskScore = (temperature: number, humidity: number): number => {
  let score = 0;
  
  // Apply humidity thresholds for risk scoring
  if (humidity < 60) {
    score = 0; // Low risk
  } else if (humidity < 70) {
    score = 1; // Caution
  } else {
    score = 2; // High risk
  }
  
  // Additional risk if temperature is below 16°C (risk of condensation)
  if (temperature < 16) {
    score += 1;
  }
  
  return score;
};
