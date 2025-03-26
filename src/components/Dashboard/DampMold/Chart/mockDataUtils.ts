
// Generate mock data if real data is not available
export const generateMockData = (selectedRange: string) => {
  // Generate 24 hours of data for a day view
  if (selectedRange === "day") {
    return Array.from({ length: 24 }, (_, i) => {
      const hour = i;
      // Create more realistic patterns
      const baseHumidity = 55 + Math.sin(i / 3) * 15;
      const baseTemp = 18 + Math.sin(i / 6) * 5;
      const randomFactor = Math.random() * 5;
      
      return {
        hour: `${hour}:00`,
        humidity: Math.round(baseHumidity + randomFactor),
        temperature: parseFloat((baseTemp + randomFactor / 2).toFixed(1)),
        dewPoint: parseFloat((baseTemp - 5 + Math.sin(i / 4) * 2).toFixed(1)),
        riskZone: hour >= 1 && hour <= 6 ? 1 : 0 // Risk zone during night hours
      };
    });
  }
  
  // Generate 7 days of data for week view
  if (selectedRange === "week") {
    const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    return days.map((day, i) => {
      return {
        day,
        humidity: Math.round(60 + Math.sin(i / 2) * 15),
        temperature: parseFloat((19 + Math.sin(i / 3) * 3).toFixed(1)),
        dewPoint: parseFloat((14 + Math.sin(i / 2) * 2).toFixed(1)),
        riskZone: i >= 3 && i <= 5 ? 1 : 0 // Risk zone on weekend
      };
    });
  }
  
  // Generate 30 days of data for month view
  return Array.from({ length: 30 }, (_, i) => {
    return {
      day: `Day ${i + 1}`,
      humidity: Math.round(55 + Math.sin(i / 5) * 20),
      temperature: parseFloat((18 + Math.sin(i / 7) * 4).toFixed(1)),
      dewPoint: parseFloat((13 + Math.sin(i / 6) * 3).toFixed(1)),
      riskZone: i >= 10 && i <= 15 ? 1 : 0 // Risk zone in middle of month
    };
  });
};

// Configure x-axis based on selected time range
export const getXAxisKey = (selectedRange: string) => {
  if (selectedRange === "day") return "hour";
  return "day";
};
