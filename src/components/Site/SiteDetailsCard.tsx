import { Site } from "@/services/interfaces";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatDate, getStatusColor } from "@/utils/formatting";
import { useQuery } from "@tanstack/react-query";
import { fetchDevicesCount } from "@/services/devices";
import { Skeleton } from "@/components/ui/skeleton";
import { MapPin, Building2 } from "lucide-react";

interface SiteDetailsCardProps {
  site: Site;
  calculatedDeviceCount: number | null;
}

export function SiteDetailsCard({ site, calculatedDeviceCount }: SiteDetailsCardProps) {
  const { data: deviceCount, isLoading: deviceCountLoading } = useQuery({
    queryKey: ["devices-count", site.id],
    queryFn: () => fetchDevicesCount(site.id),
    enabled: !!site.id,
    staleTime: 5 * 60 * 1000,
  });

  console.log(`SiteDetailsCard: API device count for site ${site.id}: ${deviceCount}`);

  const generateWhat3Words = () => {
    const words = [
      "table", "chair", "lamp", "door", "window", "floor", "wall", "ceiling",
      "book", "pen", "paper", "desk", "phone", "computer", "mouse", "keyboard",
      "plant", "tree", "flower", "grass", "bush", "leaf", "branch", "stem"
    ];
    
    const siteIdNum = typeof site.id === 'string' ? parseInt(site.id, 10) : site.id;
    const seed = siteIdNum || 0;
    
    const word1 = words[(seed * 7) % words.length];
    const word2 = words[(seed * 13) % words.length];
    const word3 = words[(seed * 19) % words.length];
    
    return `${word1}.${word2}.${word3}`;
  };

  const what3Words = generateWhat3Words();

  const openInGoogleMaps = () => {
    if (site.location && site.location.length === 2) {
      const [longitude, latitude] = site.location;
      const googleMapsUrl = `https://www.google.com/maps?q=${latitude},${longitude}`;
      window.open(googleMapsUrl, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <Card className="h-full shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-xl">Site Details</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div className="border rounded-md p-3">
            <h3 className="font-medium text-sm text-muted-foreground mb-1">Site ID</h3>
            <p className="font-medium">{site.id}</p>
          </div>
          <div className="border rounded-md p-3">
            <h3 className="font-medium text-sm text-muted-foreground mb-1">Project ID</h3>
            <p className="font-medium">{site.projectId}</p>
          </div>
        </div>
        
        <div className="border rounded-md p-3">
          <h3 className="font-medium text-sm text-muted-foreground mb-1 flex items-center">
            <MapPin className="h-4 w-4 mr-2 text-primary" />
            Location
          </h3>
          <p>{site.locationText || "No location provided"}</p>
        </div>
        
        {site.location && site.location.length === 2 && (
          <div className="border rounded-md p-3">
            <h3 className="font-medium text-sm text-muted-foreground mb-1 flex items-center">
              <MapPin className="h-4 w-4 mr-2 text-primary" /> 
              what3words
            </h3>
            <Badge variant="outline" className="bg-primary/5 hover:bg-primary/10">
              {what3Words}
            </Badge>
          </div>
        )}
        
        <div className="grid grid-cols-2 gap-4">
          <div className="border rounded-md p-3">
            <div className="flex items-center gap-2 mb-1">
              <Building2 className="h-4 w-4 text-primary" />
              <p className="text-sm font-medium text-muted-foreground">Devices</p>
            </div>
            {deviceCountLoading ? (
              <Skeleton className="h-8 w-16" />
            ) : (
              <p className="text-2xl font-semibold">{deviceCount || 0}</p>
            )}
          </div>
          <div className="border rounded-md p-3">
            <div className="text-sm font-medium text-muted-foreground mb-1">Created</div>
            <p className="font-medium">{formatDate(site.createdAt)}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
