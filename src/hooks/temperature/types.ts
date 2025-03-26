
export interface LogItem {
  message: string;
  timestamp: string;
  type: 'info' | 'error' | 'warning' | 'success' | 'api';
}

export interface TempHumidityHookProps {
  forceSiteId?: string;
  forceZoneId?: string;
}

export interface TempHumidityHookResult {
  data: any;
  isLoading: boolean;
  error: Error | null;
  isUsingMockData: boolean;
  loadingStage: 'initial' | 'daily' | 'stats' | 'monthly' | 'complete';
  refetch: () => void;
  apiConnectionFailed: boolean;
  logs: LogItem[];
  clearLogs: () => void;
}
