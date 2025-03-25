
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Zone } from "@/services/interfaces";
import { formatDate } from "@/utils/formatting";
import { Badge } from "@/components/ui/badge";
import { calculateArea, calculateAreaFromGeoJSON, extractCoordinates } from "@/utils/areaCalculations";
import { InfoIcon, MapIcon } from "lucide-react";
import { TooltipWrapper } from "@/components/UI/TooltipWrapper";

interface ZoneDetailsCardProps {
  zone: Zone;
  deviceCount: number | undefined;
  deviceCountLoading: boolean;
}

export const ZoneDetailsCard = ({ zone, deviceCount, deviceCountLoading }: ZoneDetailsCardProps) => {
  // Calculate area value for display
  const hasAreaField = zone.area !== undefined && zone.area !== null;
  const areaFromField = hasAreaField ? String(zone.area) : null;
  
  // Calculate area from location data if not directly available
  const areaValue = areaFromField || (zone?.location && Array.isArray(zone.location) && zone.location.length >= 3 
    ? calculateArea(zone.location)
    : (zone?.location && typeof zone.location === 'object' && !Array.isArray(zone.location))
      ? calculateAreaFromGeoJSON(zone.location as any)
      : null);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Zone Details</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Basic zone details */}
        <div>
          <h3 className="font-medium text-sm text-muted-foreground mb-1">Zone ID</h3>
          <p>{zone.id}</p>
        </div>
        <div>
          <h3 className="font-medium text-sm text-muted-foreground mb-1">Site ID</h3>
          <p>{zone.siteId}</p>
        </div>
        {zone.description && (
          <div>
            <h3 className="font-medium text-sm text-muted-foreground mb-1">Description</h3>
            <p>{zone.description}</p>
          </div>
        )}
        
        {/* Created date at the top */}
        <div className="pt-2">
          <Card className="bg-muted/40">
            <CardContent className="p-4">
              <div>
                <p className="text-sm font-medium">Created</p>
                <p className="text-sm">{formatDate(zone.createdAt)}</p>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Device count and Area in a 2-column grid */}
        <div className="grid grid-cols-2 gap-4">
          {/* Device count on the left */}
          <Card className="bg-muted/40">
            <CardContent className="p-4">
              <div>
                <p className="text-sm font-medium">Devices</p>
                {deviceCountLoading ? (
                  <Skeleton className="h-8 w-16" />
                ) : (
                  <p className="text-2xl font-bold">{deviceCount || 0}</p>
                )}
              </div>
            </CardContent>
          </Card>
          
          {/* Area display on the right */}
          <Card className="bg-muted/40">
            <CardContent className="p-4">
              <div>
                <p className="text-sm font-medium flex items-center mb-1">
                  <MapIcon className="h-4 w-4 mr-1 text-primary" />
                  Area
                </p>
                {areaValue ? (
                  <div className="flex items-center">
                    <Badge variant="secondary" className="text-lg font-medium mr-2">
                      {areaValue}m²
                    </Badge>
                    <TooltipWrapper 
                      content="Area calculated using Turf.js which converts coordinates to a projected system for accurate measurement."
                    >
                      <InfoIcon className="h-4 w-4 text-muted-foreground cursor-help" />
                    </TooltipWrapper>
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">Not available</p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </CardContent>
    </Card>
  );
};
