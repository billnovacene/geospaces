
import { Skeleton } from "@/components/ui/skeleton";

export const ZoneLoadingSkeleton = () => {
  return (
    <div className="space-y-4">
      <Skeleton className="h-12 w-[250px]" />
      <div className="grid gap-6 md:grid-cols-2">
        <Skeleton className="h-[300px] w-full" />
        <Skeleton className="h-[300px] w-full" />
      </div>
    </div>
  );
};
