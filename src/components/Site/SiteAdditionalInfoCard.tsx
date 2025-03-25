
import { Site } from "@/services/interfaces";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/utils/formatting";
import { Clock, Calendar } from "lucide-react";

interface SiteAdditionalInfoCardProps {
  site: Site;
}

export function SiteAdditionalInfoCard({ site }: SiteAdditionalInfoCardProps) {
  return (
    <Card className="h-full shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-xl">Additional Information</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="border rounded-md p-3">
          <h3 className="font-medium text-sm text-muted-foreground mb-1 flex items-center">
            <Calendar className="h-4 w-4 mr-2 text-primary" />
            Last Updated
          </h3>
          <p className="font-medium">{formatDate(site.updatedAt)}</p>
        </div>
        
        <div className="grid grid-cols-2 gap-3">
          {site.isEnabledScheduler !== undefined && (
            <div className="border rounded-md p-3">
              <h3 className="font-medium text-sm text-muted-foreground mb-2">Scheduler</h3>
              <Badge variant={site.isEnabledScheduler ? "default" : "outline"}>
                {site.isEnabledScheduler ? "Enabled" : "Disabled"}
              </Badge>
            </div>
          )}
          
          {site.isEnabledCondition !== undefined && (
            <div className="border rounded-md p-3">
              <h3 className="font-medium text-sm text-muted-foreground mb-2">Condition</h3>
              <Badge variant={site.isEnabledCondition ? "default" : "outline"}>
                {site.isEnabledCondition ? "Enabled" : "Disabled"}
              </Badge>
            </div>
          )}
        </div>
        
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
                    <div key={index} className="bg-muted/40 p-3 rounded-md">
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
                    <div key={index} className="bg-muted/40 p-3 rounded-md">
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
