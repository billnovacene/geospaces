
import React from "react";
import { AlertTriangle } from "lucide-react";

export const ErrorDevicesState = () => {
  return (
    <div className="text-center py-8 text-muted-foreground">
      <AlertTriangle className="mx-auto h-8 w-8 mb-2 text-yellow-500" />
      <p>Error loading devices. Please try again later.</p>
    </div>
  );
};
