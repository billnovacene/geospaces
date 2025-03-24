
import { Site } from "@/services/interfaces";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatDate, getStatusColor } from "@/utils/formatting";
import { siteDevicesCache } from "@/services/sites";

interface SiteDetailsCardProps {
  site: Site;
  calculatedDeviceCount: number | null;
}

export function SiteDetailsCard({ site, calculatedDeviceCount }: SiteDetailsCardProps) {
  const getDeviceCount = () => {
    if (!site) return 0;
    
    // For site 471 (and other sites), we should directly get the raw devices count
    console.log(`SiteDetailsCard: Raw device data for site ${site.id}:`, {
      rawDevices: site.devices,
      calculatedDeviceCount,
      deviceType: typeof site.devices
    });
    
    // If API returns a string with format "X/Y", extract X as active devices
    if (typeof site.devices === 'string') {
      if (site.devices.includes('/')) {
        const parts = site.devices.split('/');
        if (parts.length > 0) {
          const activeDevices = parseInt(parts[0], 10);
          if (!isNaN(activeDevices)) {
            console.log(`SiteDetailsCard: Using active devices from string "${site.devices}": ${activeDevices}`);
            return activeDevices;
          }
        }
      } else {
        // Try parsing if it's a string containing just a number
        const parsed = parseInt(site.devices, 10);
        if (!isNaN(parsed)) {
          console.log(`SiteDetailsCard: Using parsed numeric device count: ${parsed}`);
          return parsed;
        }
      }
    }
    
    // Direct API response value if it's a number
    if (typeof site.devices === 'number') {
      console.log(`SiteDetailsCard: Using direct numeric device count: ${site.devices}`);
      return site.devices;
    }
    
    // Fallback to calculated count from zones if available
    if (calculatedDeviceCount !== null && calculatedDeviceCount > 0) {
      console.log(`SiteDetailsCard: Using calculated device count from zones: ${calculatedDeviceCount}`);
      return calculatedDeviceCount;
    }
    
    // Last resort - check cache
    if (site.id && siteDevicesCache[site.id] > 0) {
      console.log(`SiteDetailsCard: Using cached device count: ${siteDevicesCache[site.id]}`);
      return siteDevicesCache[site.id];
    }
    
    console.log(`SiteDetailsCard: No valid device count found, returning 0`);
    return 0;
  };

  // Calculate the device count
  const deviceCount = getDeviceCount();
  console.log(`SiteDetailsCard: Final device count to display for site ${site.id}: ${deviceCount}`);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Site Details</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <h3 className="font-medium text-sm text-muted-foreground mb-1">Site ID</h3>
          <p>{site.id}</p>
        </div>
        <div>
          <h3 className="font-medium text-sm text-muted-foreground mb-1">Project ID</h3>
          <p>{site.projectId}</p>
        </div>
        <div>
          <h3 className="font-medium text-sm text-muted-foreground mb-1">Location</h3>
          <p>{site.locationText || "No location provided"}</p>
        </div>
        {site.location && site.location.length === 2 && (
          <div>
            <h3 className="font-medium text-sm text-muted-foreground mb-1">Coordinates</h3>
            <p>Longitude: {site.location[0]}, Latitude: {site.location[1]}</p>
          </div>
        )}
        <div className="pt-2 grid grid-cols-2 gap-4">
          <Card className="bg-muted/40">
            <CardContent className="p-4">
              <div>
                <p className="text-sm font-medium">Devices</p>
                <p className="text-2xl font-bold">{deviceCount}</p>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-muted/40">
            <CardContent className="p-4">
              <div>
                <p className="text-sm font-medium">Created</p>
                <p className="text-sm">{formatDate(site.createdAt)}</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </CardContent>
    </Card>
  );
}
