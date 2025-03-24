
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { fetchSites } from "@/services/sites";
import { Site } from "@/services/interfaces";

export function useSitesList(projectId: number) {
  const { 
    data: sites = [], 
    isLoading, 
    error, 
    refetch
  } = useQuery({
    queryKey: ["sites-sidebar", projectId],
    queryFn: () => fetchSites(projectId),
    staleTime: 5 * 60 * 1000, // 5 minutes
    enabled: !!projectId, // Only run the query if projectId is valid
  });

  // Filter out sites with status "Inactive" or "Removed"
  const activeSites = sites.filter(site => 
    site.status !== "Inactive" && site.status !== "Removed"
  );

  useEffect(() => {
    console.log(`SitesSidebar: Sites fetched for projectId=${projectId}`, sites);
    console.log("SitesSidebar: Active sites", activeSites);
    
    if (sites.length === 0) {
      console.log("SitesSidebar: No sites found for this project");
    }
  }, [sites, activeSites, projectId]);

  return {
    sites,
    activeSites,
    isLoading,
    error,
    refetch
  };
}
