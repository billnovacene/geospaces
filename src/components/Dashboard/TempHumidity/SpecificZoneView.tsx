
import React, { useEffect } from "react";
import { useTempHumidityData } from "@/hooks/useTempHumidityData";
import { DashboardContent } from "@/components/Dashboard/TempHumidity/DashboardContent";
import { DashboardStatsSection } from "@/components/Dashboard/TempHumidity/DashboardStatsSection";
import { SensorSourceInfo } from "@/components/Dashboard/TempHumidity/SensorSourceInfo";
import { Card, CardContent } from "@/components/ui/card";
import { LogPanel } from "@/components/Dashboard/TempHumidity/LogPanel";
import { LoadingState } from "@/components/Dashboard/TempHumidity/LoadingState";
import { ErrorState } from "@/components/Dashboard/TempHumidity/ErrorState";
import { Button } from "@/components/ui/button";
import { RefreshCw, AlertTriangle } from "lucide-react";
import { StatsData } from "@/services/interfaces/temp-humidity";

interface SpecificZoneViewProps {
  siteId: string;
  zoneId: string;
  contextName?: string;
}

export function SpecificZoneView({ 
  siteId, 
  zoneId,
  contextName = "Specific Zone" 
}: SpecificZoneViewProps) {
  const { 
    data, 
    isLoading, 
    error, 
    loadingStage, 
    isUsingMockData, 
    refetch,
    apiConnectionFailed,
    logs,
    clearLogs
  } = useTempHumidityData({ forceSiteId: siteId, forceZoneId: zoneId });
  
  useEffect(() => {
    // Force an initial fetch when component mounts
    refetch();
  }, [refetch]);
  
  if (isLoading || loadingStage === 'initial') {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-medium">Temperature Data for Zone {zoneId} (Site {siteId})</h2>
          <Button variant="outline" size="sm" disabled>
            <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
            Loading...
          </Button>
        </div>
        <LoadingState />
      </div>
    );
  }
  
  if (error || apiConnectionFailed) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-medium">Temperature Data for Zone {zoneId} (Site {siteId})</h2>
          <Button variant="outline" size="sm" onClick={() => refetch()}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Retry
          </Button>
        </div>
        <ErrorState onRetry={() => refetch()} />
        <LogPanel 
          logs={logs}
          title={`API Error Logs - Zone ${zoneId}`}
          onClearLogs={clearLogs}
        />
      </div>
    );
  }
  
  if (!data || data.daily.length === 0) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-medium">Temperature Data for Zone {zoneId} (Site {siteId})</h2>
          <Button variant="outline" size="sm" onClick={() => refetch()}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
        <div className="p-8 border rounded-lg bg-amber-50 border-amber-200 text-center">
          <div className="flex flex-col items-center gap-2">
            <AlertTriangle className="h-8 w-8 text-amber-600" />
            <h3 className="text-lg font-medium text-amber-800">No Temperature Data Available</h3>
            <p className="text-amber-700 max-w-md">
              No temperature data could be retrieved from the API for Zone {zoneId}.
            </p>
            <p className="text-sm text-amber-600 mt-2">
              This zone may not have any temperature sensors configured.
            </p>
            
            <Button
              variant="outline"
              className="mt-4 bg-white text-amber-600 border-amber-200 hover:bg-amber-50"
              onClick={() => refetch()}
            >
              Retry Data Fetch
            </Button>
          </div>
        </div>
        <LogPanel 
          logs={logs}
          title={`API Logs - Zone ${zoneId}`}
          onClearLogs={clearLogs}
        />
      </div>
    );
  }

  // Ensure we have default stats if none provided
  const defaultStats: StatsData = {
    avgTemp: 21,
    minTemp: 18,
    maxTemp: 24,
    avgHumidity: 55,
    activeSensors: 0,
    status: {
      avgTemp: 'good',
      minTemp: 'good',
      maxTemp: 'good',
      avgHumidity: 'good'
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-medium">Temperature Data for Zone {zoneId} (Site {siteId})</h2>
        <Button variant="outline" size="sm" onClick={() => refetch()}>
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </div>
      
      <Card className="border-0 shadow-sm">
        <CardContent className="p-6">
          <DashboardStatsSection 
            stats={data.stats || defaultStats} 
            isLoading={isLoading} 
            loadingStage={loadingStage}
          />
        </CardContent>
      </Card>
      
      <DashboardContent 
        data={data} 
        contextName={contextName} 
        isMockData={isUsingMockData}
        operatingHours={data.operatingHours}
        isLoadingMonthly={loadingStage === 'stats' || loadingStage === 'monthly'}
        isLoadingDaily={loadingStage === 'daily'}
      />
      
      <div className="mt-8 mb-8">
        <SensorSourceInfo 
          sourceData={data.sourceData} 
          isLoading={false}
          isMockData={isUsingMockData}
          operatingHours={data.operatingHours}
        />
      </div>
      
      <LogPanel 
        logs={logs}
        title={`Temperature API Logs - Zone ${zoneId}`}
        onClearLogs={clearLogs}
      />
    </div>
  );
}
