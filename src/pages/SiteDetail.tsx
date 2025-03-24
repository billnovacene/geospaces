
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
      console.log(`Site ${siteId} - Processing ${zones.length} zones to calculate total devices`);
      
      // Check each zone and log its device count for debugging
      let zonesWithDevices = 0;
      zones.forEach(zone => {
        const zoneDevices = typeof zone.devices === 'number' 
          ? zone.devices 
          : parseInt(String(zone.devices), 10) || 0;
        
        if (zoneDevices > 0) {
          zonesWithDevices++;
          console.log(`Zone ${zone.id} - Has ${zoneDevices} devices`);
        }
      });
      
      const deviceTotal = zones.reduce((total, zone) => {
        const zoneDevices = typeof zone.devices === 'number' 
          ? zone.devices 
          : parseInt(String(zone.devices), 10) || 0;
        return total + zoneDevices;
      }, 0);
      
      console.log(`Site ${siteId} - Total devices calculated from zones: ${deviceTotal} (${zonesWithDevices} zones with devices)`);
      setTotalDevicesFromZones(deviceTotal);
      
      // Update the cache with this calculated count
      if (site?.id) {
        // Determine the best count to cache
        const directCount = typeof site.devices === 'number' 
          ? site.devices 
          : parseInt(String(site.devices), 10) || 0;
        
        const bestCount = Math.max(directCount, deviceTotal);
        console.log(`Site ${siteId} - Updating device cache with best count: ${bestCount}`);
        siteDevicesCache[site.id] = bestCount;
      }
    }
  }, [zones, siteId, site]);

  // Enhanced debugging
  console.log(`Site ${siteId} - Original devices property:`, site?.devices);
  console.log(`Site ${siteId} - Cached device count:`, site?.id ? siteDevicesCache[site.id] : "No cache");
  console.log(`Site ${siteId} - Total devices from zones:`, totalDevicesFromZones);

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
