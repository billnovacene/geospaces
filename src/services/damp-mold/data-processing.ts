
import { assessMoldRisk } from "./risk-assessment";

/**
 * Processes daily data into monthly risk assessment data
 * @param dailyData Daily temperature and humidity readings
 * @returns Processed monthly risk data
 */
export const generateMonthlyRiskDataFromDailyData = (dailyData: any[]): any[] => {
  if (!dailyData || dailyData.length === 0) return [];
  
  // Group data by zone and month
  const monthlyGroupedData = dailyData.reduce((groups, item) => {
    const date = new Date(item.timestamp || item.time);
    const monthKey = `${date.getFullYear()}-${date.getMonth() + 1}`;
    const zoneKey = item.zoneId || 'undefined';
    const siteKey = item.siteId || 'undefined';
    
    const groupKey = `${monthKey}-${siteKey}-${zoneKey}`;
    if (!groups[groupKey]) {
      groups[groupKey] = {
        monthKey,
        siteKey,
        zoneKey,
        siteName: item.siteName,
        zoneName: item.zoneName,
        items: []
      };
    }
    
    groups[groupKey].items.push(item);
    return groups;
  }, {});

  // Process monthly grouped data
  const monthlyRiskData = Object.values(monthlyGroupedData).map((group: any) => {
    const { monthKey, siteKey, zoneKey, siteName, zoneName, items } = group;
    
    // Extract temperature and humidity data
    const temps = items.map((item: any) => item.temperature).filter(Boolean);
    const humidities = items.map((item: any) => item.humidity).filter(Boolean);
    
    // Calculate averages
    const avgTemp = temps.length > 0 
      ? temps.reduce((sum: number, val: number) => sum + val, 0) / temps.length 
      : 0;
    const avgHumidity = humidities.length > 0 
      ? humidities.reduce((sum: number, val: number) => sum + val, 0) / humidities.length 
      : 0;
    
    // Calculate dew point: simplified formula
    const dewPoint = avgTemp - ((100 - avgHumidity) / 5);
    
    // Count readings with high risk conditions using our standardized assessment
    const highRiskReadings = items.filter((item: any) => 
      assessMoldRisk(item.temperature, item.humidity) === 'Alarm'
    );
    
    const cautionRiskReadings = items.filter((item: any) => 
      assessMoldRisk(item.temperature, item.humidity) === 'Caution'
    );
    
    // Calculate actual hours at risk
    const timeIntervalHours = 4; // Assuming each reading represents 4 hours of data
    const hoursAtRisk = highRiskReadings.length * timeIntervalHours;
    const hoursAtCaution = cautionRiskReadings.length * timeIntervalHours;
    
    // Determine overall risk level using the standardized assessment function
    // For the monthly view, we use the average values
    const overallRisk = assessMoldRisk(avgTemp, avgHumidity);
    
    // Use actual site and zone names from the data
    let buildingName = siteName || `Building ${siteKey}`;
    let actualZoneName = zoneName || `Zone ${zoneKey}`;
    
    if (siteKey === 'undefined') buildingName = 'Unknown Building';
    if (zoneKey === 'undefined') actualZoneName = 'Unknown Zone';
    
    // Generate appropriate comment based on risk level
    let comment = '';
    switch (overallRisk) {
      case 'Alarm':
        comment = 'Needs immediate attention';
        break;
      case 'Caution':
        comment = 'Monitor closely';
        break;
      default:
        comment = 'Normal operation';
    }
    
    return {
      id: `${monthKey}-${siteKey}-${zoneKey}`,
      building: buildingName,
      zone: actualZoneName,
      temp: avgTemp.toFixed(1),
      rh: avgHumidity.toFixed(1),
      dewPoint: dewPoint.toFixed(1),
      overallRisk,
      alarmCount: highRiskReadings.length,
      timeAtRisk: `${hoursAtRisk}`,
      comments: comment,
      siteId: siteKey,
      zoneId: zoneKey
    };
  });

  return monthlyRiskData;
};
