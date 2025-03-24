
import { Link } from "react-router-dom";
import { useLocation, useParams } from "react-router-dom";
import { cn } from "@/lib/utils";

interface DashboardItemProps {
  name: string;
  to?: string;
  contextPath?: string;
}

export function SidebarDashboardItem({
  name,
  to,
  contextPath = ""
}: DashboardItemProps) {
  const location = useLocation();
  const { siteId, zoneId } = useParams<{ siteId: string; zoneId: string }>();
  
  // Determine the correct URL based on current context and passed contextPath
  let contextualTo = to;
  
  if (to) {
    if (contextPath) {
      // If a contextPath is explicitly provided, use it
      contextualTo = `${contextPath}${to}`;
    } else if (zoneId) {
      contextualTo = `/zone/${zoneId}${to}`;
    } else if (siteId) {
      contextualTo = `/site/${siteId}${to}`;
    }
  }
  
  // Check if this is the active dashboard
  const isDashboardActive = contextualTo && location.pathname === contextualTo;
  
  // Is this dashboard type active anywhere in the app?
  const isDashboardTypeActive = to && location.pathname.includes(to);
  
  const content = (
    <div className={cn(
      "flex items-center py-2.5 px-5 cursor-pointer bg-white sidebar-hover-item",
      (isDashboardActive || isDashboardTypeActive) && "bg-[#F9F9FA]"
    )}>
      <div className="flex items-center gap-2">
        <span className="text-xs text-zinc-500">▶</span>
        <span className={cn(
          "text-sm font-medium", 
          isDashboardActive ? "text-primary font-semibold" : 
          isDashboardTypeActive ? "text-zinc-900" : "text-zinc-800"
        )}>
          {name}
        </span>
      </div>
    </div>
  );
  
  if (contextualTo) {
    return <Link to={contextualTo}>{content}</Link>;
  }
  
  return content;
}
