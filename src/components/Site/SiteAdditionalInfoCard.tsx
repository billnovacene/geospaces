
import { Site } from "@/services/interfaces";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/utils/formatting";
import { Clock } from "lucide-react";

interface SiteAdditionalInfoCardProps {
  site: Site;
}

export function SiteAdditionalInfoCard({ site }: SiteAdditionalInfoCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Additional Information</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <h3 className="font-medium text-sm text-muted-foreground mb-1">Last Updated</h3>
          <p>{formatDate(site.updatedAt)}</p>
        </div>
        
        {site.isEnabledScheduler !== undefined && (
          <div className="border rounded-md p-3">
            <h3 className="font-medium text-sm text-muted-foreground mb-1">Scheduler</h3>
            <Badge variant={site.isEnabledScheduler ? "default" : "outline"}>
              {site.isEnabledScheduler ? "Enabled" : "Disabled"}
            </Badge>
          </div>
        )}
        
        {site.isEnabledCondition !== undefined && (
          <div className="border rounded-md p-3">
            <h3 className="font-medium text-sm text-muted-foreground mb-1">Condition</h3>
            <Badge variant={site.isEnabledCondition ? "default" : "outline"}>
              {site.isEnabledCondition ? "Enabled" : "Disabled"}
            </Badge>
          </div>
        )}
        
        {/* Display any fields that contain energyCalculationField */}
        {site.fields && site.fields.some(field => field.energyCalculationField) && (
          <div className="border rounded-md p-3">
            <h3 className="font-medium text-sm text-muted-foreground mb-2 flex items-center">
              <Clock className="h-4 w-4 mr-2 text-primary" />
              Operating Hours
            </h3>
            <div className="grid grid-cols-2 gap-3">
              {site.fields
                .filter(field => field.energyCalculationField)
                .map((field, index) => {
                  const energy = field.energyCalculationField;
                  return (
                    <div key={index} className="bg-muted/40 p-2 rounded-md">
                      <div className="text-xs text-muted-foreground">Start Time</div>
                      <div className="font-medium">{formatDate(energy.operatingHoursStartTime)}</div>
                    </div>
                  );
                })}
              {site.fields
                .filter(field => field.energyCalculationField)
                .map((field, index) => {
                  const energy = field.energyCalculationField;
                  return (
                    <div key={index} className="bg-muted/40 p-2 rounded-md">
                      <div className="text-xs text-muted-foreground">End Time</div>
                      <div className="font-medium">{formatDate(energy.operatingHoursEndTime)}</div>
                    </div>
                  );
                })}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
