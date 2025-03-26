
// Generate mock dew point analysis data based on the selected time range
export const generateDewPointData = (selectedRange: string) => {
  // Generate 24 hours of data for a day view
  if (selectedRange === "day") {
    return Array.from({ length: 24 }, (_, i) => {
      const hour = i;
      const surfaceTemp = 18 + Math.sin(i / 6) * 5;
      const dewPoint = surfaceTemp - (5 + Math.sin(i / 8) * 3);
      const riskFactor = Math.max(0, 10 - (surfaceTemp - dewPoint));
      
      return {
        hour: `${hour}:00`,
        surfaceTemperature: parseFloat(surfaceTemp.toFixed(1)),
        dewPoint: parseFloat(dewPoint.toFixed(1)),
        dewPointDelta: parseFloat((surfaceTemp - dewPoint).toFixed(1)),
        riskFactor: parseFloat(riskFactor.toFixed(1))
      };
    });
  }
  
  // Generate 7 days of data for week view
  if (selectedRange === "week") {
    const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    return days.map((day, i) => {
      const surfaceTemp = 19 + Math.sin(i / 3) * 3;
      const dewPoint = surfaceTemp - (6 + Math.cos(i / 2) * 2);
      const riskFactor = Math.max(0, 10 - (surfaceTemp - dewPoint));
      
      return {
        day,
        surfaceTemperature: parseFloat(surfaceTemp.toFixed(1)),
        dewPoint: parseFloat(dewPoint.toFixed(1)),
        dewPointDelta: parseFloat((surfaceTemp - dewPoint).toFixed(1)),
        riskFactor: parseFloat(riskFactor.toFixed(1))
      };
    });
  }
  
  // Generate 30 days of data for month view
  return Array.from({ length: 30 }, (_, i) => {
    const day = i + 1;
    const surfaceTemp = 18 + Math.sin(i / 7) * 4;
    const dewPoint = surfaceTemp - (5.5 + Math.sin(i / 10) * 3.5);
    const riskFactor = Math.max(0, 10 - (surfaceTemp - dewPoint));
    
    return {
      day: `Day ${day}`,
      surfaceTemperature: parseFloat(surfaceTemp.toFixed(1)),
      dewPoint: parseFloat(dewPoint.toFixed(1)),
      dewPointDelta: parseFloat((surfaceTemp - dewPoint).toFixed(1)),
      riskFactor: parseFloat(riskFactor.toFixed(1))
    };
  });
};
