
import { useParams } from "react-router-dom";
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
import { useEffect } from "react";
import { toast } from "sonner";

const ZoneDetail = () => {
  const { zoneId } = useParams<{ zoneId: string }>();
  
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

  return (
    <SidebarWrapper>
      <div className="container mx-auto py-6">
        {isLoading ? (
          <ZoneLoadingSkeleton />
        ) : error || !zone ? (
          <ZoneErrorState />
        ) : (
          <>
            <div className="flex justify-between items-start mb-6">
              <ZoneDetailHeader zone={zone} />
              <button 
                onClick={handleRefresh}
                className="text-xs text-primary hover:underline"
              >
                Refresh Data
              </button>
            </div>

            <div className="grid gap-6 md:grid-cols-2 mb-8">
              <ZoneDetailsCard 
                zone={zone} 
                deviceCount={deviceCount} 
                deviceCountLoading={deviceCountLoading}
              />
              <ZoneAdditionalInfoCard zone={zone} />
            </div>
            
            {/* ZoneDevices - Pass zoneId and siteId */}
            <ZoneDevices 
              zoneId={Number(zoneId)} 
              siteId={zone.siteId} 
            />
            
            {/* Sub-Zones List - Pass siteId from zone */}
            <SubZonesList 
              parentZoneId={Number(zoneId)} 
              siteId={zone.siteId}
            />
          </>
        )}
      </div>
    </SidebarWrapper>
  );
};

export default ZoneDetail;
