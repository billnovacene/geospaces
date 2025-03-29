
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
  dewPoint?: number;
  isReal?: {
    temperature: boolean;
    humidity: boolean;
  };
  siteId?: number | string;
  zoneId?: number | string;
  siteName?: string;
  zoneName?: string;
}

export interface StatsData {
  avgTemp: number;
  minTemp: number;
  maxTemp: number;
  avgHumidity: number;
  lastSeen?: string;
  activeSensors: number; // Add this property
  status: {
    avgTemp: 'good' | 'caution' | 'warning';
    minTemp: 'good' | 'caution' | 'warning';
    maxTemp: 'good' | 'caution' | 'warning';
    avgHumidity: 'good' | 'caution' | 'warning';
  };
}

export interface SensorInfo {
  id: string;
  name: string;
  deviceName: string;
  deviceId: string;
  lastUpdated: string;
}

export interface SensorSourceData {
  temperatureSensors: SensorInfo[];
  humiditySensors: SensorInfo[];
}

export interface TempHumidityResponse {
  stats?: StatsData;
  daily: DailyOverviewPoint[];
  monthly: MonthlyOverviewPoint[];
  sourceData?: SensorSourceData;
  operatingHours?: {
    startTime: string;
    endTime: string;
  };
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
