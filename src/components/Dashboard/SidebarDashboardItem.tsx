
import { Link } from "react-router-dom";
import { useLocation, useParams } from "react-router-dom";
import { cn } from "@/lib/utils";

interface DashboardItemProps {
  name: string;
  to?: string;
}

export function SidebarDashboardItem({
  name,
  to
}: DashboardItemProps) {
  const location = useLocation();
  const { siteId, zoneId } = useParams<{ siteId: string; zoneId: string }>();
  
  // Determine the correct URL based on current context
  let contextualTo = to;
  if (to && zoneId) {
    contextualTo = `/zone/${zoneId}${to}`;
  } else if (to && siteId) {
    contextualTo = `/site/${siteId}${to}`;
  }
  
  const isActive = contextualTo && location.pathname === contextualTo;
  
  const content = (
    <div className={cn(
      "flex items-center py-2.5 px-5 cursor-pointer bg-white sidebar-hover-item",
      isActive && "bg-[#F9F9FA]"
    )}>
      <div className="flex items-center gap-2">
        <span className="text-xs text-zinc-500">▶</span>
        <span className={cn("text-sm font-medium", isActive ? "text-zinc-950" : "text-zinc-800")}>{name}</span>
      </div>
    </div>
  );
  
  if (contextualTo) {
    return <Link to={contextualTo}>{content}</Link>;
  }
  
  return content;
}
