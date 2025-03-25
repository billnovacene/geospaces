
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
import { useState, useEffect } from "react";
import { AlertTriangle, Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";

const SiteDetail = () => {
  const { siteId } = useParams<{ siteId: string }>();
  const [totalDevicesFromZones, setTotalDevicesFromZones] = useState<number | null>(null);
  
  // Check if we have a valid siteId
  const validSiteId = siteId && !isNaN(Number(siteId)) ? Number(siteId) : null;
  
  // If we don't have a valid siteId, show an error state
  if (!validSiteId) {
    return (
      <SidebarWrapper>
        <div className="container mx-auto py-8 px-6 md:px-8 lg:px-12">
          <div className="max-w-2xl mx-auto mt-20 text-center">
            <Card className="shadow-sm">
              <CardContent className="p-8">
                <div className="flex justify-center mb-4">
                  <AlertTriangle className="h-12 w-12 text-amber-500" />
                </div>
                <h1 className="text-2xl font-bold mb-2">Invalid Site ID</h1>
                <p className="text-zinc-600 mb-6">
                  The site you are trying to view does not exist or has an invalid ID.
                  Please select a valid site from the dashboard.
                </p>
                <Button asChild className="bg-[#6CAE3E] hover:bg-[#5A972F]">
                  <Link to="/" className="flex items-center justify-center gap-2">
                    <Building2 className="h-4 w-4" />
                    Return to Dashboard
                  </Link>
                </Button>
              </CardContent>
            </Card>
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
      // Show a toast notification when site data is loaded
      toast.success(`Site data loaded for ${site.name}`, {
        id: "site-data-loaded",
        duration: 2000,
      });
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
          totalDevicesFound += zoneDevices;
        }
      });
      
      setTotalDevicesFromZones(totalDevicesFound);
    }
  }, [zones, validSiteId]);

  return (
    <SidebarWrapper>
      <div className="container mx-auto py-8 px-6 md:px-8 lg:px-12">
        {siteLoading ? (
          <SiteLoadingSkeleton />
        ) : siteError || !site ? (
          <SiteErrorState />
        ) : (
          <div className="space-y-8">
            <SiteHeader site={site} />
            
            <div className="grid gap-8 md:grid-cols-2">
              <SiteDetailsCard site={site} calculatedDeviceCount={totalDevicesFromZones} />
              <SiteAdditionalInfoCard site={site} />
            </div>

            {/* Zones Tabs */}
            <Card className="shadow-sm border-0">
              <CardContent className="p-6">
                <h2 className="text-xl font-medium mb-4">Zones</h2>
                <SiteZonesTabs siteId={site.id} />
              </CardContent>
            </Card>

            {/* Devices Measurements Table */}
            <SiteDevicesMeasurementTable siteId={site.id} />
          </div>
        )}
      </div>
    </SidebarWrapper>
  );
};

export default SiteDetail;
