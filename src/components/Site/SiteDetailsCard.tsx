
import { Site } from "@/services/interfaces";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatDate, getStatusColor } from "@/utils/formatting";
import { siteDevicesCache } from "@/services/sites";

interface SiteDetailsCardProps {
  site: Site;
}

export function SiteDetailsCard({ site }: SiteDetailsCardProps) {
  // Get device count (prioritize cache)
  const getDeviceCount = () => {
    if (!site) return 0;
    
    if (site.id && siteDevicesCache[site.id] !== undefined && siteDevicesCache[site.id] > 0) {
      console.log(`Using cached device count in detail page: ${siteDevicesCache[site.id]}`);
      return siteDevicesCache[site.id];
    }
    
    // Fall back to the site's direct device count
    const directCount = typeof site.devices === 'number' 
      ? site.devices 
      : parseInt(String(site.devices), 10) || 0;
    
    console.log(`Using direct device count in detail page: ${directCount}`);
    return directCount;
  };

  // Calculate the device count once
  const deviceCount = getDeviceCount();
  console.log("Final device count to display:", deviceCount);

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
