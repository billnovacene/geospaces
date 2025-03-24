
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
  // Get device count (prioritize calculated count from zones)
  const getDeviceCount = () => {
    if (!site) return 0;
    
    // First check if we have a calculated count from the zones (most accurate)
    if (calculatedDeviceCount !== null && calculatedDeviceCount > 0) {
      console.log(`Using calculated device count from zones: ${calculatedDeviceCount}`);
      return calculatedDeviceCount;
    }
    
    // Next check if the site has a direct devices property that's a positive number
    const directCount = typeof site.devices === 'number' 
      ? site.devices 
      : parseInt(String(site.devices), 10) || 0;
    
    console.log(`Direct device count from API: ${directCount}`);
    
    // Then check if there's a cached count that's higher (might be more up-to-date)
    if (site.id && siteDevicesCache[site.id] !== undefined) {
      const cachedCount = siteDevicesCache[site.id];
      console.log(`Cached device count: ${cachedCount}`);
      
      // Return the higher value between direct count and cached count
      if (cachedCount > directCount) {
        console.log(`Using cached count ${cachedCount} (higher than direct ${directCount})`);
        return cachedCount;
      }
    }
    
    console.log(`Using direct count ${directCount}`);
    return directCount;
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
