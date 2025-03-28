
import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { fetchZone } from "@/services/api";
import { fetchDevicesCountForZone } from "@/services/devices";
import { SidebarWrapper } from "@/components/Dashboard/Sidebar";
import { ZoneDetailHeader } from "@/components/Zone/ZoneDetailHeader";
import { ZoneDetailsCard } from "@/components/Zone/ZoneDetailsCard";
import { ZoneAdditionalInfoCard } from "@/components/Zone/ZoneAdditionalInfoCard";
import { ZoneLoadingSkeleton } from "@/components/Zone/ZoneLoadingSkeleton";
import { ZoneErrorState } from "@/components/Zone/ZoneErrorState";
import { ZoneDevices } from "@/components/Zone/ZoneDevices";
import { SubZonesList } from "@/components/Zone/SubZonesList";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Card, CardContent } from "@/components/ui/card";
import { Package } from "lucide-react";
import { GlobalNavigationHeader } from "@/components/Dashboard/Common/GlobalNavigationHeader";

const ZoneDetail = () => {
  const { zoneId } = useParams<{ zoneId: string }>();
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  
  const { data: zone, isLoading, error, refetch: refetchZone } = useQuery({
    queryKey: ["zone", zoneId],
    queryFn: () => fetchZone(Number(zoneId)),
    enabled: !!zoneId,
  });

  const { data: deviceCount, isLoading: deviceCountLoading, refetch: refetchDeviceCount } = useQuery({
    queryKey: ["zone-devices", zoneId],
    queryFn: () => fetchDevicesCountForZone(Number(zoneId)),
    enabled: !!zoneId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Effect to refresh data when zoneId changes
  useEffect(() => {
    if (zoneId) {
      console.log(`ZoneDetail: Fetching data for zone ${zoneId}`);
      refetchZone();
      refetchDeviceCount();
    }
  }, [zoneId, refetchZone, refetchDeviceCount]);

  console.log(`Fetching details for zone ${zoneId}`);
  console.log("Zone data in ZoneDetail:", zone);
  console.log("Zone location data:", zone?.location);
  console.log("Zone device count from API:", deviceCount);

  const handleRefresh = () => {
    toast.info("Refreshing zone data...");
    refetchZone();
    refetchDeviceCount();
  };
  
  const handleDateChange = (date: Date) => {
    console.log("Date changed in Zone Detail:", date);
    setCurrentDate(date);
    // You could refresh data based on date here
    refetchZone();
    refetchDeviceCount();
  };

  return (
    <SidebarWrapper>
      {/* Global Navigation Header at the top */}
      <GlobalNavigationHeader 
        onDateChange={handleDateChange}
        initialDate={currentDate}
      />
      
      <div className="container mx-auto py-6 px-6 md:px-8 lg:px-12">
        {isLoading ? (
          <ZoneLoadingSkeleton />
        ) : error || !zone ? (
          <ZoneErrorState />
        ) : (
          <>
            <ZoneDetailHeader zone={zone} />
            
            <div className="flex items-center space-x-3 mb-6">
              <div className="rounded-lg bg-primary/10 p-2">
                <Package className="h-6 w-6 text-primary" />
              </div>
              <h1 className="text-2xl font-semibold">
                Overview
              </h1>
            </div>

            <div className="grid gap-6 md:grid-cols-2 mb-6">
              <ZoneDetailsCard 
                zone={zone} 
                deviceCount={deviceCount} 
                deviceCountLoading={deviceCountLoading}
              />
              <ZoneAdditionalInfoCard zone={zone} />
            </div>
            
            <Card className="shadow-sm mb-6">
              <CardContent className="p-6">
                <h2 className="text-xl font-medium mb-4">Devices</h2>
                <ZoneDevices 
                  zoneId={Number(zoneId)} 
                  siteId={zone.siteId} 
                />
              </CardContent>
            </Card>
            
            <Card className="shadow-sm mb-6">
              <CardContent className="p-6">
                <h2 className="text-xl font-medium mb-4">Sub-Zones</h2>
                <SubZonesList 
                  parentZoneId={Number(zoneId)} 
                  siteId={zone.siteId}
                />
              </CardContent>
            </Card>
          </>
        )}
      </div>
      <button 
        onClick={handleRefresh}
        className="fixed bottom-4 right-4 text-xs bg-primary/10 text-primary px-3 py-2 rounded-md hover:bg-primary/20"
      >
        Refresh Data
      </button>
    </SidebarWrapper>
  );
};

export default ZoneDetail;
