
import { LoadingState } from "@/components/Dashboard/TempHumidity/LoadingState";
import { ErrorState } from "@/components/Dashboard/TempHumidity/ErrorState";
import { DashboardContent } from "@/components/Dashboard/TempHumidity/DashboardContent";
import { SensorSourceInfo } from "@/components/Dashboard/TempHumidity/SensorSourceInfo";
import { DashboardStatsSection } from "@/components/Dashboard/TempHumidity/DashboardStatsSection";
import { TempHumidityResponse } from "@/services/interfaces/temp-humidity";
import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface DashboardMainContentProps {
  data: TempHumidityResponse | undefined;
  isLoading: boolean;
  error: Error | null;
  loadingStage: 'initial' | 'daily' | 'stats' | 'monthly' | 'complete';
  isUsingMockData: boolean;
  contextName: string;
  apiConnectionFailed?: boolean;
  onRetry?: () => void;
}

export function DashboardMainContent({ 
  data, 
  isLoading, 
  error, 
  loadingStage, 
  isUsingMockData,
  contextName,
  apiConnectionFailed = false,
  onRetry
}: DashboardMainContentProps) {
  if (isLoading || loadingStage === 'initial') {
    return <LoadingState />;
  }
  
  if (error || apiConnectionFailed) {
    return <ErrorState onRetry={onRetry} />;
  }
  
  if (!data || data.daily.length === 0) {
    return (
      <div className="p-8 border rounded-lg bg-amber-50 border-amber-200 text-center">
        <div className="flex flex-col items-center gap-2">
          <AlertTriangle className="h-8 w-8 text-amber-600" />
          <h3 className="text-lg font-medium text-amber-800">No Temperature Data Available</h3>
          <p className="text-amber-700 max-w-md">
            No temperature data could be retrieved from the API for this {contextName}.
          </p>
          <p className="text-sm text-amber-600 mt-2">
            Try selecting a different site or zone that has temperature sensors.
          </p>
          
          {onRetry && (
            <Button
              variant="outline"
              className="mt-4 bg-white text-amber-600 border-amber-200 hover:bg-amber-50"
              onClick={onRetry}
            >
              Retry Data Fetch
            </Button>
          )}
        </div>
      </div>
    );
  }

  // Count real data points
  const realDataPoints = data.daily.filter(point => point.isReal?.temperature === true).length;
  const totalDataPoints = data.daily.length;
  const hasRealData = realDataPoints > 0;

  return (
    <>
      {/* Stats section - pass down the loading stages */}
      <DashboardStatsSection 
        stats={data.stats} 
        isLoading={isLoading} 
        loadingStage={loadingStage}
      />

      <DashboardContent 
        data={data} 
        contextName={contextName} 
        isMockData={isUsingMockData}
        operatingHours={data.operatingHours}
        isLoadingMonthly={loadingStage === 'stats' || loadingStage === 'monthly'}
        isLoadingDaily={loadingStage === 'daily'}
      />

      {loadingStage === 'complete' && (
        <div className="mt-8 mb-8">
          <SensorSourceInfo 
            sourceData={data.sourceData} 
            isLoading={false}
            isMockData={isUsingMockData}
            operatingHours={data.operatingHours}
          />
        </div>
      )}
      
      {/* Info badge about data quality */}
      {hasRealData && (
        <div className="mb-8 p-3 border border-green-200 bg-green-50 rounded-lg">
          <p className="text-sm text-green-700">
            <span className="font-medium">Real-time data:</span> {realDataPoints} of {totalDataPoints} data points ({Math.round(realDataPoints/totalDataPoints*100)}%) 
            are from real temperature sensor readings for {contextName}.
          </p>
        </div>
      )}
      
      {!hasRealData && !isUsingMockData && (
        <div className="mb-8 p-3 border border-amber-200 bg-amber-50 rounded-lg">
          <p className="text-sm text-amber-700">
            <span className="font-medium">Historical data only:</span> No real-time temperature readings available for {contextName}.
            Showing historical API data instead.
          </p>
        </div>
      )}
      
      {isUsingMockData && (
        <div className="mb-8 p-3 border border-blue-200 bg-blue-50 rounded-lg">
          <p className="text-sm text-blue-700">
            <span className="font-medium">Simulated data:</span> No temperature sensors found for {contextName}.
            All data shown is simulated.
          </p>
        </div>
      )}
    </>
  );
}
