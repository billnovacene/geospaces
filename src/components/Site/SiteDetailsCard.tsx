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
    
    // Extract the actual device count from the original API response as a string
    // This is often formatted as "38/38" for active/total devices
    let rawDeviceString = "";
    if (typeof site.devices === 'string') {
      rawDeviceString = site.devices;
      console.log(`Site ${site.id} - Original device string: "${rawDeviceString}"`);
    }
    
    // Try to parse the raw device string if it's in format "X/Y"
    let extractedCount = 0;
    if (rawDeviceString && rawDeviceString.includes('/')) {
      const parts = rawDeviceString.split('/');
      if (parts.length > 0 && !isNaN(parseInt(parts[0]))) {
        extractedCount = parseInt(parts[0]);
        console.log(`Site ${site.id} - Extracted first number from "${rawDeviceString}": ${extractedCount}`);
      }
    }
    
    // Get other possible device count sources
    const directNumericCount = typeof site.devices === 'number' 
      ? site.devices 
      : parseInt(String(site.devices), 10) || 0;
    
    const zoneCalculatedCount = calculatedDeviceCount !== null ? calculatedDeviceCount : 0;
    const cachedCount = site.id && siteDevicesCache[site.id] !== undefined ? siteDevicesCache[site.id] : 0;
    
    console.log(`Site ${site.id} - Device count sources:`, {
      rawDeviceString,
      extractedFromRawString: extractedCount,
      directNumeric: directNumericCount,
      calculatedFromZones: zoneCalculatedCount,
      fromCache: cachedCount
    });
    
    // Prioritize the extracted count from the original string if available
    if (extractedCount > 0) {
      console.log(`Site ${site.id} - Using extracted device count: ${extractedCount}`);
      return extractedCount;
    }
    
    // Otherwise, use the direct numeric count if positive
    if (directNumericCount > 0) {
      console.log(`Site ${site.id} - Using direct numeric count: ${directNumericCount}`);
      return directNumericCount;
    }
    
    // Then try zone-calculated count if positive
    if (zoneCalculatedCount > 0) {
      console.log(`Site ${site.id} - Using zone-calculated count: ${zoneCalculatedCount}`);
      return zoneCalculatedCount;
    }
    
    // Finally, use cached count if available
    if (cachedCount > 0) {
      console.log(`Site ${site.id} - Using cached count: ${cachedCount}`);
      return cachedCount;
    }
    
    console.log(`Site ${site.id} - No valid device count found, returning 0`);
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
