import { useParams, Link } from "react-router-dom";
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
import { AlertTriangle, Home } from "lucide-react";
import { Button } from "@/components/ui/button";

const SiteDetail = () => {
  const { siteId } = useParams<{ siteId: string }>();
  const [totalDevicesFromZones, setTotalDevicesFromZones] = useState<number | null>(null);
  
  // Check if we have a valid siteId
  const validSiteId = siteId && !isNaN(Number(siteId)) ? Number(siteId) : null;
  
  // Log which site we're viewing for debugging
  console.log(`SiteDetail: Viewing site ${siteId}, valid ID: ${validSiteId}`);
  
  // If we don't have a valid siteId, show an error state
  if (!validSiteId) {
    return (
      <SidebarWrapper>
        <div className="content-container">
          <div className="max-w-2xl mx-auto mt-20 text-center">
            <div className="bg-white p-8 rounded-lg border shadow-sm">
              <div className="flex justify-center mb-4">
                <AlertTriangle className="h-12 w-12 text-amber-500" />
              </div>
              <h1 className="text-2xl font-bold mb-2">Invalid Site ID</h1>
              <p className="text-zinc-600 mb-6">
                The site you are trying to view does not exist or has an invalid ID.
                Please select a valid site from the dashboard.
              </p>
              <Button asChild>
                <Link to="/" className="flex items-center justify-center gap-2">
                  <Home className="h-4 w-4" />
                  Return to Dashboard
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </SidebarWrapper>
    );
  }
  
  const { data: site, isLoading: siteLoading, error: siteError } = useQuery({
    queryKey: ["site", validSiteId],
    queryFn: () => fetchSite(validSiteId),
    enabled: !!validSiteId,
  });

  // Log raw site data when it arrives
  useEffect(() => {
    if (site) {
      console.log(`SiteDetail: Raw site data received:`, site);
      console.log(`SiteDetail: Site projectId: ${site.projectId}`);
      console.log(`SiteDetail: Raw device value: ${site.devices} (${typeof site.devices})`);
    }
  }, [site]);

  // Fetch zones to calculate total devices directly
  const { data: zones } = useQuery({
    queryKey: ["zones", validSiteId],
    queryFn: () => fetchZones(validSiteId),
    enabled: !!validSiteId,
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
  }, [zones, validSiteId]);

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
