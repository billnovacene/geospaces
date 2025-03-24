
export interface MonthlyOverviewPoint {
  date: string;
  avgTemp: number;
  minTemp: number;
  maxTemp: number;
  avgHumidity: number;
}

export interface DailyOverviewPoint {
  time: string;
  temperature: number;
  humidity: number;
}

export interface StatsData {
  avgTemp: number;
  minTemp: number;
  maxTemp: number;
  avgHumidity: number;
  lastSeen?: string;
  status: {
    avgTemp: 'good' | 'caution' | 'warning';
    minTemp: 'good' | 'caution' | 'warning';
    maxTemp: 'good' | 'caution' | 'warning';
    avgHumidity: 'good' | 'caution' | 'warning';
  };
}

export interface TempHumidityResponse {
  stats: StatsData;
  daily: DailyOverviewPoint[];
  monthly: MonthlyOverviewPoint[];
}

export interface PointsDataResponse {
  data: Array<{
    timestamp: string;
    pointData: Array<{
      timestamp: string;
      value: number | string;
    }>;
  }>;
  shouldSum: boolean;
  name: string;
}
