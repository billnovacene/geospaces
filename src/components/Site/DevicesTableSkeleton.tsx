
import React from "react";
import { Skeleton } from "@/components/ui/skeleton";

export const DevicesTableSkeleton = () => {
  return (
    <div className="space-y-3">
      <Skeleton className="w-full h-10" />
      <Skeleton className="w-full h-10" />
      <Skeleton className="w-full h-10" />
      <Skeleton className="w-full h-10" />
    </div>
  );
};
