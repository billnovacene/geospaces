
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { AlertTriangle, Building } from "lucide-react";
import { fetchSites } from "@/services/sites";
import { Site } from "@/services/interfaces";

export function SitesSidebar() {
  const location = useLocation();
  const siteId = location.pathname.includes('/site/') ? Number(location.pathname.split('/site/')[1]) : null;
  
  // Use a default project ID for initial load
  // In a real app, you might want to fetch the active project or have a project selector
  const defaultProjectId = 145; // Using the project ID from your API responses
  
  // Fetch sites for the sidebar
  const { data: sites = [], isLoading, error } = useQuery({
    queryKey: ["sites-sidebar", defaultProjectId],
    queryFn: () => fetchSites(defaultProjectId),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
  
  if (isLoading) {
    return (
      <div className="py-2.5 px-5 text-sm text-[#8E9196]">Loading sites...</div>
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
  
  if (sites.length === 0) {
    return (
      <div className="py-2.5 px-5 text-sm text-[#8E9196]">No sites available</div>
    );
  }
  
  return (
    <>
      <Link to="/" className="block">
        <div className="bg-[#F9F9FA] py-2.5 px-5 cursor-pointer hover:bg-[#F5F5F6]">
          <span className="font-medium text-sm text-zinc-950">All sites</span>
        </div>
      </Link>
      
      {sites.map(site => (
        <div key={site.id}>
          <div 
            className={cn(
              "flex items-center justify-between py-2.5 px-5 cursor-pointer bg-white sidebar-hover-item",
              siteId === site.id && "bg-[#F9F9FA]"
            )}
          >
            <div className="flex items-center gap-2">
              <Building className="h-4 w-4 text-[#8E9196]" />
              <Link 
                to={`/site/${site.id}`}
                className="text-sm font-medium text-gray-900"
              >
                {site.name}
              </Link>
            </div>
            <span className="text-sm text-[#8E9196]">{site.devices || 0}</span>
          </div>
        </div>
      ))}
    </>
  );
}
