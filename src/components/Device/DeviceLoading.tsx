
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Wifi } from "lucide-react";

interface DeviceLoadingProps {
  zoneId?: number;
}

export const DeviceLoading = ({ zoneId }: DeviceLoadingProps) => {
  return (
    <Card className="col-span-2">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2">
          <Wifi className="h-5 w-5 text-primary" />
          Loading Device Data...
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Skeleton className="h-[600px] w-full" />
      </CardContent>
    </Card>
  );
};
