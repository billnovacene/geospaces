
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { AlertTriangle, Wifi } from "lucide-react";

interface DeviceErrorProps {
  zoneId: number;
  error?: any;
}

export const DeviceError = ({ zoneId, error }: DeviceErrorProps) => {
  return (
    <Card className="col-span-2">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2">
          <Wifi className="h-5 w-5 text-primary" />
          Devices in Zone {zoneId}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-center py-8 text-muted-foreground">
          <AlertTriangle className="mx-auto h-8 w-8 mb-2 text-yellow-500" />
          <p>Error loading devices. Please try again later.</p>
        </div>
      </CardContent>
    </Card>
  );
};
