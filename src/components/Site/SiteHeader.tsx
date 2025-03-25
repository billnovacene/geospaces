
import { Site } from "@/services/interfaces";
import { Badge } from "@/components/ui/badge";
import { getStatusColor } from "@/utils/formatting";
import { Link } from "react-router-dom";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { HomeIcon, Building2, Cpu } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { fetchDevicesCountForSite } from "@/services/device-sites";

interface SiteHeaderProps {
  site: Site;
}

export function SiteHeader({ site }: SiteHeaderProps) {
  // Fetch device count for this site
  const { data: deviceCount = 0 } = useQuery({
    queryKey: ["devices-count", site.id],
    queryFn: () => fetchDevicesCountForSite(site.id),
    enabled: !!site.id,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  return (
    <div className="space-y-6">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link to="/" className="flex items-center">
                <HomeIcon className="h-3.5 w-3.5" />
              </Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage className="flex items-center gap-1.5">
              <Building2 className="h-3.5 w-3.5 text-[#6CAE3E]" />
              <span>{site.name}</span>
            </BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-medium text-gray-800 mb-2">{site.name}</h1>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className={getStatusColor(site.status || "Unknown")}>
              {site.status || "Unknown"}
            </Badge>
            {site.type && <Badge variant="secondary">{site.type}</Badge>}
            <Badge variant="outline" className="bg-[#6CAE3E]/10 text-[#6CAE3E] border-[#6CAE3E]/20 flex items-center gap-1">
              <Cpu className="h-3.5 w-3.5 mr-0.5" />
              <span>{deviceCount} {deviceCount === 1 ? 'Device' : 'Devices'}</span>
            </Badge>
          </div>
        </div>
      </div>
    </div>
  );
}
