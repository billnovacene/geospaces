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
import { AlertTriangle, Home, Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { HomeIcon } from "lucide-react";

const SiteDetail = () => {
  const { siteId } = useParams<{ siteId: string }>();
  const [totalDevicesFromZones, setTotalDevicesFromZones] = useState<number | null>(null);
  
  const validSiteId = siteId && !isNaN(Number(siteId)) ? Number(siteId) : null;
  
  console.log(`SiteDetail: Viewing site ${siteId}, valid ID: ${validSiteId}`);
  
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
                <Button asChild>
                  <Link to="/" className="flex items-center justify-center gap-2">
                    <Home className="h-4 w-4" />
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

  useEffect(() => {
    if (site) {
      console.log(`SiteDetail: Raw site data received:`, site);
      
      toast.success(`Site data loaded for ${site.name}`, {
        id: "site-data-loaded",
        duration: 2000,
      });
    }
  }, [site]);

  const { data: zones } = useQuery({
    queryKey: ["zones", validSiteId],
    queryFn: () => fetchZones(validSiteId),
    enabled: !!validSiteId,
  });

  useEffect(() => {
    if (zones) {
      console.log(`SiteDetail: Processing ${zones.length} zones to calculate total devices`);
      
      let totalDevicesFound = 0;
      
      zones.forEach(zone => {
        let zoneDevices = 0;
        
        if (typeof zone.devices === 'number') {
          zoneDevices = zone.devices;
        } else if (typeof zone.devices === 'string') {
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
      <div className="container mx-auto py-6 px-6 md:px-8 lg:px-12">
        {siteLoading ? (
          <SiteLoadingSkeleton />
        ) : siteError || !site ? (
          <SiteErrorState />
        ) : (
          <>
            {/* Breadcrumb navigation at the very top */}
            <div className="mb-6">
              <Breadcrumb>
                <BreadcrumbList>
                  <BreadcrumbItem>
                    <BreadcrumbLink asChild>
                      <Link to="/">
                        <HomeIcon className="h-3.5 w-3.5 text-primary" />
                      </Link>
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                    <BreadcrumbPage>{site.name}</BreadcrumbPage>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>
            </div>

            <div className="flex items-center space-x-3 mb-6">
              <div className="rounded-lg bg-primary/10 p-2">
                <Building2 className="h-6 w-6 text-primary" />
              </div>
              <h1 className="text-2xl font-semibold">
                {site.name} Site Dashboard
              </h1>
            </div>
            
            <div className="mb-6">
              <SiteHeader site={site} />
            </div>
            
            <div className="grid gap-6 lg:grid-cols-2 mb-6">
              <SiteDetailsCard site={site} calculatedDeviceCount={totalDevicesFromZones} />
              <SiteAdditionalInfoCard site={site} />
            </div>

            <div className="w-full mb-6">
              <Card className="shadow-sm">
                <CardContent className="p-6">
                  <h2 className="text-xl font-medium mb-4">Zones</h2>
                  <SiteZonesTabs siteId={site.id} />
                </CardContent>
              </Card>
            </div>

            <Card className="shadow-sm mb-6">
              <CardContent className="p-6">
                <h2 className="text-xl font-medium mb-4">Device Measurements</h2>
                <SiteDevicesMeasurementTable siteId={site.id} />
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </SidebarWrapper>
  );
};

export default SiteDetail;
