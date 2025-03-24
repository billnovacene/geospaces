
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
  // Get device count with improved priority logic
  const getDeviceCount = () => {
    if (!site) return 0;
    
    // Get the direct device count from API response
    const directCount = typeof site.devices === 'number' 
      ? site.devices 
      : parseInt(String(site.devices), 10) || 0;
    
    console.log(`Direct device count from API for site ${site.id}: ${directCount}`);
    
    // Check if we have a reliable device count from the API
    if (directCount > 0) {
      console.log(`Using reliable direct count from API: ${directCount}`);
      return directCount;
    }
    
    // Next, check if we have a calculated count from zones (if available and positive)
    if (calculatedDeviceCount !== null && calculatedDeviceCount > 0) {
      console.log(`Using calculated device count from zones: ${calculatedDeviceCount}`);
      return calculatedDeviceCount;
    }
    
    // Lastly, check the cache as fallback
    if (site.id && siteDevicesCache[site.id] !== undefined && siteDevicesCache[site.id] > 0) {
      const cachedCount = siteDevicesCache[site.id];
      console.log(`Using cached device count: ${cachedCount}`);
      return cachedCount;
    }
    
    // If all else fails, return 0
    console.log(`No reliable device count found, using 0`);
    return 0;
  };

  // Calculate the device count once
  const deviceCount = getDeviceCount();
  console.log(`Site ${site.id} - Final device count to display: ${deviceCount}`);

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
