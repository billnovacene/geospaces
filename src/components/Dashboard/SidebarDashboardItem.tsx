
import { Link } from "react-router-dom";
import { useLocation, useParams } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";
import { Circle, ChevronDown, ChevronUp } from "lucide-react";
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
  const [isOpen, setIsOpen] = useState(false);
  
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
    } else {
      // For other dashboards, check if this is the active dashboard
      const isDashboardActive = contextualTo && location.pathname === contextualTo;
      setIsSelected(isDashboardActive);
    }
  }, [location.pathname, contextualTo, isOverview, siteId, zoneId]);
  
  // Is this dashboard type active anywhere in the app?
  const isDashboardTypeActive = !isOverview && to && location.pathname.includes(to);
  
  // Toggle dropdown when clicked for selected items
  const handleToggle = () => {
    if (isSelected) {
      setIsOpen(!isOpen);
    }
  };
  
  // Replace "All Data" with "Overview" in the display name
  const displayName = isOverview ? "Overview" : name;
  
  // Generate the collapsible content (will be implemented later)
  const collapsibleContent = (
    <div className="ml-7 pl-3 py-2 border-l border-gray-200">
      {/* Placeholder for future dashboard details/options */}
      <div className="text-sm text-gray-600 py-1">Dashboard Details</div>
      <div className="text-sm text-gray-600 py-1">Settings</div>
    </div>
  );
  
  // Create the dashboard item content
  const renderTrigger = () => (
    <div 
      className="flex items-center py-2.5 px-5 cursor-pointer hover:bg-gray-50 w-full"
      onClick={handleToggle}
    >
      <div className="flex items-center gap-3 w-full">
        {isSelected ? (
          <>
            {/* Blue dot for selected item */}
            <div className="w-1.5 h-1.5 rounded-full bg-primary" />
            <span className="text-sm font-medium text-primary uppercase">{displayName}</span>
            {isOpen ? (
              <ChevronUp size={16} className="ml-auto text-gray-400" />
            ) : (
              <ChevronDown size={16} className="ml-auto text-gray-400" />
            )}
          </>
        ) : (
          <>
            <Circle size={14} className="text-zinc-400" />
            <span className="text-sm font-medium text-zinc-800">{displayName}</span>
          </>
        )}
      </div>
    </div>
  );
  
  // If not selected and has a valid URL, wrap in Link
  if (!isSelected && contextualTo) {
    return <Link to={contextualTo}>{renderTrigger()}</Link>;
  }
  
  // If selected, use Collapsible component
  if (isSelected) {
    return (
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CollapsibleTrigger asChild>
          {renderTrigger()}
        </CollapsibleTrigger>
        <CollapsibleContent>
          {collapsibleContent}
        </CollapsibleContent>
      </Collapsible>
    );
  }
  
  // Default case
  return renderTrigger();
}
