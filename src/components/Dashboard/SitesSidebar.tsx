
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchSites } from "@/services/sites";
import { Link, useParams } from "react-router-dom";
import { AlertTriangle, Building } from "lucide-react";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

export function SitesSidebar() {
  const { siteId } = useParams<{ siteId: string }>();
  const activeSiteId = siteId ? Number(siteId) : null;
  
  const { data: sites = [], isLoading, error } = useQuery({
    queryKey: ["sites-sidebar"],
    queryFn: () => fetchSites(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Filter out sites with status "Inactive" or "Removed"
  const activeSites = sites.filter(site => 
    site.status !== "Inactive" && site.status !== "Removed"
  );

  if (isLoading) {
    return (
      <div className="py-2 px-5">
        <Skeleton className="h-8 w-full mb-2" />
        <Skeleton className="h-8 w-full mb-2" />
        <Skeleton className="h-8 w-full" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-2.5 px-5 text-sm text-red-500 flex items-center gap-2">
        <AlertTriangle className="h-4 w-4" />
        <span>Error loading sites</span>
      </div>
    );
  }

  if (activeSites.length === 0) {
    return (
      <div className="py-2.5 px-5 text-sm text-[#8E9196]">No sites available</div>
    );
  }

  return (
    <>
      {activeSites.map(site => (
        <Link key={site.id} to={`/site/${site.id}`}>
          <div className={cn(
            "flex items-center justify-between py-2.5 px-5 cursor-pointer hover:bg-[#F5F5F6]",
            activeSiteId === site.id && "bg-[#F9F9FA]"
          )}>
            <div className="flex items-center gap-2">
              <Building className="h-4 w-4 text-[#8E9196]" />
              <span className="text-sm font-medium text-gray-900">{site.name}</span>
            </div>
            <span className="text-sm text-[#8E9196]">
              {typeof site.devices === 'number' ? site.devices : 0}
            </span>
          </div>
        </Link>
      ))}
    </>
  );
}
