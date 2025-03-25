
import { LoadingState } from "@/components/Dashboard/TempHumidity/LoadingState";
import { ErrorState } from "@/components/Dashboard/TempHumidity/ErrorState";
import { DashboardContent } from "@/components/Dashboard/TempHumidity/DashboardContent";
import { SensorSourceInfo } from "@/components/Dashboard/TempHumidity/SensorSourceInfo";
import { DashboardStatsSection } from "@/components/Dashboard/TempHumidity/DashboardStatsSection";
import { TempHumidityResponse } from "@/services/interfaces/temp-humidity";

interface DashboardMainContentProps {
  data: TempHumidityResponse | undefined;
  isLoading: boolean;
  error: Error | null;
  loadingStage: 'initial' | 'daily' | 'stats' | 'monthly' | 'complete';
  isUsingMockData: boolean;
  contextName: string;
}

export function DashboardMainContent({ 
  data, 
  isLoading, 
  error, 
  loadingStage, 
  isUsingMockData,
  contextName
}: DashboardMainContentProps) {
  if (isLoading || loadingStage === 'initial') {
    return <LoadingState />;
  }
  
  if (error) {
    return <ErrorState />;
  }
  
  if (!data) {
    return null;
  }

  return (
    <>
      {loadingStage !== 'initial' && loadingStage !== 'daily' && (
        <DashboardStatsSection 
          stats={data.stats} 
          isLoading={isLoading} 
          loadingStage={loadingStage}
        />
      )}

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
