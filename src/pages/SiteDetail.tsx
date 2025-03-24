
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
import { SiteDevicesMeasurementTable } from "@/components/Site/SiteDevicesMeasurementTable";
import { siteDevicesCache } from "@/services/sites";
import { useState, useEffect } from "react";

const SiteDetail = () => {
  const { siteId } = useParams<{ siteId: string }>();
  const [totalDevicesFromZones, setTotalDevicesFromZones] = useState<number | null>(null);
  
  // Log which site we're viewing for debugging
  console.log(`SiteDetail: Viewing site ${siteId}`);
  
  const { data: site, isLoading: siteLoading, error: siteError } = useQuery({
    queryKey: ["site", siteId],
    queryFn: () => fetchSite(Number(siteId)),
    enabled: !!siteId,
  });

  // Log raw site data when it arrives
  useEffect(() => {
    if (site) {
      console.log(`SiteDetail: Raw site data received:`, site);
      console.log(`SiteDetail: Raw device value: ${site.devices} (${typeof site.devices})`);
    }
  }, [site]);

  // Fetch zones to calculate total devices directly
  const { data: zones } = useQuery({
    queryKey: ["zones", siteId],
    queryFn: () => fetchZones(Number(siteId)),
    enabled: !!siteId,
  });

  // Calculate total devices from zones when zones data is available
  useEffect(() => {
    if (zones) {
      console.log(`SiteDetail: Processing ${zones.length} zones to calculate total devices`);
      
      // Count total devices across all zones
      let totalDevicesFound = 0;
      
      zones.forEach(zone => {
        let zoneDevices = 0;
        
        // Handle different types of device count data
        if (typeof zone.devices === 'number') {
          zoneDevices = zone.devices;
        } else if (typeof zone.devices === 'string') {
          // Check if it's in format "X/Y"
          if (zone.devices.includes('/')) {
            const parts = zone.devices.split('/');
            zoneDevices = parseInt(parts[0], 10) || 0;
          } else {
            zoneDevices = parseInt(zone.devices, 10) || 0;
          }
        }
        
        if (zoneDevices > 0) {
          console.log(`SiteDetail: Zone ${zone.id} has ${zoneDevices} devices`);
          totalDevicesFound += zoneDevices;
        }
      });
      
      console.log(`SiteDetail: Total devices calculated from zones: ${totalDevicesFound}`);
      setTotalDevicesFromZones(totalDevicesFound);
    }
  }, [zones, siteId]);

  return (
    <SidebarWrapper>
      <div className="content-container">
        {siteLoading ? (
          <SiteLoadingSkeleton />
        ) : siteError || !site ? (
          <SiteErrorState />
        ) : (
          <>
            <SiteHeader site={site} />

            <div className="grid gap-8 md:grid-cols-2 mb-10 section-spacing">
              <SiteDetailsCard site={site} calculatedDeviceCount={totalDevicesFromZones} />
              <SiteAdditionalInfoCard site={site} />
            </div>

            {/* Devices Measurements Table */}
            <div className="settings-card mb-10 section-spacing">
              <SiteDevicesMeasurementTable siteId={site.id} />
            </div>

            {/* Zones Tabs */}
            <div className="settings-card section-spacing">
              <SiteZonesTabs siteId={site.id} />
            </div>
          </>
        )}
      </div>
    </SidebarWrapper>
  );
};

export default SiteDetail;
