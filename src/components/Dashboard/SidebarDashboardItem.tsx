
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
  
  const isOverview = name === "All Data";
  
  let contextualTo = to;
  
  if (isOverview) {
    if (zoneId) {
      contextualTo = `/zone/${zoneId}`;
    } else if (siteId) {
      contextualTo = `/site/${siteId}`;
    } else {
      contextualTo = "/";
    }
  } else if (to) {
    if (contextPath) {
      contextualTo = `${contextPath}${to}`;
    } else if (zoneId) {
      contextualTo = `/zone/${zoneId}${to}`;
    } else if (siteId) {
      contextualTo = `/site/${siteId}${to}`;
    }
  }
  
  useEffect(() => {
    if (isOverview) {
      const currentPath = location.pathname;
      const isZoneDetailPage = zoneId && currentPath === `/zone/${zoneId}`;
      const isSiteDetailPage = siteId && currentPath === `/site/${siteId}`;
      const isHomePage = currentPath === "/" || currentPath === "/index";
      const newIsSelected = isZoneDetailPage || isSiteDetailPage || isHomePage;
      setIsSelected(newIsSelected);
    } else {
      const isDashboardActive = contextualTo && location.pathname === contextualTo;
      setIsSelected(isDashboardActive);
    }
  }, [location.pathname, contextualTo, isOverview, siteId, zoneId]);
  
  const isDashboardTypeActive = !isOverview && to && location.pathname.includes(to);
  
  const handleToggle = () => {
    if (isSelected) {
      setIsOpen(!isOpen);
    }
  };
  
  const displayName = isOverview ? "Overview" : name;
  
  const collapsibleContent = (
    <div className="ml-7 pl-3 py-2 border-l border-gray-200 dark:border-gray-700">
      <div className="text-sm text-gray-600 dark:text-gray-400 py-1">Dashboard Details</div>
      <div className="text-sm text-gray-600 dark:text-gray-400 py-1">Settings</div>
    </div>
  );
  
  const renderTrigger = () => (
    <div 
      className={cn(
        "flex items-center py-2.5 px-5 cursor-pointer sidebar-hover-item w-full",
        isSelected ? "nav-item-active" : "nav-item",
        isSelected && "dark:bg-gray-700"
      )}
    >
      <div className="flex items-center gap-3 w-full">
        {isSelected ? (
          <>
            <div className="w-1.5 h-1.5 rounded-full bg-current" />
            <span className="dark:text-white">{displayName}</span>
            <div className="ml-auto">
              {isOpen ? (
                <ChevronUp size={16} className="text-current" />
              ) : (
                <ChevronDown size={16} className="text-current" />
              )}
            </div>
          </>
        ) : (
          <>
            <Circle size={14} className="text-current opacity-60" />
            <span className="dark:text-gray-300">{displayName}</span>
          </>
        )}
      </div>
    </div>
  );
  
  if (!isSelected && contextualTo) {
    return <Link to={contextualTo}>{renderTrigger()}</Link>;
  }
  
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
  
  return renderTrigger();
}
