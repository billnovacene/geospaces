
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
      // Check each zone and log its device count for debugging
      zones.forEach(zone => {
        console.log(`Zone ${zone.id} - Device count: ${zone.devices}`);
      });
      
      const deviceTotal = zones.reduce((total, zone) => {
        const zoneDevices = typeof zone.devices === 'number' 
          ? zone.devices 
          : parseInt(String(zone.devices), 10) || 0;
        return total + zoneDevices;
      }, 0);
      
      console.log(`Site ${siteId} - Total devices calculated from zones: ${deviceTotal}`);
      setTotalDevicesFromZones(deviceTotal);
      
      // Update the cache with this more accurate count
      if (site?.id) {
        console.log(`Updating device cache for site ${site.id} with calculated total: ${deviceTotal}`);
        // Only update the cache if the site doesn't already have a higher direct device count
        const directCount = typeof site.devices === 'number' 
          ? site.devices 
          : parseInt(String(site.devices), 10) || 0;
          
        if (deviceTotal > directCount) {
          siteDevicesCache[site.id] = deviceTotal;
        } else if (directCount > 0) {
          console.log(`Using direct count ${directCount} from API instead of zone total ${deviceTotal}`);
          siteDevicesCache[site.id] = directCount;
        }
      }
    }
  }, [zones, siteId, site]);

  // Enhanced debugging
  console.log(`Site ${siteId} - Complete site data:`, site);
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
