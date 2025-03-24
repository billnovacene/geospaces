
import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import { ExternalLink } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { SiteListItem } from "./SiteListItem";
import { SitesSidebarError } from "./SitesSidebarError";
import { SitesSidebarEmpty } from "./SitesSidebarEmpty";
import { useSitesList } from "@/hooks/useSitesList";

export function SitesSidebar() {
  const { siteId } = useParams<{ siteId: string }>();
  const activeSiteId = siteId ? Number(siteId) : null;
  
  // The default project ID is 1 - we could make this configurable in the future
  const projectId = 1;
  
  const { activeSites, isLoading, error, refetch } = useSitesList(projectId);

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

  // If no sites are available, show empty state
  if (activeSites.length === 0) {
    return <SitesSidebarEmpty />;
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
        />
      ))}

      <div className="mt-3 px-5 py-2 border-t border-zinc-100">
        <Link to="/" className="flex items-center gap-1.5 text-xs text-primary hover:underline">
          <ExternalLink className="h-3 w-3" />
          <span>View all projects</span>
        </Link>
      </div>
    </div>
  );
}
