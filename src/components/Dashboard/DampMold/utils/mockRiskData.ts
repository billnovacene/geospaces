
// Sample data for monthly risk overview
export const generateMonthlyRiskData = () => {
  return [
    { id: 'hh1', zone: 'Classroom 1', building: 'Happy Hounds', temp: '19.2', rh: '81', dewPoint: '13.5', risk: 'High', timeInHighRh: '10h', comments: 'Poor ventilation' },
    { id: 'ba1', zone: 'Staff Room', building: 'Building A', temp: '20.1', rh: '68', dewPoint: '13.9', risk: 'Medium', timeInHighRh: '3h', comments: 'Blocked fan' },
    { id: 'bb1', zone: 'Library', building: 'Building B', temp: '18.4', rh: '60', dewPoint: '10.4', risk: 'Low', timeInHighRh: '0h', comments: 'No issues' },
    { id: 'c1', zone: 'Office 2', building: 'C', temp: '21', rh: '85', dewPoint: '18', risk: 'High', timeInHighRh: '12h past day', comments: 'Leaky window detected' },
    { id: 'c2', zone: 'Storage Room', building: 'C', temp: '17.5', rh: '72', dewPoint: '12.4', risk: 'Medium', timeInHighRh: '6h past 24h', comments: 'Check for insulation gaps' },
  ];
};
