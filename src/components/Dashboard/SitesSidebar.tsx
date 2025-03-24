
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
  
  // The default project ID is 1 - we could make this configurable in the future
  const projectId = 1;
  
  const { data: sites = [], isLoading, error } = useQuery({
    queryKey: ["sites-sidebar"],
    queryFn: () => fetchSites(projectId),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Filter out sites with status "Inactive" or "Removed"
  const activeSites = sites.filter(site => 
    site.status !== "Inactive" && site.status !== "Removed"
  );

  useEffect(() => {
    console.log("SitesSidebar: Sites fetched", sites);
    console.log("SitesSidebar: Active sites", activeSites);
  }, [sites, activeSites]);

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
      <div className="py-2.5 px-5 text-sm text-[#8E9196]">
        <div className="flex items-center gap-2 mb-2">
          <AlertTriangle className="h-4 w-4" />
          <span>No sites available for this project</span>
        </div>
        <p className="text-xs text-zinc-400">Try selecting a different project</p>
      </div>
    );
  }

  return (
    <>
      {activeSites.map(site => (
        <Link key={site.id} to={`/site/${site.id}`}>
          <div className={cn(
            "flex items-center justify-between py-2.5 px-5 cursor-pointer hover:bg-[#F5F5F6]",
            activeSiteId === site.id && "bg-[#F9F9FA] font-bold border-l-4 border-primary text-primary"
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
