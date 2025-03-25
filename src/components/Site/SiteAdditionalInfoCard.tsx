
import { Site } from "@/services/interfaces";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/utils/formatting";
import { Clock, Calendar, ToggleLeft, ToggleRight } from "lucide-react";
import { format } from "date-fns";

interface SiteAdditionalInfoCardProps {
  site: Site;
}

export function SiteAdditionalInfoCard({ site }: SiteAdditionalInfoCardProps) {
  // Function to format time only from datetime string
  const formatTimeOnly = (dateString: string | undefined) => {
    if (!dateString) return "N/A";
    try {
      return format(new Date(dateString), "h:mm a");
    } catch (e) {
      return "N/A";
    }
  };

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
              <div className="flex items-center">
                {site.isEnabledScheduler ? (
                  <div className="flex items-center">
                    <ToggleRight className="h-6 w-6 text-primary mr-2" />
                    <span className="text-sm font-medium">Enabled</span>
                  </div>
                ) : (
                  <div className="flex items-center">
                    <ToggleLeft className="h-6 w-6 text-muted-foreground mr-2" />
                    <span className="text-sm font-medium text-muted-foreground">Disabled</span>
                  </div>
                )}
              </div>
            </div>
          )}
          
          {site.isEnabledCondition !== undefined && (
            <div className="border rounded-md p-3">
              <h3 className="font-medium text-sm text-muted-foreground mb-2">Condition</h3>
              <div className="flex items-center">
                {site.isEnabledCondition ? (
                  <div className="flex items-center">
                    <ToggleRight className="h-6 w-6 text-primary mr-2" />
                    <span className="text-sm font-medium">Enabled</span>
                  </div>
                ) : (
                  <div className="flex items-center">
                    <ToggleLeft className="h-6 w-6 text-muted-foreground mr-2" />
                    <span className="text-sm font-medium text-muted-foreground">Disabled</span>
                  </div>
                )}
              </div>
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
                      <div className="font-medium">{formatTimeOnly(energy.operatingHoursStartTime)}</div>
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
                      <div className="font-medium">{formatTimeOnly(energy.operatingHoursEndTime)}</div>
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
