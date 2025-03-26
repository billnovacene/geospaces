
import { useParams, useLocation } from "react-router-dom";
import { Link } from "react-router-dom";
import { Circle } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { SitesSidebarError } from "./SitesSidebarError";
import { SitesSidebarEmpty } from "./SitesSidebarEmpty";
import { useSitesList } from "@/hooks/useSitesList";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronUp, ChevronDown } from "lucide-react";
import { useState } from "react";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

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
  
  const projectId = 145;
  
  const { activeSites, sites, isLoading, error, refetch } = useSitesList(projectId);
  
  console.log(`SitesSidebar: Rendering with ${sites.length} total sites, ${activeSites.length} active sites`);
  console.log(`Preserving dashboard: ${preserveDashboardRoute}, dashboardPath=${dashboardPath}`);

  return (
    <Collapsible 
      open={isOpen}
      onOpenChange={setIsOpen}
      className="w-full"
    >
      <CollapsibleTrigger className="w-full">
        <div className="py-3 px-4 text-xs text-[#8E9196] uppercase tracking-wide flex items-center justify-between bg-white border-b border-gray-100 cursor-pointer">
          <span>Sites</span>
          <span>
            {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </span>
        </div>
      </CollapsibleTrigger>
      <CollapsibleContent>
        {isLoading ? (
          <div className="py-2 px-5">
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
          <div className="bg-[#F9F9FA]">
            <div className="bg-[#F9F9FA] py-2.5 px-5 cursor-pointer hover:bg-[#F5F5F6] flex items-center">
              <span className="font-medium text-sm text-zinc-800">Project: Zircon</span>
            </div>
            {activeSites.map(site => (
              <div key={site.id} className={cn(
                "flex items-center py-2.5 px-5 cursor-pointer hover:bg-[#F5F5F6]",
                activeSiteId === site.id && "bg-[#F5F5F6] border-l-[3px] border-primary pl-4"
              )}>
                <Link to={preserveDashboardRoute && dashboardPath ? `/site/${site.id}${dashboardPath}` : `/site/${site.id}`} className="flex items-center gap-3 w-full">
                  {activeSiteId === site.id ? (
                    <>
                      <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                      <span className="text-sm font-light text-zinc-800 uppercase">{site.name}</span>
                    </>
                  ) : (
                    <>
                      <Circle size={14} className="text-zinc-400" />
                      <span className="text-sm font-medium text-zinc-800">{site.name}</span>
                    </>
                  )}
                </Link>
              </div>
            ))}
          </div>
        )}
      </CollapsibleContent>
      <Separator className="mx-0 w-full opacity-30" />
    </Collapsible>
  );
}
