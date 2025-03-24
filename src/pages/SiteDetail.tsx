import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { fetchSite } from "@/services/api";
import { SidebarWrapper } from "@/components/Dashboard/Sidebar";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from "date-fns";
import { ZonesList } from "@/components/Site/ZonesList";
import { ZonesHierarchyList } from "@/components/Site/ZonesHierarchyList";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { siteDevicesCache } from "@/services/sites";

const SiteDetail = () => {
  const { siteId } = useParams<{ siteId: string }>();
  
  const { data: site, isLoading, error } = useQuery({
    queryKey: ["site", siteId],
    queryFn: () => fetchSite(Number(siteId)),
    enabled: !!siteId,
  });

  console.log("Site data in SiteDetail:", site);
  console.log("Cached device count for this site:", site?.id ? siteDevicesCache[site.id] : "No cache");

  // Format date
  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return "N/A";
    try {
      return format(new Date(dateString), "MMMM d, yyyy 'at' h:mm a");
    } catch (e) {
      return dateString;
    }
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
        ) : error || !site ? (
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col items-center justify-center h-40 text-center">
                <p className="text-destructive mb-2">Failed to load site details</p>
                <p className="text-muted-foreground text-sm">Please try again later or check if the site exists</p>
              </div>
            </CardContent>
          </Card>
        ) : (
          <>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
              <div>
                <h1 className="text-3xl font-bold mb-2">{site.name}</h1>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className={getStatusColor(site.status || "Unknown")}>
                    {site.status || "Unknown"}
                  </Badge>
                  {site.type && <Badge variant="secondary">{site.type}</Badge>}
                </div>
              </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2 mb-8">
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
                          <p className="text-2xl font-bold">{getDeviceCount()}</p>
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

              <Card>
                <CardHeader>
                  <CardTitle>Additional Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h3 className="font-medium text-sm text-muted-foreground mb-1">Last Updated</h3>
                    <p>{formatDate(site.updatedAt)}</p>
                  </div>
                  
                  {site.isEnabledScheduler !== undefined && (
                    <div className="border rounded-md p-3">
                      <h3 className="font-medium text-sm text-muted-foreground mb-1">Scheduler</h3>
                      <Badge variant={site.isEnabledScheduler ? "default" : "outline"}>
                        {site.isEnabledScheduler ? "Enabled" : "Disabled"}
                      </Badge>
                    </div>
                  )}
                  
                  {site.isEnabledCondition !== undefined && (
                    <div className="border rounded-md p-3">
                      <h3 className="font-medium text-sm text-muted-foreground mb-1">Condition</h3>
                      <Badge variant={site.isEnabledCondition ? "default" : "outline"}>
                        {site.isEnabledCondition ? "Enabled" : "Disabled"}
                      </Badge>
                    </div>
                  )}
                  
                  {/* Display any fields that contain energyCalculationField */}
                  {site.fields && site.fields.some(field => field.energyCalculationField) && (
                    <div>
                      <h3 className="font-medium text-sm text-muted-foreground mb-1">Operating Hours</h3>
                      {site.fields
                        .filter(field => field.energyCalculationField)
                        .map((field, index) => {
                          const energy = field.energyCalculationField;
                          return (
                            <div key={index} className="space-y-2">
                              <p>Start: {formatDate(energy.operatingHoursStartTime)}</p>
                              <p>End: {formatDate(energy.operatingHoursEndTime)}</p>
                            </div>
                          );
                        })}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Zones Tabs */}
            <Tabs defaultValue="hierarchy" className="mb-8">
              <TabsList className="mb-4">
                <TabsTrigger value="hierarchy">Hierarchical View</TabsTrigger>
                <TabsTrigger value="list">List View</TabsTrigger>
              </TabsList>
              <TabsContent value="hierarchy">
                <ZonesHierarchyList siteId={site.id} />
              </TabsContent>
              <TabsContent value="list">
                <ZonesList siteId={site.id} />
              </TabsContent>
            </Tabs>
          </>
        )}
      </div>
    </SidebarWrapper>
  );
};

export default SiteDetail;
