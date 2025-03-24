
import React from "react";
import { WifiOff } from "lucide-react";

export const EmptyDevicesState = () => {
  return (
    <div className="text-center py-12 border rounded-md bg-muted/30 flex flex-col items-center justify-center">
      <WifiOff className="h-10 w-10 text-muted-foreground mb-3" />
      <p className="text-muted-foreground font-medium">No devices found for this zone</p>
      <p className="text-sm text-muted-foreground mt-1">Try selecting a different zone or refreshing the page</p>
    </div>
  );
};
