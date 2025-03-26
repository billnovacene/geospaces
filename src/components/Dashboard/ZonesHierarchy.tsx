
import { useParams, useLocation, Link } from "react-router-dom";
import { Package, ChevronDown, ChevronRight } from "lucide-react";
import { useZonesHierarchy } from "@/hooks/useZonesHierarchy";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { ZonesLoadingState } from "./ZonesLoadingState";
import { ZonesErrorState } from "./ZonesErrorState";
import { EmptyZonesState } from "./EmptyZonesState";
import { NoSiteSelected } from "./NoSiteSelected";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface ZonesHierarchyProps {
  siteId: number | null;
  preserveDashboardRoute?: boolean;
  currentDashboard?: string;
  hideZonesWithoutSensors?: boolean;
}

export function ZonesHierarchy({ 
  siteId: propsSiteId, 
  preserveDashboardRoute = false,
  currentDashboard = "",
  hideZonesWithoutSensors = false
}: ZonesHierarchyProps) {
  const location = useLocation();
  const { zoneId } = useParams<{ zoneId: string }>();
  const activeZoneId = zoneId ? Number(zoneId) : null;
  const [showEmptyZones, setShowEmptyZones] = useState(true);
  
  console.log("🌍 ZonesHierarchy: Passed siteId:", propsSiteId);
  console.log("🔍 ZonesHierarchy: Current activeZoneId:", activeZoneId);
  
  const {
    effectiveSiteId,
    zones,
    isLoading,
    error,
    expandedZones,
    toggleExpanded
  } = useZonesHierarchy(propsSiteId, activeZoneId);
  
  // Log rendering information
  console.log(`📊 Rendering ZonesHierarchy: 
    - isLoading=${isLoading}, 
    - hasError=${!!error}, 
    - zonesCount=${zones?.length},
    - effectiveSiteId=${effectiveSiteId}`);
  
  if (!effectiveSiteId) {
    console.warn("⚠️ No effective site ID found");
    return <NoSiteSelected />;
  }
  
  const dashboardPath = preserveDashboardRoute && currentDashboard === "temp-humidity" 
    ? '/dashboard/temp-humidity' 
    : '';
  
  // Create the site link with appropriate dashboard path
  const siteLink = dashboardPath 
    ? `/site/${effectiveSiteId}${dashboardPath}`
    : `/site/${effectiveSiteId}`;
  
  // Function to render a zone and its children recursively
  const renderZone = (zone: any, level = 0) => {
    // Skip rendering if zone has no devices and showEmptyZones is false
    const hasDevices = zone.devices > 0;
    if (!showEmptyZones && !hasDevices && (!zone.children || zone.children.length === 0)) {
      return null;
    }
    
    const zoneLink = dashboardPath 
      ? `/zone/${zone.id}${dashboardPath}`
      : `/zone/${zone.id}`;
    
    const isExpanded = expandedZones.includes(zone.id);
    const isActive = activeZoneId === zone.id;
    const hasChildren = zone.children && zone.children.length > 0;
    
    return (
      <div key={zone.id}>
        <div 
          className={cn(
            "flex items-center py-2 px-5 cursor-pointer hover:bg-gray-100/50",
            isActive ? "bg-gray-100" : "",
            level > 0 ? "pl-10" : "pl-5"
          )}
          style={{ paddingLeft: `${level * 12 + 20}px` }}
        >
          {hasChildren ? (
            <button 
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                toggleExpanded(zone.id);
              }}
              className="text-gray-500 hover:text-gray-700 p-0.5 mr-1.5"
            >
              {isExpanded ? 
                <ChevronDown className="h-4 w-4" /> : 
                <ChevronRight className="h-4 w-4" />
              }
            </button>
          ) : (
            <div className="w-5" />
          )}
          
          <Link to={zoneLink} className="flex-1 flex items-center justify-between">
            <span className={`text-sm ${isActive ? "font-medium" : ""}`}>
              {zone.name}
            </span>
            <span className="text-xs text-gray-500">
              {zone.devices || 0} device{zone.devices !== 1 ? 's' : ''}
            </span>
          </Link>
        </div>
        
        {isExpanded && hasChildren && (
          <div>
            {zone.children.map((child: any) => renderZone(child, level + 1))}
          </div>
        )}
      </div>
    );
  };
  
  return (
    <>
      <div className="px-5 py-2 flex items-center justify-between bg-[#F9F9FA] border-y border-gray-100">
        <Label htmlFor="show-empty-zones" className="text-xs text-gray-500 cursor-pointer">
          Show empty zones
        </Label>
        <Switch 
          id="show-empty-zones"
          checked={showEmptyZones}
          onCheckedChange={setShowEmptyZones}
          size="sm"
        />
      </div>
      
      <Link to={siteLink} className="block">
        <div className="bg-[#F9F9FA] py-2.5 px-5 cursor-pointer hover:bg-[#F5F5F6]">
          <div className="flex items-center gap-1.5">
            <Package className="h-4 w-4" />
            <span className="font-medium text-sm text-zinc-950">All zones</span>
          </div>
        </div>
      </Link>
      
      {isLoading ? (
        <ZonesLoadingState />
      ) : error ? (
        <ZonesErrorState />
      ) : zones.length === 0 ? (
        <EmptyZonesState />
      ) : (
        <div className="zone-hierarchy">
          {zones.map(zone => renderZone(zone))}
        </div>
      )}
    </>
  );
}
