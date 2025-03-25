
import { useQuery } from "@tanstack/react-query";
import { fetchSite } from "@/services/sites";
import { fetchZone } from "@/services/zones";
import { Badge } from "@/components/ui/badge";
import { Package, Building, AlertTriangle, Clock } from "lucide-react";

interface ContextInformationProps {
  siteId?: string;
  zoneId?: string;
  isUsingMockData: boolean;
  isUsingCachedData: boolean;
}

export function ContextInformation({ 
  siteId, 
  zoneId, 
  isUsingMockData, 
  isUsingCachedData 
}: ContextInformationProps) {
  const { data: siteData } = useQuery({
    queryKey: ["site-for-temp-dashboard", siteId],
    queryFn: () => fetchSite(Number(siteId)),
    enabled: !!siteId,
  });

  const { data: zoneData } = useQuery({
    queryKey: ["zone-for-temp-dashboard", zoneId],
    queryFn: () => fetchZone(Number(zoneId)),
    enabled: !!zoneId,
  });

  // Determine data source description with icons
  const getDataSourceDescription = () => {
    if (zoneId && zoneData) {
      return (
        <span className="flex items-center gap-1.5">
          <Package className="h-3.5 w-3.5" />
          Data from sensors in zone {zoneData.name}
        </span>
      );
    } else if (siteId && siteData) {
      return (
        <span className="flex items-center gap-1.5">
          <Building className="h-3.5 w-3.5" />
          Data from sensors in site {siteData.name}
        </span>
      );
    }
    return "Data from all sensors";
  };

  const getContextName = () => {
    if (zoneData) return zoneData.name;
    if (siteData) return siteData.name;
    return "All Locations";
  };

  return {
    contextName: getContextName(),
    badges: (
      <div className="flex items-center gap-2">
        <Badge variant="outline" className="text-xs px-3 py-1">
          {getDataSourceDescription()}
        </Badge>
        
        {isUsingCachedData && (
          <Badge variant="outline" className="text-xs px-3 py-1 bg-green-50 text-green-700 border-green-200">
            <Clock className="h-3.5 w-3.5 mr-1" />
            Cached data
          </Badge>
        )}
        
        {isUsingMockData && (
          <Badge variant="outline" className="text-xs px-3 py-1 bg-amber-50 text-amber-700 border-amber-200">
            <AlertTriangle className="h-3.5 w-3.5 mr-1" />
            Simulated data
          </Badge>
        )}
      </div>
    ),
    siteData,
    zoneData
  };
}
