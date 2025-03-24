
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

  // Ensure we're working with an array
  const sitesArray = Array.isArray(sites) ? sites : [];
  
  // Log all sites to see what we're getting
  console.log(`SitesList: Raw sites data for projectId=${projectId}:`, sitesArray);
  
  // Filter out sites with status "Inactive" or "Removed"
  const activeSites = sitesArray.filter(site => 
    site.status !== "Inactive" && site.status !== "Removed"
  );

  useEffect(() => {
    console.log(`SitesSidebar: Sites fetched for projectId=${projectId}`, sitesArray);
    console.log("SitesSidebar: Active sites after filtering:", activeSites);
    
    if (sitesArray.length === 0) {
      console.log("SitesSidebar: No sites found for this project");
    }
    
    // Log each site's status to debug filtering issues
    sitesArray.forEach(site => {
      console.log(`Site ${site.id} (${site.name}) status: ${site.status}, isRemoved: ${site.isRemoved}`);
    });
  }, [sitesArray, activeSites, projectId]);

  return {
    sites: sitesArray,
    activeSites,
    isLoading,
    error,
    refetch
  };
}
