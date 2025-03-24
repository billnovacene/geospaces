
import React from "react";

export const EmptyDevicesState = () => {
  return (
    <div className="text-center py-8 border rounded-md bg-muted/30">
      <p className="text-muted-foreground">No devices with sensor data found for this site</p>
    </div>
  );
};
