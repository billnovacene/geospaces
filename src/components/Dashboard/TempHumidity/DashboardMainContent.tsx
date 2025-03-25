
import { LoadingState } from "@/components/Dashboard/TempHumidity/LoadingState";
import { ErrorState } from "@/components/Dashboard/TempHumidity/ErrorState";
import { DashboardContent } from "@/components/Dashboard/TempHumidity/DashboardContent";
import { SensorSourceInfo } from "@/components/Dashboard/TempHumidity/SensorSourceInfo";
import { DashboardStatsSection } from "@/components/Dashboard/TempHumidity/DashboardStatsSection";
import { TempHumidityResponse } from "@/services/interfaces/temp-humidity";
import { AlertTriangle } from "lucide-react";

interface DashboardMainContentProps {
  data: TempHumidityResponse | undefined;
  isLoading: boolean;
  error: Error | null;
  loadingStage: 'initial' | 'daily' | 'stats' | 'monthly' | 'complete';
  isUsingMockData: boolean;
  contextName: string;
  apiConnectionFailed?: boolean;
}

export function DashboardMainContent({ 
  data, 
  isLoading, 
  error, 
  loadingStage, 
  isUsingMockData,
  contextName,
  apiConnectionFailed = false
}: DashboardMainContentProps) {
  if (isLoading || loadingStage === 'initial') {
    return <LoadingState />;
  }
  
  if (error || apiConnectionFailed) {
    return <ErrorState />;
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
        </div>
      </div>
    );
  }

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
        <div className="mt-8 mb-24">
          <SensorSourceInfo 
            sourceData={data.sourceData} 
            isLoading={false}
            isMockData={isUsingMockData}
            operatingHours={data.operatingHours}
          />
        </div>
      )}
    </>
  );
}
