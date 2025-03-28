
import React from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { useQuery } from "@tanstack/react-query";
import { fetchSite } from "@/services/sites";
import { fetchZone } from "@/services/zones";
import { HomeIcon, Building, Package, Droplet, Thermometer } from "lucide-react";

interface GlobalBreadcrumbNavProps {
  customDashboardType?: string;
}

export function GlobalBreadcrumbNav({ customDashboardType }: GlobalBreadcrumbNavProps) {
  const { siteId, zoneId } = useParams<{ siteId: string; zoneId: string }>();
  const location = useLocation();
  
  // Determine dashboard type based on URL
  const isDampMoldDashboard = customDashboardType === "damp-mold" || location.pathname.includes("damp-mold");
  const dashboardType = isDampMoldDashboard ? "Damp & Mold" : "Temperature & Humidity";
  const DashboardIcon = isDampMoldDashboard ? Droplet : Thermometer;
  
  // Fetch site data if siteId is available
  const { data: site } = useQuery({
    queryKey: ["breadcrumb-site", siteId],
    queryFn: () => fetchSite(Number(siteId)),
    enabled: !!siteId,
  });
  
  // Fetch zone data if zoneId is available
  const { data: zone } = useQuery({
    queryKey: ["breadcrumb-zone", zoneId],
    queryFn: () => fetchZone(Number(zoneId)),
    enabled: !!zoneId,
  });

  // Fetch parent zone if current zone has a parent
  const { data: parentZone } = useQuery({
    queryKey: ["breadcrumb-parent-zone", zone?.parent],
    queryFn: () => fetchZone(Number(zone?.parent)),
    enabled: !!zone?.parent,
  });

  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <Link to="/">
              <span className="flex items-center">
                <HomeIcon className="h-3.5 w-3.5 mr-1" />
                <span>Project</span>
              </span>
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
          <BreadcrumbPage>
            <span className="flex items-center gap-1">
              <DashboardIcon className="h-3.5 w-3.5" />
              <span>{dashboardType}</span>
            </span>
          </BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  );
}
