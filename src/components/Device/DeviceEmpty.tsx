
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Wifi } from "lucide-react";

interface DeviceEmptyProps {
  zoneId: number;
}

export const DeviceEmpty = ({ zoneId }: DeviceEmptyProps) => {
  return (
    <Card className="col-span-2">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2">
          <Wifi className="h-5 w-5 text-primary" />
          Devices in Zone {zoneId}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-center py-8 border rounded-md bg-muted/30">
          <p className="text-muted-foreground">No devices found in zone {zoneId}</p>
        </div>
      </CardContent>
    </Card>
  );
};
