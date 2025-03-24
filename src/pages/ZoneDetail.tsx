
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { fetchZone } from "@/services/api";
import { SidebarWrapper } from "@/components/Dashboard/Sidebar";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from "date-fns";
import { zoneDevicesCache } from "@/services/zones";

const ZoneDetail = () => {
  const { zoneId } = useParams<{ zoneId: string }>();
  
  const { data: zone, isLoading, error } = useQuery({
    queryKey: ["zone", zoneId],
    queryFn: () => fetchZone(Number(zoneId)),
    enabled: !!zoneId,
  });

  console.log("Zone data in ZoneDetail:", zone);

  // Format date
  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return "N/A";
    try {
      return format(new Date(dateString), "MMMM d, yyyy 'at' h:mm a");
    } catch (e) {
      return dateString;
    }
  };

  // Get device count (prioritize cache)
  const getDeviceCount = (zoneId: number | undefined) => {
    if (zoneId && zoneDevicesCache[zoneId] !== undefined && zoneDevicesCache[zoneId] > 0) {
      return zoneDevicesCache[zoneId];
    }
    return zone?.devices || 0;
  };

  // Get status color
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "active":
        return "bg-green-100 text-green-800";
      case "warning":
        return "bg-yellow-100 text-yellow-800";
      case "inactive":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <SidebarWrapper>
      <div className="container mx-auto py-6">
        <Button variant="outline" size="sm" asChild className="mb-6">
          <a href="javascript:history.back()">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </a>
        </Button>

        {isLoading ? (
          <div className="space-y-4">
            <Skeleton className="h-12 w-[250px]" />
            <div className="grid gap-6 md:grid-cols-2">
              <Skeleton className="h-[300px] w-full" />
              <Skeleton className="h-[300px] w-full" />
            </div>
          </div>
        ) : error || !zone ? (
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col items-center justify-center h-40 text-center">
                <p className="text-destructive mb-2">Failed to load zone details</p>
                <p className="text-muted-foreground text-sm">Please try again later or check if the zone exists</p>
              </div>
            </CardContent>
          </Card>
        ) : (
          <>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
              <div>
                <h1 className="text-3xl font-bold mb-2">{zone.name}</h1>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className={getStatusColor(zone.status || "Unknown")}>
                    {zone.status || "Unknown"}
                  </Badge>
                  {zone.type && <Badge variant="secondary">{zone.type}</Badge>}
                </div>
              </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2 mb-8">
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
                          <p className="text-2xl font-bold">{getDeviceCount(zone.id)}</p>
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

              <Card>
                <CardHeader>
                  <CardTitle>Additional Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h3 className="font-medium text-sm text-muted-foreground mb-1">Last Updated</h3>
                    <p>{formatDate(zone.updatedAt)}</p>
                  </div>
                  
                  {zone.fields && zone.fields.length > 0 && (
                    <div>
                      <h3 className="font-medium text-sm text-muted-foreground mb-1">Custom Fields</h3>
                      <div className="border rounded-lg p-3">
                        <pre className="text-xs overflow-auto max-h-48">
                          {JSON.stringify(zone.fields, null, 2)}
                        </pre>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </>
        )}
      </div>
    </SidebarWrapper>
  );
};

export default ZoneDetail;
