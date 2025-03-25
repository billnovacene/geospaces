
/**
 * Re-export all sensor threshold related functionality from the modular files
 */

// Re-export types and configurations
export type { SensorTypeConfig } from './sensorConfigs';
export { sensorTypes } from './sensorConfigs';

// Re-export utility functions
export { getSensorValueColor } from './sensorColors';
export { getSensorValueStatus } from './sensorStatus';
