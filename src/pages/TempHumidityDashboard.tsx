
import { SidebarWrapper } from "@/components/Dashboard/Sidebar";
import { DashboardHeader } from "@/components/Dashboard/TempHumidity/DashboardHeader";
import { DashboardMainContent } from "@/components/Dashboard/TempHumidity/DashboardMainContent";
import { useTempHumidityData } from "@/hooks/useTempHumidityData";
import { useContextName } from "@/components/Dashboard/TempHumidity/useContextName";

export default function TempHumidityDashboard() {
  // Custom hooks to manage data and context
  const { data, isLoading, error, isUsingMockData, loadingStage, apiConnectionFailed } = useTempHumidityData();
  const { contextName } = useContextName();

  return (
    <SidebarWrapper>
      <div className="container mx-auto py-8 px-6 md:px-8 lg:px-12">
        {/* Header section with breadcrumbs and badges */}
        <DashboardHeader 
          isUsingMockData={isUsingMockData} 
          isLoading={isLoading} 
          operatingHours={data?.operatingHours}
        />

        {/* Main dashboard content with stats, charts and sensor info */}
        <DashboardMainContent 
          data={data}
          isLoading={isLoading}
          error={error}
          loadingStage={loadingStage}
          isUsingMockData={isUsingMockData}
          contextName={contextName}
          apiConnectionFailed={apiConnectionFailed}
        />
      </div>
    </SidebarWrapper>
  );
}
