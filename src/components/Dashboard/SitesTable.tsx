
import { format } from "date-fns";
import { MapPin, Building2, Cpu, Server } from "lucide-react";
import { Link } from "react-router-dom";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { SiteStatusBadge } from "./SiteStatusBadge";
import { siteDevicesCache } from "@/services/sites";
import { Site } from "@/services/interfaces";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useEffect, useState } from "react";
import { fetchDevicesCountForSite } from "@/services/device-sites";
import { Badge } from "@/components/ui/badge";

interface SitesTableProps {
  sites: Site[];
}

export function SitesTable({ sites }: SitesTableProps) {
  // Store fetched device counts
  const [deviceCounts, setDeviceCounts] = useState<Record<number, number | null>>({});
  const [loadingCounts, setLoadingCounts] = useState<Record<number, boolean>>({});

  // Fetch device counts for all sites when component mounts
  useEffect(() => {
    const fetchAllDeviceCounts = async () => {
      // Create initial loading state for all sites
      const initialLoadingState: Record<number, boolean> = {};
      sites.forEach(site => {
        if (site.id) {
          initialLoadingState[site.id] = true;
        }
      });
      setLoadingCounts(initialLoadingState);
      
      // Fetch counts for each site
      for (const site of sites) {
        if (site.id) {
          try {
            console.log(`Fetching device count for site ${site.id}...`);
            const count = await fetchDevicesCountForSite(site.id);
            
            setDeviceCounts(prev => ({
              ...prev,
              [site.id]: count
            }));
          } catch (error) {
            console.error(`Error fetching device count for site ${site.id}:`, error);
          } finally {
            setLoadingCounts(prev => ({
              ...prev,
              [site.id]: false
            }));
          }
        }
      }
    };
    
    fetchAllDeviceCounts();
  }, [sites]);

  // Format date
  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "MMM d, yyyy");
    } catch (e) {
      return dateString;
    }
  };

  // Get device count (prioritize cache)
  const getDeviceCount = (site: Site) => {
    // First check if we have a freshly fetched count
    if (site.id && deviceCounts[site.id] !== undefined) {
      return deviceCounts[site.id];
    }
    
    // Then check our cache
    if (site.id && siteDevicesCache[site.id] !== undefined && siteDevicesCache[site.id] > 0) {
      console.log(`Using cached device count for site ${site.id}: ${siteDevicesCache[site.id]}`);
      return siteDevicesCache[site.id];
    }
    
    // Fall back to the site's direct device count
    const directCount = typeof site.devices === 'number' 
      ? site.devices 
      : parseInt(String(site.devices), 10) || 0;
    
    console.log(`Using direct device count for site ${site.id}: ${directCount}`);
    return directCount;
  };

  // Get status description based on status
  const getStatusDescription = (status: string) => {
    switch (status.toLowerCase()) {
      case "active":
        return "The site is operational and running normally.";
      case "warning":
        return "The site has some issues that need attention.";
      case "inactive":
        return "The site is currently not operational.";
      default:
        return "Status information is unavailable.";
    }
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Type</TableHead>
          <TableHead>Location</TableHead>
          <TableHead>Devices</TableHead>
          <TableHead>Created</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {sites.map((site) => {
          const deviceCount = getDeviceCount(site);
          const isLoading = site.id ? loadingCounts[site.id] : false;
          
          return (
            <TableRow key={site.id}>
              <TableCell className="font-medium">{site.name}</TableCell>
              <TableCell>
                <div className="flex items-center">
                  <Building2 className="h-3.5 w-3.5 mr-1 text-muted-foreground" />
                  <span>{site.type || "N/A"}</span>
                </div>
              </TableCell>
              <TableCell>
                {site.locationText ? (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="flex items-center cursor-help">
                        <MapPin className="h-3.5 w-3.5 mr-1 text-muted-foreground" />
                        <span className="text-muted-foreground truncate max-w-[200px]">
                          {site.locationText}
                        </span>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{site.locationText}</p>
                    </TooltipContent>
                  </Tooltip>
                ) : (
                  "No location"
                )}
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-1">
                  <Server className="h-3.5 w-3.5 text-muted-foreground" />
                  {isLoading ? (
                    <span className="text-muted-foreground text-sm">Loading...</span>
                  ) : (
                    <Badge variant="secondary" className="font-semibold">
                      {deviceCount || 0}
                    </Badge>
                  )}
                </div>
              </TableCell>
              <TableCell>{formatDate(site.createdAt)}</TableCell>
              <TableCell>
                <HoverCard>
                  <HoverCardTrigger asChild>
                    <div>
                      <SiteStatusBadge status={site.status || "Unknown"} />
                    </div>
                  </HoverCardTrigger>
                  <HoverCardContent className="w-80">
                    <div className="space-y-1">
                      <h4 className="text-sm font-semibold">Site Status: {site.status || "Unknown"}</h4>
                      <p className="text-sm">{getStatusDescription(site.status || "Unknown")}</p>
                      {site.warning && (
                        <p className="text-sm text-yellow-600 mt-2">Warning: {site.warning}</p>
                      )}
                    </div>
                  </HoverCardContent>
                </HoverCard>
              </TableCell>
              <TableCell className="text-right">
                <Button variant="outline" size="sm" asChild>
                  <Link to={`/site/${site.id}`}>View Details</Link>
                </Button>
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}
