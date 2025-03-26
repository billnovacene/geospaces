
import { useState, useCallback } from 'react';
import { LogItem } from './types';

export function useTemperatureLogs() {
  const [logs, setLogs] = useState<LogItem[]>([]);
  
  // Function to add logs
  const addLog = useCallback((message: string, type: LogItem['type'] = 'info') => {
    const timestamp = new Date().toISOString().split('T')[1].substring(0, 12);
    setLogs(prevLogs => [...prevLogs, { message, timestamp, type }]);
  }, []);
  
  // Clear logs
  const clearLogs = useCallback(() => {
    setLogs([]);
  }, []);

  return {
    logs,
    addLog,
    clearLogs
  };
}
