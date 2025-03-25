
import React from "react";
import { Link } from "react-router-dom";
import { Building, Cpu } from "lucide-react";
import { cn } from "@/lib/utils";
import { SiteStatusBadge } from "@/components/Dashboard/SiteStatusBadge";
import { Site } from "@/services/interfaces";
import { useQuery } from "@tanstack/react-query";
import { fetchDevicesCountForSite } from "@/services/device-sites";

interface SiteListItemProps {
  site: Site;
  isActive?: boolean;
  linkTo?: string;
}

export const SiteListItem = ({ 
  site, 
  isActive = false,
  linkTo 
}: SiteListItemProps) => {
  const defaultLink = `/site/${site.id}`;
  const sitePath = linkTo || defaultLink;

  // Fetch device count for this site
  const { data: deviceCount = 0 } = useQuery({
    queryKey: ["devices-count-sidebar", site.id],
    queryFn: () => fetchDevicesCountForSite(site.id),
    enabled: !!site.id,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  return (
    <Link to={sitePath} className="block">
      <div className={cn(
        "flex items-center justify-between py-2.5 px-5 cursor-pointer hover:bg-[#F5F5F6]",
        isActive && "bg-[#F9F9FA] border-l-4 border-primary"
      )}>
        <div className="flex items-center gap-2">
          <Building className={cn(
            "h-4 w-4",
            isActive ? "text-primary" : "text-zinc-600"
          )} />
          <span className={cn(
            "text-sm font-medium text-gray-900",
            isActive && "text-primary"
          )}>
            {site.name}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <SiteStatusBadge status={site.status || "Active"} />
          <span className="text-xs text-[#6CAE3E] flex items-center">
            <Cpu className="h-3 w-3 mr-0.5" />
            {deviceCount}
          </span>
        </div>
      </div>
    </Link>
  );
};
