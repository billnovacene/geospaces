
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Zone } from "@/services/interfaces";
import { formatDate } from "@/utils/formatting";
import { formatZoneLocation } from "@/utils/zoneUtils";

interface ZoneAdditionalInfoCardProps {
  zone: Zone;
}

export const ZoneAdditionalInfoCard = ({ zone }: ZoneAdditionalInfoCardProps) => {
  const locationData = formatZoneLocation(zone);
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Additional Information</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <h3 className="font-medium text-sm text-muted-foreground mb-1">Last Updated</h3>
          <p>{formatDate(zone.updatedAt)}</p>
        </div>
        
        {zone.location && (
          <div>
            <h3 className="font-medium text-sm text-muted-foreground mb-1">Location Data</h3>
            <div className="border rounded-lg p-3">
              <pre className="text-xs overflow-auto max-h-48">
                {locationData}
              </pre>
            </div>
          </div>
        )}
        
        {zone.fields && zone.fields.length > 0 && (
          <div>
            <h3 className="font-medium text-sm text-muted-foreground mb-1">Custom Fields</h3>
            <div className="border rounded-lg p-3">
              <pre className="text-xs overflow-auto max-h-48">
                {JSON.stringify(zone.fields, null, 2)}
              </pre>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
