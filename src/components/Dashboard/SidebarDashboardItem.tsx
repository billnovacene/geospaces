
import { Link } from "react-router-dom";
import { useLocation, useParams } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";
import { Circle } from "lucide-react";

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
  
  // Reset selection state when route changes
  useEffect(() => {
    // Check if this is the active dashboard
    const isDashboardActive = contextualTo && location.pathname === contextualTo;
    setIsSelected(isDashboardActive);
  }, [location.pathname, contextualTo]);
  
  // Is this dashboard type active anywhere in the app?
  const isDashboardTypeActive = to && location.pathname.includes(to);
  
  // Toggle selection when clicked
  const handleToggle = (e: React.MouseEvent) => {
    if (isSelected) {
      e.preventDefault(); // Prevent navigation if already selected
      setIsSelected(false);
      // Navigate away from the current dashboard
      window.history.back();
    } else {
      setIsSelected(true);
    }
  };
  
  // Replace "All Data" with "Overview" in the display name
  const displayName = name === "All Data" ? "Overview" : name;
  
  const content = (
    <div 
      className={cn(
        "flex items-center py-2.5 px-5 cursor-pointer bg-white sidebar-hover-item",
        (isSelected || isDashboardTypeActive) && "bg-[#F9F9FA]"
      )}
      onClick={handleToggle}
    >
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
        <span className={cn(
          "text-sm font-medium", 
          isSelected ? "text-primary font-semibold" : 
          isDashboardTypeActive ? "text-zinc-900" : "text-zinc-800"
        )}>
          {displayName}
        </span>
      </div>
    </div>
  );
  
  // Only wrap in Link if not already selected
  if (contextualTo && !isSelected) {
    return <Link to={contextualTo}>{content}</Link>;
  }
  
  return content;
}
