
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Zone } from "@/services/interfaces";
import { formatDate } from "@/utils/formatting";
import { ZoneCoordinatesDisplay } from "./ZoneCoordinatesDisplay";
import { ZoneLocationDataDisplay } from "./ZoneLocationDataDisplay";
import { ZoneCustomFieldsDisplay } from "./ZoneCustomFieldsDisplay";

interface ZoneAdditionalInfoCardProps {
  zone: Zone;
}

export const ZoneAdditionalInfoCard = ({ zone }: ZoneAdditionalInfoCardProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Additional Information</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* ZoneAreaDisplay component has been hidden */}
        
        <div>
          <h3 className="font-medium text-sm text-muted-foreground mb-1">Last Updated</h3>
          <p>{formatDate(zone.updatedAt)}</p>
        </div>
        
        {/* Coordinates preview */}
        <ZoneCoordinatesDisplay zone={zone} />
        
        {/* Location data details */}
        <ZoneLocationDataDisplay zone={zone} />
        
        {/* Custom fields */}
        <ZoneCustomFieldsDisplay zone={zone} />
      </CardContent>
    </Card>
  );
};
