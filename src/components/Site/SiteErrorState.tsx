
import { Card, CardContent } from "@/components/ui/card";

export function SiteErrorState() {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex flex-col items-center justify-center h-40 text-center">
          <p className="text-destructive mb-2">Failed to load site details</p>
          <p className="text-muted-foreground text-sm">Please try again later or check if the site exists</p>
        </div>
      </CardContent>
    </Card>
  );
}
