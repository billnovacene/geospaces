import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { fetchSite, fetchZones } from "@/services/api";
import { SidebarWrapper } from "@/components/Dashboard/Sidebar";
import { SiteHeader } from "@/components/Site/SiteHeader";
import { SiteDetailsCard } from "@/components/Site/SiteDetailsCard";
import { SiteAdditionalInfoCard } from "@/components/Site/SiteAdditionalInfoCard";
import { SiteZonesTabs } from "@/components/Site/SiteZonesTabs";
import { SiteLoadingSkeleton } from "@/components/Site/SiteLoadingSkeleton";
import { SiteErrorState } from "@/components/Site/SiteErrorState";
import { siteDevicesCache } from "@/services/sites";
import { useState, useEffect } from "react";

const SiteDetail = () => {
  const { siteId } = useParams<{ siteId: string }>();
  const [totalDevicesFromZones, setTotalDevicesFromZones] = useState<number | null>(null);
  
  const { data: site, isLoading: siteLoading, error: siteError } = useQuery({
    queryKey: ["site", siteId],
    queryFn: () => fetchSite(Number(siteId)),
    enabled: !!siteId,
  });

  // Fetch zones to calculate total devices directly
  const { data: zones } = useQuery({
    queryKey: ["zones", siteId],
    queryFn: () => fetchZones(Number(siteId)),
    enabled: !!siteId,
  });

  // Calculate total devices from zones when zones data is available
  useEffect(() => {
    if (zones) {
      console.log(`Site ${siteId} - Raw zone data:`, zones);
      console.log(`Site ${siteId} - Processing ${zones.length} zones to calculate total devices`);
      
      // Print original site device data for debugging
      if (site) {
        console.log(`Site ${siteId} - Original device data type: ${typeof site.devices}`);
        console.log(`Site ${siteId} - Original device value: ${site.devices}`);
      }
      
      // Count zones with devices for debugging
      let zonesWithDevices = 0;
      let totalDevicesFound = 0;
      
      // Analyze each zone's device count
      zones.forEach(zone => {
        const rawZoneDevices = zone.devices;
        console.log(`Zone ${zone.id} - Raw device value: ${rawZoneDevices} (${typeof rawZoneDevices})`);
        
        const zoneDevices = typeof zone.devices === 'number' 
          ? zone.devices 
          : parseInt(String(zone.devices), 10) || 0;
        
        if (zoneDevices > 0) {
          zonesWithDevices++;
          totalDevicesFound += zoneDevices;
          console.log(`Zone ${zone.id} - Has ${zoneDevices} devices (parsed)`);
        }
      });
      
      // Set the calculated total from zones
      console.log(`Site ${siteId} - Found ${totalDevicesFound} devices across ${zonesWithDevices} zones`);
      setTotalDevicesFromZones(totalDevicesFound);
      
      // Don't update the cache automatically - let the SiteDetailsCard component decide
      // which count is best based on its prioritization logic
    }
  }, [zones, siteId, site]);

  return (
    <SidebarWrapper>
      <div className="container mx-auto py-6">
        {siteLoading ? (
          <SiteLoadingSkeleton />
        ) : siteError || !site ? (
          <SiteErrorState />
        ) : (
          <>
            <SiteHeader site={site} />

            <div className="grid gap-6 md:grid-cols-2 mb-8">
              <SiteDetailsCard site={site} calculatedDeviceCount={totalDevicesFromZones} />
              <SiteAdditionalInfoCard site={site} />
            </div>

            {/* Zones Tabs */}
            <SiteZonesTabs siteId={site.id} />
          </>
        )}
      </div>
    </SidebarWrapper>
  );
};

export default SiteDetail;
