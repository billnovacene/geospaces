
import { useParams, useLocation } from "react-router-dom";
import { Link } from "react-router-dom";
import { ExternalLink } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { SiteListItem } from "./SiteListItem";
import { SitesSidebarError } from "./SitesSidebarError";
import { SitesSidebarEmpty } from "./SitesSidebarEmpty";
import { useSitesList } from "@/hooks/useSitesList";

interface SitesSidebarProps {
  preserveDashboardRoute?: boolean;
  currentDashboard?: string;
}

export function SitesSidebar({
  preserveDashboardRoute = false,
  currentDashboard = ""
}: SitesSidebarProps) {
  const { siteId } = useParams<{ siteId: string }>();
  const location = useLocation();
  const activeSiteId = siteId ? Number(siteId) : null;
  
  // Get the current dashboard path if needed
  const getDashboardPath = () => {
    if (!preserveDashboardRoute) return '';
    
    if (currentDashboard === "temp-humidity") {
      return '/dashboard/temp-humidity';
    } else if (location.pathname.includes('/dashboard')) {
      return '/dashboard';
    }
    
    return '';
  };
  
  const dashboardPath = getDashboardPath();
  
  // Use project ID 145 instead of 1
  const projectId = 145;
  
  const { activeSites, sites, isLoading, error, refetch } = useSitesList(projectId);
  
  console.log(`SitesSidebar: Rendering with ${sites.length} total sites, ${activeSites.length} active sites`);
  console.log(`Preserving dashboard: ${preserveDashboardRoute}, dashboardPath=${dashboardPath}`);

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
    return <SitesSidebarError onRetry={refetch} />;
  }

  // If no sites are available, show empty state with more context
  if (activeSites.length === 0) {
    return <SitesSidebarEmpty 
      onRetry={refetch} 
      projectId={projectId}
      isLoading={isLoading}
      error={error}
    />;
  }

  return (
    <div className="site-listing">
      <div className="py-2 px-5 mb-2 text-sm font-medium text-zinc-500">
        Project: Zircon ({activeSites.length} sites)
      </div>
      
      {activeSites.map(site => (
        <SiteListItem 
          key={site.id}
          site={site}
          isActive={activeSiteId === site.id}
          linkTo={preserveDashboardRoute && dashboardPath ? `/site/${site.id}${dashboardPath}` : undefined}
        />
      ))}
    </div>
  );
}
