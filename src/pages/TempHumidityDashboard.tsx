
import { useQuery } from "@tanstack/react-query";
import { fetchTempHumidityData } from "@/services/temp-humidity";
import { SidebarWrapper } from "@/components/Dashboard/Sidebar";
import { useEffect, useState } from "react";
import { BreadcrumbNav } from "@/components/Dashboard/TempHumidity/BreadcrumbNav";
import { TempHumidityStats } from "@/components/Dashboard/TempHumidity/TempHumidityStats";
import { LoadingState } from "@/components/Dashboard/TempHumidity/LoadingState";
import { ErrorState } from "@/components/Dashboard/TempHumidity/ErrorState";
import { DashboardContent } from "@/components/Dashboard/TempHumidity/DashboardContent";
import { PageHeader } from "@/components/Dashboard/TempHumidity/PageHeader";
import { SensorSourceInfo } from "@/components/Dashboard/TempHumidity/SensorSourceInfo";
import { useParams } from "react-router-dom";
import { fetchSite } from "@/services/sites";
import { fetchZone } from "@/services/zones";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, Clock } from "lucide-react";

export default function TempHumidityDashboard() {
  const { siteId, zoneId } = useParams<{ siteId: string; zoneId: string }>();
  const [isUsingMockData, setIsUsingMockData] = useState(false);
  
  console.log("🔍 TempHumidityDashboard: Route params:", { siteId, zoneId });
  
  const { data: siteData } = useQuery({
    queryKey: ["site-for-temp-dashboard", siteId],
    queryFn: () => fetchSite(Number(siteId)),
    enabled: !!siteId,
  });

  const { data: zoneData } = useQuery({
    queryKey: ["zone-for-temp-dashboard", zoneId],
    queryFn: () => fetchZone(Number(zoneId)),
    enabled: !!zoneId,
  });

  const getContextName = () => {
    if (zoneData) return zoneData.name;
    if (siteData) return siteData.name;
    return "All Locations";
  };

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["temp-humidity-data", siteId, zoneId],
    queryFn: () => fetchTempHumidityData(siteId, zoneId),
  });

  useEffect(() => {
    if (data) {
      const usingMockData = !data?.sourceData?.temperatureSensors?.length && 
                          !data?.sourceData?.humiditySensors?.length;
      setIsUsingMockData(usingMockData);
      
      console.log(`📊 Data source: ${usingMockData ? "SIMULATED" : "REAL API"} data`);
      console.log("📡 Sensors:", {
        temperature: data?.sourceData?.temperatureSensors || [],
        humidity: data?.sourceData?.humiditySensors || []
      });
    }
    
    if (error) {
      console.error("❌ Error fetching temperature data:", error);
    }
  }, [data, error]);

  useEffect(() => {
    const liveDataInterval = setInterval(() => {
      console.log("🔄 Refreshing temperature data...");
      refetch();
    }, 30000);
    
    return () => clearInterval(liveDataInterval);
  }, [refetch]);

  useEffect(() => {
    if (data) {
      console.log("✅ Temperature and humidity data loaded:", {
        statsAvailable: !!data.stats,
        dailyDataPoints: data.daily?.length,
        monthlyDataPoints: data.monthly?.length,
        operatingHours: data.operatingHours
      });
      
      if (siteId) {
        console.log(`📍 For site: ${siteId} (${siteData?.name || 'unknown'})`);
      }
      
      if (zoneId) {
        console.log(`🏢 For zone: ${zoneId} (${zoneData?.name || 'unknown'})`);
      }
      
      const contextType = zoneId ? "zone" : (siteId ? "site" : "dashboard");
      toast.success(`Temperature data loaded for ${contextType}`, {
        id: "temp-data-loaded",
        duration: 2000,
      });
    }
  }, [data, siteId, zoneId, siteData, zoneData]);

  const formatOperatingHours = () => {
    if (data?.operatingHours) {
      return `${data.operatingHours.startTime} - ${data.operatingHours.endTime}`;
    }
    return "All hours";
  };

  return (
    <SidebarWrapper>
      <div className="container mx-auto py-8 px-6 md:px-8 lg:px-12">
        <div className="mb-4">
          <BreadcrumbNav />
        </div>

        <div className="flex items-center justify-between mb-2">
          <PageHeader customTitle={`Temperature & Humidity - ${getContextName()}`} />
        </div>
        
        {data?.operatingHours && (
          <div className="flex items-center mb-6 text-blue-700">
            <Clock className="h-4 w-4 mr-1.5" />
            <span className="text-sm font-medium">Operating hours: {formatOperatingHours()}</span>
          </div>
        )}

        <div className="flex items-center justify-between mb-6">
          <div></div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-xs px-3 py-1">
              Data from Geospaces
            </Badge>
            
            {isUsingMockData && !isLoading && (
              <Badge variant="outline" className="text-xs px-3 py-1 bg-amber-50 text-amber-700 border-amber-200">
                <AlertTriangle className="h-3.5 w-3.5 mr-1" />
                Simulated data
              </Badge>
            )}
          </div>
        </div>
        
        {!isLoading && !error && data && (
          <>
            <div className="mb-8">
              <h3 className="text-lg font-medium mb-3">Live Metrics</h3>
              <TempHumidityStats stats={data.stats} />
            </div>
          </>
        )}

        {isLoading ? (
          <LoadingState />
        ) : error ? (
          <ErrorState />
        ) : data ? (
          <DashboardContent 
            data={data} 
            contextName={getContextName()} 
            isMockData={isUsingMockData}
            operatingHours={data.operatingHours}
          />
        ) : null}

        {!isLoading && !error && data && (
          <div className="mt-8 mb-24">
            <SensorSourceInfo 
              sourceData={data.sourceData} 
              isLoading={false}
              isMockData={isUsingMockData}
              operatingHours={data.operatingHours}
            />
          </div>
        )}
      </div>
    </SidebarWrapper>
  );
}
