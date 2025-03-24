
import { Link, useParams } from "react-router-dom";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { HomeIcon, Building, Package } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { fetchSite } from "@/services/sites";
import { fetchZone } from "@/services/zones";

export function BreadcrumbNav() {
  const { siteId, zoneId } = useParams<{ siteId: string; zoneId: string }>();
  
  // Fetch site data if siteId is available
  const { data: site } = useQuery({
    queryKey: ["site", siteId],
    queryFn: () => fetchSite(Number(siteId)),
    enabled: !!siteId,
  });
  
  // Fetch zone data if zoneId is available
  const { data: zone } = useQuery({
    queryKey: ["zone", zoneId],
    queryFn: () => fetchZone(Number(zoneId)),
    enabled: !!zoneId,
  });

  // Fetch parent zone if current zone has a parent
  const { data: parentZone } = useQuery({
    queryKey: ["parent-zone", zone?.parent],
    queryFn: () => fetchZone(Number(zone?.parent)),
    enabled: !!zone?.parent,
  });

  return (
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
        
        {zone && (
          <>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link to={`/zone/${zone.id}`}>
                  <span className="flex items-center gap-1">
                    <Package className="h-3.5 w-3.5" />
                    <span>{zone.name}</span>
                  </span>
                </Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
          </>
        )}
        
        <BreadcrumbItem>
          <BreadcrumbPage>Temperature & Humidity</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  );
}
