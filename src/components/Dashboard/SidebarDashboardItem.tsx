
import { Link } from "react-router-dom";
import { useLocation, useParams } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";
import { Circle, ChevronDown, ChevronRight } from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

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
  const [isSelected, setIsSelected] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  
  // Special handling for Overview dashboard
  const isOverview = name === "All Data";
  
  // Determine the correct URL based on current context and passed contextPath
  let contextualTo = to;
  
  if (isOverview) {
    // For Overview, navigate to root, site, or zone detail page
    if (zoneId) {
      contextualTo = `/zone/${zoneId}`;
    } else if (siteId) {
      contextualTo = `/site/${siteId}`;
    } else {
      contextualTo = "/";
    }
  } else if (to) {
    if (contextPath) {
      // If a contextPath is explicitly provided, use it
      contextualTo = `${contextPath}${to}`;
    } else if (zoneId) {
      contextualTo = `/zone/${zoneId}${to}`;
    } else if (siteId) {
      contextualTo = `/site/${siteId}${to}`;
    }
  }
  
  // Reset selection state when route changes
  useEffect(() => {
    // For Overview dashboard, check if we're on the site, zone detail page or home page
    if (isOverview) {
      const currentPath = location.pathname;
      const isZoneDetailPage = zoneId && currentPath === `/zone/${zoneId}`;
      const isSiteDetailPage = siteId && currentPath === `/site/${siteId}`;
      const isHomePage = currentPath === "/" || currentPath === "/index";
      const newIsSelected = isZoneDetailPage || isSiteDetailPage || isHomePage;
      setIsSelected(newIsSelected);
      
      // Collapse when selected
      if (newIsSelected && !isCollapsed) {
        setIsCollapsed(true);
      }
    } else {
      // For other dashboards, check if this is the active dashboard
      const isDashboardActive = contextualTo && location.pathname === contextualTo;
      setIsSelected(isDashboardActive);
      
      // Collapse when selected
      if (isDashboardActive && !isCollapsed) {
        setIsCollapsed(true);
      }
    }
  }, [location.pathname, contextualTo, isOverview, siteId, zoneId]);
  
  // Is this dashboard type active anywhere in the app?
  const isDashboardTypeActive = !isOverview && to && location.pathname.includes(to);
  
  // Toggle selection when clicked
  const handleToggle = (e: React.MouseEvent) => {
    if (isSelected) {
      e.preventDefault(); // Prevent navigation if already selected
      setIsCollapsed(!isCollapsed); // Toggle collapse state
    } else {
      setIsSelected(true);
      setIsCollapsed(true); // Collapse when newly selected
    }
  };
  
  // Replace "All Data" with "Overview" in the display name
  const displayName = isOverview ? "Overview" : name;
  
  const content = (
    <div 
      className={cn(
        "flex items-center py-2.5 px-5 cursor-pointer bg-white sidebar-hover-item",
        (isSelected || isDashboardTypeActive) && "bg-[#F9F9FA]"
      )}
      onClick={handleToggle}
    >
      <div className="flex items-center justify-between w-full">
        <div className="flex items-center gap-3">
          <div className={cn(
            "flex items-center justify-center w-4 h-4 rounded-full border",
            isSelected 
              ? "border-primary bg-white" 
              : "border-zinc-300 bg-white"
          )}>
            {isSelected && (
              <div className="w-2 h-2 rounded-full bg-primary" />
            )}
          </div>
          {isSelected && isCollapsed ? (
            <div className="flex items-center justify-between w-full">
              <span className="text-sm font-medium text-primary font-semibold">{displayName}</span>
              <ChevronRight size={16} className="text-zinc-400" />
            </div>
          ) : (
            <span className={cn(
              "text-sm font-medium", 
              isSelected ? "text-primary font-semibold" : 
              isDashboardTypeActive ? "text-zinc-900" : "text-zinc-800"
            )}>
              {displayName}
            </span>
          )}
        </div>
        {isSelected && !isCollapsed && (
          <ChevronDown 
            size={16} 
            className="transition-transform duration-200" 
          />
        )}
      </div>
    </div>
  );
  
  // Only wrap in Link if not already selected
  if (contextualTo && !isSelected) {
    return <Link to={contextualTo}>{content}</Link>;
  }
  
  return content;
}
