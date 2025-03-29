
import React from "react";
import { LogPanel } from "../TempHumidity/LogPanel";
import { LogItem } from "@/hooks/temperature/types";
import { useDampMold } from "./context/DampMoldContext";

export function DevelopmentLogPanel() {
  // Only render in development environment
  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  // Access data from context
  const { data, isLoading, error, activeTheme, activeFilter } = useDampMold();
  const dataPoints = data.daily.length;
  
  // Construct logs array
  const logs: LogItem[] = [
    { 
      message: `Fetched ${dataPoints} damp mold data points`, 
      type: 'info' as const, 
      timestamp: new Date().toISOString() 
    }
  ];
  
  // Add loading log if needed
  if (isLoading) {
    logs.push({ 
      message: 'Data is loading', 
      type: 'info' as const, 
      timestamp: new Date().toISOString() 
    });
  }
  
  // Add error log if needed
  if (error) {
    logs.push({ 
      message: `Error fetching data: ${error.message}`, 
      type: 'error' as const, 
      timestamp: new Date().toISOString() 
    });
  }
  
  // Add various informational logs
  logs.push({ 
    message: 'Using simulated data only', 
    type: 'info' as const, 
    timestamp: new Date().toISOString() 
  });
  
  if (activeFilter) {
    logs.push({ 
      message: `Filtering data by: ${activeFilter}`, 
      type: 'info' as const, 
      timestamp: new Date().toISOString() 
    });
  }
  
  logs.push({ 
    message: `Theme mode: ${activeTheme}`, 
    type: 'info' as const, 
    timestamp: new Date().toISOString() 
  });
  
  logs.push({ 
    message: `Dark mode from DOM: ${document.documentElement.classList.contains('dark')}`, 
    type: 'info' as const, 
    timestamp: new Date().toISOString() 
  });
  
  return (
    <div className="mt-8">
      <LogPanel 
        logs={logs} 
        onClearLogs={() => {}} 
        title="Damp & Mold Monitoring Logs" 
      />
    </div>
  );
}
