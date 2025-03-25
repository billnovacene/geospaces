
import { Link } from "react-router-dom";
import { ArrowUpDown, ExternalLink, Cpu } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { SiteStatusBadge } from "./SiteStatusBadge";
import { formatDate } from "@/utils/formatting";
import { Site } from "@/services/interfaces";
import { useQuery } from "@tanstack/react-query";
import { fetchDevicesCountForSite } from "@/services/device-sites";

interface SitesTableProps {
  sites: Site[];
}

export function SitesTable({ sites }: SitesTableProps) {
  return (
    <div className="rounded-md border overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-gray-50">
            <TableHead className="w-[350px]">
              <div className="flex items-center">
                <span>Site Name</span>
                <ArrowUpDown className="ml-2 h-4 w-4" />
              </div>
            </TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Devices</TableHead>
            <TableHead>Created</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sites.map((site) => (
            <SiteTableRow key={site.id} site={site} />
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

// Separated into its own component to allow for per-row queries
function SiteTableRow({ site }: { site: Site }) {
  // Fetch device count for this site using the same pattern as in SiteListItem
  const { data: deviceCount = 0 } = useQuery({
    queryKey: ["devices-count-table", site.id],
    queryFn: () => fetchDevicesCountForSite(site.id),
    enabled: !!site.id,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  return (
    <TableRow key={site.id}>
      <TableCell className="font-medium">
        <Link to={`/site/${site.id}`} className="text-blue-500 hover:underline">
          {site.name}
        </Link>
      </TableCell>
      <TableCell>
        <SiteStatusBadge status={site.status || "Unknown"} />
      </TableCell>
      <TableCell>
        <div className="flex items-center gap-1 bg-[#6CAE3E]/10 text-[#6CAE3E] border-[#6CAE3E]/20 px-2 py-1 rounded-md text-xs w-fit">
          <Cpu className="h-3.5 w-3.5 mr-0.5" />
          {deviceCount}
        </div>
      </TableCell>
      <TableCell>{formatDate(site.createdAt)}</TableCell>
      <TableCell className="text-right">
        <div className="flex justify-end gap-2">
          <Link
            to={`/site/${site.id}`}
            className="inline-flex h-8 items-center justify-center rounded-md border border-input p-2 text-sm font-medium ring-offset-background transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
          >
            <ExternalLink className="h-4 w-4" />
            <span className="sr-only">View Site</span>
          </Link>
        </div>
      </TableCell>
    </TableRow>
  );
}
