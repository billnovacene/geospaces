
import React from "react";
import { LogPanel } from "../TempHumidity/LogPanel";
import { LogItem } from "@/hooks/temperature/types";
import { useDampMold } from "./context/DampMoldContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { DatabaseIcon } from "lucide-react";
import { generateAndInsertDampMoldData } from "@/services/damp-mold-data-generator";

export function DevelopmentLogPanel() {
  // Only render in development environment
  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  // Access data from context
  const { data, isLoading, error, activeTheme, activeFilter, contextInfo } = useDampMold();
  const dataPoints = data?.daily?.length || 0;
  
  // Construct logs array
  const logs: LogItem[] = [];
  
  // Add query information
  logs.push({ 
    message: `Context type: ${contextInfo.contextType}, Context ID: ${contextInfo.contextId || 'none'}`, 
    type: 'info' as const, 
    timestamp: new Date().toISOString() 
  });
  
  if (contextInfo.siteId) {
    logs.push({ 
      message: `Site ID: ${contextInfo.siteId}`, 
      type: 'info' as const, 
      timestamp: new Date().toISOString() 
    });
  }
  
  if (contextInfo.zoneId) {
    logs.push({ 
      message: `Zone ID: ${contextInfo.zoneId}`, 
      type: 'info' as const, 
      timestamp: new Date().toISOString() 
    });
  }
  
  // Add data info
  logs.push({ 
    message: `Fetched ${dataPoints} damp mold data points`, 
    type: 'info' as const, 
    timestamp: new Date().toISOString() 
  });
  
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
  
  if (dataPoints === 0) {
    logs.push({ 
      message: 'No data available - try generating test data', 
      type: 'error' as const, 
      timestamp: new Date().toISOString() 
    });
  }
  
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

  // Handle data generation
  const handleGenerateData = async () => {
    try {
      logs.push({ 
        message: 'Generating test data...', 
        type: 'info' as const, 
        timestamp: new Date().toISOString() 
      });
      
      await generateAndInsertDampMoldData(contextInfo.zoneId, contextInfo.siteId);
      
      toast.success("Test data generated successfully", {
        description: "The page will now refresh with the new data."
      });
      
      logs.push({ 
        message: 'Test data generated successfully', 
        type: 'success' as const, 
        timestamp: new Date().toISOString() 
      });
      
      // Refresh the page to show new data
      window.location.reload();
    } catch (err) {
      console.error("Failed to generate test data:", err);
      
      logs.push({ 
        message: `Failed to generate test data: ${err instanceof Error ? err.message : 'Unknown error'}`, 
        type: 'error' as const, 
        timestamp: new Date().toISOString() 
      });
      
      toast.error("Failed to generate test data", {
        description: err instanceof Error ? err.message : "Unknown error"
      });
    }
  };
  
  return (
    <div className="mt-8">
      <LogPanel 
        logs={logs} 
        onClearLogs={() => {}} 
        title="Damp & Mold Monitoring Logs" 
        actionButton={
          <Button 
            size="sm" 
            variant="outline" 
            onClick={handleGenerateData}
            className="ml-auto"
          >
            <DatabaseIcon className="h-4 w-4 mr-2" />
            Generate Test Data
          </Button>
        }
      />
    </div>
  );
}
