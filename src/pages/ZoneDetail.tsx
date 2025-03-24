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

  const { data: deviceCount, isLoading: deviceCountLoading } = useQuery({
    queryKey: ["zone-devices", zoneId],
    queryFn: () => fetchDevicesCountForZone(Number(zoneId)),
    enabled: !!zoneId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  console.log("Zone data in ZoneDetail:", zone);
  console.log("Zone location data:", zone?.location);
  console.log("Zone device count from API:", deviceCount);

  const calculateArea = () => {
    if (!zone?.location || !Array.isArray(zone.location) || zone.location.length < 3) {
      return null;
    }

    try {
      let area = 0;
      const coordinates = zone.location;
      
      console.log("Coordinates format:", coordinates);
      
      if (!coordinates.every(coord => Array.isArray(coord) && coord.length >= 2)) {
        console.log("Coordinates not in expected format");
        return null;
      }
      
      for (let i = 0; i < coordinates.length; i++) {
        const j = (i + 1) % coordinates.length;
        area += coordinates[i][0] * coordinates[j][1];
        area -= coordinates[j][0] * coordinates[i][1];
      }
      
      area = Math.abs(area) / 2;
      console.log("Calculated area:", area);
      
      if (area < 0.000001) {
        return null;
      }
      
      return area.toFixed(2);
    } catch (error) {
      console.error("Error calculating area:", error);
      return null;
    }
  };

  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return "N/A";
    try {
      return format(new Date(dateString), "MMMM d, yyyy 'at' h:mm a");
    } catch (e) {
      return dateString;
    }
  };

  const formatLocation = () => {
    if (!zone?.location) return null;
    
    try {
      return (
        <div className="border rounded-lg p-3">
          <pre className="text-xs overflow-auto max-h-48">
            {JSON.stringify(zone.location, null, 2)}
          </pre>
        </div>
      );
    } catch (e) {
      return "Error displaying location data";
    }
  };

  const areaValue = calculateArea();

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
                  
                  {areaValue && (
                    <Card className="bg-muted/40">
                      <CardContent className="p-4">
                        <div>
                          <p className="text-sm font-medium">Area</p>
                          <p className="text-2xl font-bold">{areaValue} m²</p>
                        </div>
                      </CardContent>
                    </Card>
                  )}
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
                  
                  {zone.location && (
                    <div>
                      <h3 className="font-medium text-sm text-muted-foreground mb-1">Location Data</h3>
                      {formatLocation()}
                    </div>
                  )}
                  
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
