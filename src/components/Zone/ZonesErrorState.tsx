
import { Card, CardContent } from "@/components/ui/card";

export function ZonesErrorState() {
  return (
    <Card className="dashboard-card">
      <CardContent className="pt-6">
        <div className="flex flex-col items-center justify-center h-40 text-center">
          <p className="text-destructive mb-2">Failed to load zones</p>
          <p className="text-muted-foreground text-sm">Please try again later or check your connection</p>
        </div>
      </CardContent>
    </Card>
  );
}
