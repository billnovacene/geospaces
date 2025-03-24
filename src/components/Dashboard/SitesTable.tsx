
import { format } from "date-fns";
import { MapPin, Building2, Cpu } from "lucide-react";
import { Link } from "react-router-dom";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { SiteStatusBadge } from "./SiteStatusBadge";
import { siteDevicesCache } from "@/services/sites";
import { Site } from "@/services/interfaces";

interface SitesTableProps {
  sites: any[];
}

export function SitesTable({ sites }: SitesTableProps) {
  // Format date
  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "MMM d, yyyy");
    } catch (e) {
      return dateString;
    }
  };

  // Get device count (prioritize cache)
  const getDeviceCount = (site: any) => {
    if (site.id && siteDevicesCache[site.id] !== undefined && siteDevicesCache[site.id] > 0) {
      console.log(`Using cached device count for site ${site.id}: ${siteDevicesCache[site.id]}`);
      return siteDevicesCache[site.id];
    }
    console.log(`Using direct device count for site ${site.id}: ${site.devices}`);
    return typeof site.devices === 'number' ? site.devices : parseInt(String(site.devices), 10) || 0;
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
                  <div className="flex items-center">
                    <MapPin className="h-3.5 w-3.5 mr-1 text-muted-foreground" />
                    <span className="text-muted-foreground truncate max-w-[200px]" title={site.locationText}>
                      {site.locationText}
                    </span>
                  </div>
                ) : (
                  "No location"
                )}
              </TableCell>
              <TableCell>
                <div className="flex items-center">
                  <Cpu className="h-3.5 w-3.5 mr-1 text-muted-foreground" />
                  <span>{deviceCount}</span>
                </div>
              </TableCell>
              <TableCell>{formatDate(site.createdAt)}</TableCell>
              <TableCell>
                <SiteStatusBadge status={site.status || "Unknown"} />
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
