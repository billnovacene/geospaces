
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
import { useZoneArea } from "@/hooks/useZoneArea";

const ZoneDetail = () => {
  const { zoneId } = useParams<{ zoneId: string }>();
  
  const { data: zone, isLoading, error } = useQuery({
    queryKey: ["zone", zoneId],
    queryFn: () => fetchZone(Number(zoneId)),
    enabled: !!zoneId,
  });

  const { data: deviceCount, isLoading: deviceCountLoading } = useQuery({
    queryKey: ["zone-devices", zoneId],
    queryFn: () => fetchDevicesCountForZone(Number(zoneId)),
    enabled: !!zoneId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  console.log(`Fetching details for zone ${zoneId}`);
  console.log("Zone data in ZoneDetail:", zone);
  console.log("Zone location data:", zone?.location);
  console.log("Zone device count from API:", deviceCount);

  const areaValue = useZoneArea(zone);

  return (
    <SidebarWrapper>
      <div className="container mx-auto py-6">
        {isLoading ? (
          <ZoneLoadingSkeleton />
        ) : error || !zone ? (
          <ZoneErrorState />
        ) : (
          <>
            <ZoneDetailHeader zone={zone} />

            <div className="grid gap-6 md:grid-cols-2 mb-8">
              <ZoneDetailsCard 
                zone={zone} 
                deviceCount={deviceCount} 
                deviceCountLoading={deviceCountLoading} 
                areaValue={areaValue} 
              />
              <ZoneAdditionalInfoCard zone={zone} />
            </div>
            
            {/* Devices Table and Cards */}
            <ZoneDevices zoneId={Number(zoneId)} />
            
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
