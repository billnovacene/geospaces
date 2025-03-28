
// Generate mock data for the stacked risk column chart
export const generateStackedRiskData = (timeRange: string) => {
  // Base data for the week
  if (timeRange === "week") {
    const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    return days.map((day, i) => {
      // Different distribution patterns for each day
      let good = 0, caution = 0, alarm = 0;
      
      if (i < 2) {
        // First days mostly good
        good = 80 + Math.floor(Math.random() * 15);
        caution = 100 - good - Math.floor(Math.random() * 5);
        alarm = 100 - good - caution;
      } else if (i >= 2 && i < 5) {
        // Middle days mix of caution and good
        caution = 40 + Math.floor(Math.random() * 20);
        good = 100 - caution - Math.floor(Math.random() * 10);
        alarm = 100 - good - caution;
      } else {
        // Weekend days with more alarm conditions
        alarm = 30 + Math.floor(Math.random() * 20);
        caution = 40 + Math.floor(Math.random() * 10);
        good = 100 - alarm - caution;
      }
      
      return {
        day,
        Good: good,
        Caution: caution,
        Alarm: alarm,
        total: good + caution + alarm
      };
    });
  }
  
  // Generate 30 days of data for month view
  if (timeRange === "month") {
    return Array.from({ length: 30 }, (_, i) => {
      const day = `Day ${i + 1}`;
      
      // Different distribution patterns based on the part of the month
      let good = 0, caution = 0, alarm = 0;
      
      if (i < 10) {
        // Early month mostly good
        good = 70 + Math.floor(Math.random() * 20);
        caution = 100 - good - Math.floor(Math.random() * 5);
        alarm = 100 - good - caution;
      } else if (i >= 10 && i < 20) {
        // Mid month more caution
        caution = 50 + Math.floor(Math.random() * 20);
        good = 100 - caution - Math.floor(Math.random() * 15);
        alarm = 100 - good - caution;
      } else {
        // Late month mix of all conditions
        alarm = 20 + Math.floor(Math.random() * 20);
        caution = 30 + Math.floor(Math.random() * 20);
        good = 100 - alarm - caution;
      }
      
      return {
        day,
        Good: good,
        Caution: caution,
        Alarm: alarm,
        total: good + caution + alarm
      };
    });
  }
  
  // Default day view - 24 hours
  return Array.from({ length: 24 }, (_, i) => {
    const hour = `${i}:00`;
    
    // Different distribution patterns based on the time of day
    let good = 0, caution = 0, alarm = 0;
    
    if (i >= 9 && i <= 17) {
      // Business hours - better conditions
      good = 70 + Math.floor(Math.random() * 20);
      caution = 100 - good - Math.floor(Math.random() * 5);
      alarm = 100 - good - caution;
    } else if (i >= 6 && i < 9 || i > 17 && i <= 21) {
      // Morning and evening - mixed conditions
      caution = 40 + Math.floor(Math.random() * 30);
      good = 100 - caution - Math.floor(Math.random() * 10);
      alarm = 100 - good - caution;
    } else {
      // Night hours - more risk
      alarm = 30 + Math.floor(Math.random() * 20);
      caution = 40 + Math.floor(Math.random() * 20);
      good = 100 - alarm - caution;
    }
    
    return {
      day: hour,
      Good: good,
      Caution: caution,
      Alarm: alarm,
      total: good + caution + alarm
    };
  });
};
