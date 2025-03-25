
import { DailyOverviewPoint } from "../interfaces/temp-humidity";

// Function to filter data points by operating hours
export function filterDataByOperatingHours(
  data: Array<{timestamp: string, value: number | string}>,
  operatingHours: { startTime: string; endTime: string }
): Array<{timestamp: string, value: number | string}> {
  if (!operatingHours || !operatingHours.startTime || !operatingHours.endTime) {
    return data;
  }
  
  // Parse the operating hours to get hours and minutes
  const startParts = operatingHours.startTime.split(':');
  const endParts = operatingHours.endTime.split(':');
  
  if (startParts.length < 2 || endParts.length < 2) {
    console.warn('Invalid operating hours format:', operatingHours);
    return data;
  }
  
  const startHour = parseInt(startParts[0], 10);
  const startMinute = parseInt(startParts[1], 10);
  const endHour = parseInt(endParts[0], 10);
  const endMinute = parseInt(endParts[1], 10);
  
  return data.filter(point => {
    try {
      const datetime = new Date(point.timestamp);
      const hour = datetime.getHours();
      const minute = datetime.getMinutes();
      
      // Convert to minutes since midnight for easier comparison
      const timeInMinutes = hour * 60 + minute;
      const startInMinutes = startHour * 60 + startMinute;
      const endInMinutes = endHour * 60 + endMinute;
      
      // Check if the time is within operating hours
      return timeInMinutes >= startInMinutes && timeInMinutes <= endInMinutes;
    } catch (e) {
      console.warn('Error filtering data point by operating hours:', e, point);
      return false;
    }
  });
}

// Helper function to fill in missing data points using linear interpolation
export function fillMissingDataPoints(data: DailyOverviewPoint[]): DailyOverviewPoint[] {
  // Create a copy of the data
  const result = [...data];
  
  // Fill in missing temperature values
  fillMissingValues(result, 'temperature');
  
  // Fill in missing humidity values
  fillMissingValues(result, 'humidity');
  
  return result;
}

function fillMissingValues(data: DailyOverviewPoint[], property: 'temperature' | 'humidity'): void {
  // Find the first and last valid points
  let firstValidIndex = -1;
  let lastValidIndex = -1;
  
  for (let i = 0; i < data.length; i++) {
    if (data[i][property] !== null) {
      if (firstValidIndex === -1) firstValidIndex = i;
      lastValidIndex = i;
    }
  }
  
  // If no valid points, return
  if (firstValidIndex === -1) return;
  
  // Fill in missing values between first and last valid points using linear interpolation
  for (let i = firstValidIndex; i <= lastValidIndex; i++) {
    if (data[i][property] === null) {
      // Find the next valid point
      let nextValidIndex = -1;
      for (let j = i + 1; j <= lastValidIndex; j++) {
        if (data[j][property] !== null) {
          nextValidIndex = j;
          break;
        }
      }
      
      // If no next valid point, should not happen due to lastValidIndex check
      if (nextValidIndex === -1) continue;
      
      // Find the previous valid point (we know there is one because i >= firstValidIndex)
      let prevValidIndex = -1;
      for (let j = i - 1; j >= firstValidIndex; j--) {
        if (data[j][property] !== null) {
          prevValidIndex = j;
          break;
        }
      }
      
      // Linear interpolation
      const prevValue = data[prevValidIndex][property] as number;
      const nextValue = data[nextValidIndex][property] as number;
      const totalSteps = nextValidIndex - prevValidIndex;
      const currentStep = i - prevValidIndex;
      
      data[i][property] = prevValue + (nextValue - prevValue) * (currentStep / totalSteps);
      // Mark as not real
      data[i].isReal[property] = false;
    }
  }
}
