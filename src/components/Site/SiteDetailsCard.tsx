
import { Site } from "@/services/interfaces";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatDate, getStatusColor } from "@/utils/formatting";
import { useQuery } from "@tanstack/react-query";
import { fetchDevicesCount } from "@/services/devices";
import { Skeleton } from "@/components/ui/skeleton";
import { MapPin } from "lucide-react";

interface SiteDetailsCardProps {
  site: Site;
  calculatedDeviceCount: number | null;
}

export function SiteDetailsCard({ site, calculatedDeviceCount }: SiteDetailsCardProps) {
  // Fetch actual device count from the API
  const { data: deviceCount, isLoading: deviceCountLoading } = useQuery({
    queryKey: ["devices-count", site.id],
    queryFn: () => fetchDevicesCount(site.id),
    enabled: !!site.id,
    // Don't refetch unnecessarily
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  console.log(`SiteDetailsCard: API device count for site ${site.id}: ${deviceCount}`);

  // Generate a placeholder what3words format (since we don't have the actual API)
  const generateWhat3Words = () => {
    // This is a mock function - in reality you would use the what3words API
    // Here we're just creating a random but consistent what3words address for demo purposes
    const words = [
      "table", "chair", "lamp", "door", "window", "floor", "wall", "ceiling",
      "book", "pen", "paper", "desk", "phone", "computer", "mouse", "keyboard",
      "plant", "tree", "flower", "grass", "bush", "leaf", "branch", "stem"
    ];
    
    // Use the site ID to make it deterministic
    const siteIdNum = typeof site.id === 'string' ? parseInt(site.id, 10) : site.id;
    const seed = siteIdNum || 0;
    
    // Select three words based on the site ID
    const word1 = words[(seed * 7) % words.length];
    const word2 = words[(seed * 13) % words.length];
    const word3 = words[(seed * 19) % words.length];
    
    return `${word1}.${word2}.${word3}`;
  };

  // Get what3words for this site
  const what3Words = generateWhat3Words();

  // Function to open Google Maps in a new tab
  const openInGoogleMaps = () => {
    if (site.location && site.location.length === 2) {
      const [longitude, latitude] = site.location;
      const googleMapsUrl = `https://www.google.com/maps?q=${latitude},${longitude}`;
      window.open(googleMapsUrl, '_blank', 'noopener,noreferrer');
    }
  };

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
          <p className="flex items-center">
            {site.location && site.location.length === 2 && (
              <MapPin className="h-4 w-4 mr-2 text-primary" />
            )}
            {site.locationText || "No location provided"}
          </p>
        </div>
        {site.location && site.location.length === 2 && (
          <div>
            <h3 className="font-medium text-sm text-muted-foreground mb-1 flex items-center">
              <MapPin className="h-4 w-4 mr-1 text-primary" /> 
              what3words
            </h3>
            <p className="text-sm font-medium">
              <Badge variant="outline" className="bg-primary/5 hover:bg-primary/10">
                {what3Words}
              </Badge>
            </p>
          </div>
        )}
        <div className="pt-2 grid grid-cols-2 gap-4">
          <Card className="bg-muted/40">
            <CardContent className="p-4">
              <div>
                <p className="text-sm font-medium">Devices</p>
                {deviceCountLoading ? (
                  <Skeleton className="h-8 w-16" />
                ) : (
                  <p className="text-2xl font-bold">{deviceCount || 0}</p>
                )}
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
