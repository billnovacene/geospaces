
import { Site } from "@/services/interfaces";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatDate, getStatusColor } from "@/utils/formatting";
import { useQuery } from "@tanstack/react-query";
import { fetchDevicesCount } from "@/services/devices";
import { Skeleton } from "@/components/ui/skeleton";
import { Cpu } from "lucide-react";

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
                <p className="text-sm font-medium flex items-center gap-1.5">
                  <Cpu className="h-4 w-4 text-[#6CAE3E]" />
                  Devices
                </p>
                {deviceCountLoading ? (
                  <Skeleton className="h-8 w-16" />
                ) : (
                  <p className="text-2xl font-bold text-[#6CAE3E]">{deviceCount || 0}</p>
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
