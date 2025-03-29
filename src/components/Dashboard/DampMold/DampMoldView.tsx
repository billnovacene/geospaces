
import React, { useState } from "react";
import { DailyOverviewSection } from "./DailyOverviewSection";
import { MonthlyOverviewSection } from "./MonthlyOverviewSection";
import { RiskGlanceSection } from "./RiskGlanceSection";
import { ScrollbarStyler } from "./ScrollbarStyler";
import { DevelopmentLogPanel } from "./DevelopmentLogPanel";
import { DampMoldProvider } from "./context/DampMoldContext";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { LoaderIcon, DatabaseIcon, AlertTriangleIcon } from "lucide-react";
import { useDampMoldData } from "./hooks/useDampMoldData";
import { generateAndInsertDampMoldData } from "@/services/damp-mold-data-generator";
import { toast } from "sonner";

interface DampMoldViewProps {
  contextType?: "zone" | "site" | "all";
  contextId?: string | null;
  siteId?: string;
  zoneId?: string;
  activeFilter?: string | null;
  currentDate?: Date;
}

const EmptyStateView = ({ onGenerateData, isLoading, contextInfo }: { 
  onGenerateData: () => void; 
  isLoading: boolean;
  contextInfo: any;
}) => {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center space-y-6">
      <DatabaseIcon className="h-16 w-16 text-muted-foreground/50" />
      <div className="space-y-2">
        <h3 className="text-xl font-medium">No Damp & Mold Data Found</h3>
        <p className="text-muted-foreground max-w-md">
          {contextInfo.contextType === "zone"
            ? `There is no data for this zone (${contextInfo.contextName}).`
            : contextInfo.contextType === "site"
            ? `There is no data for this site (${contextInfo.contextName}).`
            : "There is no damp & mold data in the database."}
        </p>
      </div>
      <Button 
        onClick={onGenerateData} 
        disabled={isLoading} 
        variant="default"
        className="mt-4"
      >
        {isLoading ? (
          <>
            <LoaderIcon className="mr-2 h-4 w-4 animate-spin" />
            Generating...
          </>
        ) : (
          <>Generate Test Data</>
        )}
      </Button>
    </div>
  );
};

const ErrorStateView = ({ error, onRetry, isLoading }: { 
  error: Error; 
  onRetry: () => void;
  isLoading: boolean;
}) => {
  return (
    <Alert variant="destructive" className="mb-6">
      <AlertTriangleIcon className="h-4 w-4" />
      <AlertTitle>Error Loading Damp & Mold Data</AlertTitle>
      <AlertDescription>
        <div className="mt-2">{error.message}</div>
        <Button 
          onClick={onRetry} 
          disabled={isLoading} 
          variant="outline" 
          size="sm" 
          className="mt-4"
        >
          {isLoading ? (
            <>
              <LoaderIcon className="mr-2 h-4 w-4 animate-spin" />
              Retrying...
            </>
          ) : (
            <>Retry</>
          )}
        </Button>
      </AlertDescription>
    </Alert>
  );
};

export function DampMoldViewInner({ 
  activeFilter = null,
  currentDate = new Date()
}: {
  activeFilter?: string | null;
  currentDate?: Date;
}) {
  const [activeTab, setActiveTab] = useState("today");
  const [dailyTimeRange, setDailyTimeRange] = useState("today");
  const [monthlyTimeRange, setMonthlyTimeRange] = useState("month");
  const [isGenerating, setIsGenerating] = useState(false);
  
  const { 
    data, 
    isLoading, 
    error, 
    refetch,
    contextInfo
  } = useDampMoldData();

  const handleGenerateTestData = async () => {
    try {
      setIsGenerating(true);
      await generateAndInsertDampMoldData(contextInfo.zoneId, contextInfo.siteId);
      toast.success("Test data generated successfully", {
        description: "The page will now refresh to show the new data."
      });
      refetch();
    } catch (err) {
      console.error("Failed to generate test data:", err);
      toast.error("Failed to generate test data", {
        description: err instanceof Error ? err.message : "An unknown error occurred"
      });
    } finally {
      setIsGenerating(false);
    }
  };

  // If there's an error, show the error state
  if (error) {
    return <ErrorStateView error={error} onRetry={refetch} isLoading={isLoading} />;
  }

  // If there's no data and we're not loading, show the empty state
  if (!isLoading && (!data || !data.daily || data.daily.length === 0)) {
    return <EmptyStateView onGenerateData={handleGenerateTestData} isLoading={isGenerating} contextInfo={contextInfo} />;
  }

  // Apply filtering based on activeFilter to data from API
  let monthlyRiskData = [];
  
  // We don't have any real monthly data source yet, leaving as empty array

  return (
    <div className="space-y-6 dark:bg-gray-900 transition-colors duration-300">
      {/* Apply scrollbar styling */}
      <ScrollbarStyler />
      
      {/* Monthly Overview section */}
      <MonthlyOverviewSection 
        timeRange={monthlyTimeRange}
        setTimeRange={setMonthlyTimeRange}
        monthlyRiskData={monthlyRiskData} 
      />
      
      {/* Daily Overview section with description */}
      <DailyOverviewSection 
        timeRange={dailyTimeRange} 
        setTimeRange={setDailyTimeRange}
      />
      
      <RiskGlanceSection 
        activeTab={activeTab} 
        setActiveTab={setActiveTab}
        timeRange={dailyTimeRange} 
        setTimeRange={setDailyTimeRange} 
        monthlyRiskData={monthlyRiskData}
        activeFilter={activeFilter}
      />
      
      {/* Development logs panel */}
      <DevelopmentLogPanel />
    </div>
  );
}

export function DampMoldView({ 
  contextType: propsContextType, 
  contextId: propsContextId,
  siteId: propsSiteId,
  zoneId: propsZoneId,
  activeFilter = null,
  currentDate = new Date()
}: DampMoldViewProps) {
  return (
    <DampMoldProvider
      contextType={propsContextType}
      contextId={propsContextId}
      siteId={propsSiteId}
      zoneId={propsZoneId}
      activeFilter={activeFilter}
      currentDate={currentDate}
    >
      <DampMoldViewInner 
        activeFilter={activeFilter} 
        currentDate={currentDate} 
      />
    </DampMoldProvider>
  );
}

export default DampMoldView;
