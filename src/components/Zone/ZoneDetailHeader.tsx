import { Badge } from "@/components/ui/badge";
import { Zone } from "@/services/interfaces";
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
import { HomeIcon, Building, Package } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { fetchSite } from "@/services/sites";
import { fetchZone } from "@/services/zones";

interface ZoneDetailHeaderProps {
  zone: Zone;
}

export const ZoneDetailHeader = ({ zone }: ZoneDetailHeaderProps) => {
  // Fetch site data for the zone
  const { data: site } = useQuery({
    queryKey: ["site-for-zone", zone.siteId],
    queryFn: () => fetchSite(Number(zone.siteId)),
    enabled: !!zone.siteId,
  });

  // Fetch parent zone if current zone has a parent
  const { data: parentZone } = useQuery({
    queryKey: ["parent-zone", zone.parent],
    queryFn: () => fetchZone(Number(zone.parent)),
    enabled: !!zone.parent,
  });

  return (
    <>
      <div className="mb-8">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link to="/">
                  <HomeIcon className="h-3.5 w-3.5" />
                </Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            
            {site && (
              <>
                <BreadcrumbItem>
                  <BreadcrumbLink asChild>
                    <Link to={`/site/${site.id}`}>
                      <span className="flex items-center gap-1">
                        <Building className="h-3.5 w-3.5" />
                        <span>{site.name}</span>
                      </span>
                    </Link>
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
              </>
            )}
            
            {parentZone && (
              <>
                <BreadcrumbItem>
                  <BreadcrumbLink asChild>
                    <Link to={`/zone/${parentZone.id}`}>
                      <span className="flex items-center gap-1">
                        <Package className="h-3.5 w-3.5" />
                        <span>{parentZone.name}</span>
                      </span>
                    </Link>
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
              </>
            )}
            
            <BreadcrumbItem>
              <BreadcrumbPage>
                <span className="flex items-center gap-1">
                  <Package className="h-3.5 w-3.5" />
                  <span>{zone.name}</span>
                </span>
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
        <div>
          <h1 className="text-3xl font-normal text-gray-800 mb-3">{zone.name}</h1>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className={getStatusColor(zone.status || "Unknown")}>
              {zone.status || "Unknown"}
            </Badge>
            {zone.type && <Badge variant="secondary">{zone.type}</Badge>}
          </div>
        </div>
      </div>
    </>
  );
}
