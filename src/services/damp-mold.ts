
export const generateMonthlyRiskDataFromDailyData = (dailyData: any[]): any[] => {
  if (!dailyData || dailyData.length === 0) return [];
  
  // Group data by zone and month
  const monthlyGroupedData = dailyData.reduce((groups, item) => {
    const date = new Date(item.timestamp);
    const monthKey = `${date.getFullYear()}-${date.getMonth() + 1}`;
    const zoneKey = item.zone_id || 'undefined';
    
    if (!groups[monthKey]) groups[monthKey] = {};
    if (!groups[monthKey][zoneKey]) groups[monthKey][zoneKey] = [];
    
    groups[monthKey][zoneKey].push(item);
    return groups;
  }, {});

  // Process monthly grouped data
  const monthlyRiskData = Object.entries(monthlyGroupedData).flatMap(([monthKey, zoneData]) => {
    return Object.entries(zoneData).map(([zoneId, zoneItems]) => {
      const temps = zoneItems.map(item => item.temperature).filter(Boolean);
      const humidities = zoneItems.map(item => item.humidity).filter(Boolean);
      
      const avgTemp = temps.length > 0 
        ? temps.reduce((sum, val) => sum + val, 0) / temps.length 
        : 0;
      const avgHumidity = humidities.length > 0 
        ? humidities.reduce((sum, val) => sum + val, 0) / humidities.length 
        : 0;
      
      // Calculate dew point: simplified formula
      const dewPoint = avgTemp - ((100 - avgHumidity) / 5);
      
      // Determine risk level
      let overallRisk = 'Good';
      const riskScore = 
        (avgHumidity > 70 ? 2 : avgHumidity > 60 ? 1 : 0) +
        (avgTemp < 16 ? 1 : 0);
      
      if (riskScore > 2) overallRisk = 'Alarm';
      else if (riskScore > 1) overallRisk = 'Caution';
      
      const alarmsCount = zoneItems.filter(item => 
        item.humidity > 70 || (item.humidity > 60 && item.temperature < 16)
      ).length;
      
      return {
        id: `${monthKey}-${zoneId}`,
        building: `Building ${Math.floor(Number(zoneId) / 3) + 1}`,
        zone: zoneId === 'undefined' ? 'Undefined Zone' : `Zone ${zoneId}`,
        temp: avgTemp.toFixed(1),
        rh: avgHumidity.toFixed(1),
        dewPoint: dewPoint.toFixed(1),
        overallRisk,
        alarmCount: alarmsCount,
        timeAtRisk: `${alarmsCount}`,
        comments: overallRisk === 'Alarm' ? 'Needs attention' : 
                  overallRisk === 'Caution' ? 'Monitor closely' : 'Normal operation'
      };
    });
  }).flat();

  return monthlyRiskData;
};
