
import { LoadingState } from "@/components/Dashboard/TempHumidity/LoadingState";
import { ErrorState } from "@/components/Dashboard/TempHumidity/ErrorState";
import { DashboardContent } from "@/components/Dashboard/TempHumidity/DashboardContent";
import { SensorSourceInfo } from "@/components/Dashboard/TempHumidity/SensorSourceInfo";
import { DashboardStatsSection } from "@/components/Dashboard/TempHumidity/DashboardStatsSection";
import { TempHumidityResponse, StatsData } from "@/services/interfaces/temp-humidity";
import { AlertTriangle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { generateMockData } from "@/services/sensors/mock-data-generator";

interface DashboardMainContentProps {
  data: TempHumidityResponse | undefined;
  isLoading: boolean;
  error: Error | null;
  loadingStage: 'initial' | 'daily' | 'stats' | 'monthly' | 'complete';
  isUsingMockData: boolean;
  contextName: string;
  apiConnectionFailed?: boolean;
  onRetry?: () => void;
  activeFilter?: string | null;
}

export function DashboardMainContent({ 
  data, 
  isLoading, 
  error, 
  loadingStage, 
  isUsingMockData,
  contextName,
  apiConnectionFailed = false,
  onRetry,
  activeFilter
}: DashboardMainContentProps) {
  // State to track progressive stats calculations
  const [progressiveStats, setProgressiveStats] = useState<Partial<StatsData> | null>(null);
  
  // Handle stats calculated from progressive loading
  const handleStatsCalculated = (newStats: Partial<StatsData>) => {
    setProgressiveStats(prev => ({
      ...prev,
      ...newStats
    }));
  };
  
  if (isLoading || loadingStage === 'initial') {
    return <LoadingState />;
  }
  
  if (error || apiConnectionFailed) {
    return <ErrorState onRetry={onRetry} />;
  }
  
  // Generate mock data if no data is available
  const simulatedData = generateMockData();
  // Ensure that simulated data always has stats
  if (!simulatedData.stats) {
    simulatedData.stats = {
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
  }
  
  const displayData = (!data || data.daily.length === 0) ? simulatedData : data;
  
  // If original data was empty, but we're now using simulated data
  if (!data || data.daily.length === 0) {
    return (
      <>
        <div className="p-8 rounded-lg info-panel info-panel-amber mb-8">
          <div className="flex flex-col items-center gap-2">
            <AlertTriangle className="h-8 w-8 text-amber-600 dark:text-amber-400" />
            <h3 className="text-lg font-medium dark:text-white">No Real Temperature Data Available</h3>
            <p className="max-w-md dark:text-gray-300">
              No temperature data could be retrieved from the API for this {contextName}.
              Showing simulated data below instead.
            </p>
            
            {onRetry && (
              <Button
                variant="outline"
                className="mt-4 bg-card text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-900/50 hover:bg-amber-50/50 dark:hover:bg-amber-950/30"
                onClick={onRetry}
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Retry Data Fetch
              </Button>
            )}
          </div>
        </div>
        
        {/* Display simulated data */}
        <DashboardStatsSection 
          stats={displayData.stats} 
          isLoading={false} 
          loadingStage="complete"
        />

        <DashboardContent 
          data={displayData} 
          contextName={contextName} 
          isMockData={true}
          operatingHours={displayData.operatingHours}
          isLoadingMonthly={false}
          isLoadingDaily={false}
          onStatsCalculated={handleStatsCalculated}
        />
        
        <div className="mb-8 info-panel info-panel-blue mt-8">
          <p className="text-sm dark:text-blue-400">
            <span className="font-medium">Simulated data:</span> No temperature sensors found for {contextName}.
            All data shown is simulated.
          </p>
        </div>
      </>
    );
  }

  // Count real data points
  const realDataPoints = displayData.daily.filter(point => point.isReal?.temperature === true).length;
  const totalDataPoints = displayData.daily.length;
  const hasRealData = realDataPoints > 0;
  
  // Merge progressively calculated stats with API stats
  const displayStats = progressiveStats 
    ? { ...(displayData.stats || {}), ...progressiveStats }
    : displayData.stats;

  return (
    <>
      {/* Stats section - pass down the loading stages */}
      <DashboardStatsSection 
        stats={displayStats} 
        isLoading={isLoading} 
        loadingStage={loadingStage}
      />

      <DashboardContent 
        data={displayData} 
        contextName={contextName} 
        isMockData={isUsingMockData}
        operatingHours={displayData.operatingHours}
        isLoadingMonthly={loadingStage === 'stats' || loadingStage === 'monthly'}
        isLoadingDaily={loadingStage === 'daily'}
        onStatsCalculated={handleStatsCalculated}
      />

      {loadingStage === 'complete' && (
        <div className="mt-8 mb-8">
          <SensorSourceInfo 
            sourceData={displayData.sourceData} 
            isLoading={false}
            isMockData={isUsingMockData}
            operatingHours={displayData.operatingHours}
          />
        </div>
      )}
      
      {/* Info badge about data quality */}
      {hasRealData && (
        <div className="mb-8 info-panel info-panel-green">
          <p className="text-sm dark:text-green-400">
            <span className="font-medium">Real-time data:</span> {realDataPoints} of {totalDataPoints} data points ({Math.round(realDataPoints/totalDataPoints*100)}%) 
            are from real temperature sensor readings for {contextName}.
          </p>
        </div>
      )}
      
      {!hasRealData && !isUsingMockData && (
        <div className="mb-8 info-panel info-panel-amber">
          <p className="text-sm dark:text-amber-400">
            <span className="font-medium">Historical data only:</span> No real-time temperature readings available for {contextName}.
            Showing historical API data instead.
          </p>
        </div>
      )}
      
      {isUsingMockData && (
        <div className="mb-8 info-panel info-panel-blue">
          <p className="text-sm dark:text-blue-400">
            <span className="font-medium">Simulated data:</span> No temperature sensors found for {contextName}.
            All data shown is simulated.
          </p>
        </div>
      )}
    </>
  );
}
