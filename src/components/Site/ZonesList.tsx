
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchZones } from "@/services/api";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Search, Map, AlertTriangle, Home } from "lucide-react";
import { Input } from "@/components/ui/input";
import { format } from "date-fns";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { zoneDevicesCache } from "@/services/zones";
import { getStatusInfo, getDeviceCount } from "@/utils/zones";
import { ZonesErrorState } from "@/components/Zone/ZonesErrorState";
import { ZonesEmptyState } from "@/components/Zone/ZonesEmptyState";

interface ZonesListProps {
  siteId?: number;
}

export function ZonesList({ siteId }: ZonesListProps) {
  const [searchTerm, setSearchTerm] = useState("");
  
  const { data: zones = [], isLoading, error } = useQuery({
    queryKey: ["zones", siteId],
    queryFn: () => siteId ? fetchZones(siteId) : Promise.resolve([]),
    enabled: !!siteId,
  });

  // Filter zones based on search term
  const filteredZones = zones.filter(zone => 
    zone.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    (zone.type && zone.type.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Format date
  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "MMM d, yyyy");
    } catch (e) {
      return dateString;
    }
  };

  // Render the appropriate status icon based on the icon name
  const renderStatusIcon = (iconName: string | null) => {
    if (iconName === "AlertTriangle") {
      return <AlertTriangle className="h-3.5 w-3.5 mr-1" />;
    }
    return null;
  };

  if (error) {
    return <ZonesErrorState />;
  }

  return (
    <Card className="dashboard-card overflow-hidden">
      <CardHeader className="pb-4">
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
          <div>
            <CardTitle className="text-2xl font-bold">Zones</CardTitle>
            <CardDescription>
              View and manage zones for this site
            </CardDescription>
          </div>
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search zones..."
              className="pl-8 max-w-xs"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="flex items-center gap-4 p-4 border rounded-md">
                <div className="space-y-2">
                  <Skeleton className="h-5 w-40" />
                  <Skeleton className="h-4 w-24" />
                </div>
                <div className="ml-auto">
                  <Skeleton className="h-6 w-20" />
                </div>
              </div>
            ))}
          </div>
        ) : !siteId ? (
          <ZonesEmptyState siteId={siteId} searchTerm={searchTerm} />
        ) : filteredZones.length === 0 ? (
          <ZonesEmptyState siteId={siteId} searchTerm={searchTerm} />
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Devices</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredZones.map((zone) => {
                const statusInfo = getStatusInfo(zone.status || "Unknown");
                const deviceCount = getDeviceCount(zone);
                
                return (
                  <TableRow key={zone.id}>
                    <TableCell className="font-medium">{zone.name}</TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <Home className="h-3.5 w-3.5 mr-1 text-muted-foreground" />
                        <span>{zone.type || "N/A"}</span>
                      </div>
                    </TableCell>
                    <TableCell>{deviceCount}</TableCell>
                    <TableCell>{formatDate(zone.createdAt)}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className={statusInfo.color}>
                        {renderStatusIcon(statusInfo.icon)}
                        {zone.status || "Unknown"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="outline" size="sm" asChild>
                        <Link to={`/zone/${zone.id}`}>View Details</Link>
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        )}
      </CardContent>
      {siteId && zones.length > 0 && (
        <CardFooter className="border-t p-4 text-sm text-muted-foreground flex justify-between items-center">
          <div>Total zones: {zones.length}</div>
          <div>Showing {filteredZones.length} of {zones.length}</div>
        </CardFooter>
      )}
    </Card>
  );
}
