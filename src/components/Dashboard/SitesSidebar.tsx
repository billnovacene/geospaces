
import { useParams, useLocation } from "react-router-dom";
import { Link } from "react-router-dom";
import { Circle } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { SitesSidebarError } from "./SitesSidebarError";
import { SitesSidebarEmpty } from "./SitesSidebarEmpty";
import { useSitesList } from "@/hooks/useSitesList";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronUp, ChevronDown } from "lucide-react";
import { useState, useEffect } from "react";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { ZonesHierarchy } from "./ZonesHierarchy";

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
  const [isOpen, setIsOpen] = useState(true);
  const [expandedSiteId, setExpandedSiteId] = useState<number | null>(null);
  
  // When a site is selected, expand it to show zones
  useEffect(() => {
    if (activeSiteId) {
      console.log("🔍 Auto-expanding site in sidebar:", activeSiteId);
      setExpandedSiteId(activeSiteId);
    }
  }, [activeSiteId]);
  
  const projectId = 145;
  
  const { activeSites, sites, isLoading, error, refetch } = useSitesList(projectId);
  
  console.log(`🏢 SitesSidebar: Rendering with ${sites.length} total sites, ${activeSites.length} active sites`);
  console.log(`🌐 SitesSidebar: Active site ID: ${activeSiteId}, Expanded site ID: ${expandedSiteId}`);
  
  // Toggle expanded state for a site
  const toggleSiteExpanded = (id: number, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    console.log(`🔀 Toggling site expansion: ${id}`);
    setExpandedSiteId(expandedSiteId === id ? null : id);
  };

  // Define the dashboard path based on the current dashboard
  const dashboardPath = preserveDashboardRoute && currentDashboard 
    ? `/dashboard/${currentDashboard}` 
    : '';

  return (
    <Collapsible 
      open={isOpen}
      onOpenChange={setIsOpen}
      className="w-full"
    >
      <CollapsibleTrigger className="w-full">
        <div className="py-3 px-4 text-xs text-[#8E9196] dark:text-gray-300 uppercase tracking-wide flex items-center justify-between bg-white dark:bg-gray-800 cursor-pointer">
          <span>Sites</span>
          <span>
            {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </span>
        </div>
      </CollapsibleTrigger>
      <CollapsibleContent>
        {isLoading ? (
          <div className="py-2 px-5 dark:bg-gray-800">
            <Skeleton className="h-8 w-full mb-2" />
            <Skeleton className="h-8 w-full mb-2" />
            <Skeleton className="h-8 w-full" />
          </div>
        ) : error ? (
          <SitesSidebarError onRetry={refetch} />
        ) : activeSites.length === 0 ? (
          <SitesSidebarEmpty 
            onRetry={refetch} 
            projectId={projectId}
            isLoading={isLoading}
            error={error}
          />
        ) : (
          <div className="bg-[#F9F9FA] dark:bg-gray-800">
            <div className="bg-[#F9F9FA] dark:bg-gray-800 py-2.5 px-5 cursor-pointer hover:bg-[#F5F5F6] dark:hover:bg-gray-700 flex items-center">
              <span className="font-medium nav-item dark:text-white">Project: Zircon</span>
            </div>
            {activeSites.map(site => (
              <div key={site.id}>
                <div className={cn(
                  "flex items-center py-2.5 px-5 cursor-pointer hover:bg-[#F5F5F6] dark:hover:bg-gray-700",
                  activeSiteId === site.id && "bg-[#F5F5F6] dark:bg-gray-700"
                )}>
                  <Link 
                    to={preserveDashboardRoute && dashboardPath ? `/site/${site.id}${dashboardPath}` : `/site/${site.id}`} 
                    className="flex items-center gap-3 w-full"
                  >
                    {activeSiteId === site.id ? (
                      <>
                        <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                        <span className="nav-item-active uppercase dark:text-white">{site.name}</span>
                      </>
                    ) : (
                      <>
                        <Circle size={14} className="text-zinc-400 dark:text-zinc-300" />
                        <span className="nav-item dark:text-gray-200">{site.name}</span>
                      </>
                    )}
                  </Link>
                  <button 
                    onClick={(e) => toggleSiteExpanded(site.id, e)} 
                    className="ml-auto text-zinc-400 dark:text-zinc-300"
                  >
                    {expandedSiteId === site.id ? 
                      <ChevronUp size={16} /> : 
                      <ChevronDown size={16} />
                    }
                  </button>
                </div>
                
                {/* Zones hierarchy for the expanded site */}
                {expandedSiteId === site.id && (
                  <div className="ml-5 pl-4 dark:bg-gray-800">
                    <ZonesHierarchy 
                      siteId={site.id} 
                      preserveDashboardRoute={preserveDashboardRoute}
                      currentDashboard={currentDashboard}
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </CollapsibleContent>
      <Separator className="mx-0 w-full opacity-30 dark:bg-gray-700" />
    </Collapsible>
  );
}
