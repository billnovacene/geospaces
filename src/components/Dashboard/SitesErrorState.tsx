
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertTriangle, RefreshCw } from "lucide-react";

interface SitesErrorStateProps {
  onRetry?: () => void;
}

export function SitesErrorState({ onRetry }: SitesErrorStateProps) {
  return (
    <Card className="dashboard-card">
      <CardContent className="pt-6">
        <div className="flex flex-col items-center justify-center h-40 text-center">
          <AlertTriangle className="h-8 w-8 text-destructive mb-4" />
          <p className="text-destructive font-medium mb-2">Failed to load sites</p>
          <p className="text-muted-foreground text-sm mb-4">Please try again later or check your connection</p>
          {onRetry && (
            <Button variant="outline" size="sm" onClick={onRetry}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Retry
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
