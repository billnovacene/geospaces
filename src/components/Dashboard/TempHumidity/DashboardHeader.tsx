
import { useState, useEffect } from "react";
import { BreadcrumbNav } from "@/components/Dashboard/TempHumidity/BreadcrumbNav";
import { PageHeader } from "@/components/Dashboard/TempHumidity/PageHeader";
import { Badge } from "@/components/ui/badge";
import { Clock, AlertTriangle } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { fetchSite } from "@/services/sites";
import { fetchZone } from "@/services/zones";
import { useParams } from "react-router-dom";

interface DashboardHeaderProps {
  isUsingMockData: boolean;
  isLoading: boolean;
  operatingHours?: {
    startTime: string;
    endTime: string;
  };
}

export function DashboardHeader({ isUsingMockData, isLoading, operatingHours }: DashboardHeaderProps) {
  const { siteId, zoneId } = useParams<{ siteId: string; zoneId: string }>();
  
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

  const getContextName = () => {
    if (zoneData) return zoneData.name;
    if (siteData) return siteData.name;
    return "All Locations";
  };

  const formatOperatingHours = () => {
    if (operatingHours) {
      return `${operatingHours.startTime} - ${operatingHours.endTime}`;
    }
    return "All hours";
  };

  return (
    <>
      <div className="mb-4">
        <BreadcrumbNav />
      </div>

      <div className="flex items-center justify-between mb-2">
        <PageHeader customTitle={`Temperature & Humidity - ${getContextName()}`} />
      </div>
      
      {operatingHours && (
        <div className="flex items-center mb-6 text-gray-700">
          <Clock className="h-4 w-4 mr-1.5" />
          <span className="text-sm font-medium">Operating hours: {formatOperatingHours()}</span>
        </div>
      )}

      <div className="flex items-center justify-between mb-6">
        <div></div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-xs px-3 py-1">
            Data from Geospaces
          </Badge>
          
          {isUsingMockData && !isLoading && (
            <Badge variant="outline" className="text-xs px-3 py-1 bg-amber-50 text-amber-700 border-amber-200">
              <AlertTriangle className="h-3.5 w-3.5 mr-1" />
              Simulated data
            </Badge>
          )}
        </div>
      </div>
    </>
  );
}
