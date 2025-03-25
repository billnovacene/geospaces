
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Zone } from "@/services/interfaces";
import { formatDate } from "@/utils/formatting";
import { Badge } from "@/components/ui/badge";

interface ZoneDetailsCardProps {
  zone: Zone;
  deviceCount: number | undefined;
  deviceCountLoading: boolean;
}

export const ZoneDetailsCard = ({ zone, deviceCount, deviceCountLoading }: ZoneDetailsCardProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Zone Details</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <h3 className="font-medium text-sm text-muted-foreground mb-1">Zone ID</h3>
          <p>{zone.id}</p>
        </div>
        <div>
          <h3 className="font-medium text-sm text-muted-foreground mb-1">Site ID</h3>
          <p>{zone.siteId}</p>
        </div>
        {zone.description && (
          <div>
            <h3 className="font-medium text-sm text-muted-foreground mb-1">Description</h3>
            <p>{zone.description}</p>
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
                <p className="text-sm">{formatDate(zone.createdAt)}</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </CardContent>
    </Card>
  );
};
