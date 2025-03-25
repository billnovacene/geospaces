
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

export function LoadingState() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 text-primary mb-4">
        <Loader2 className="h-5 w-5 animate-spin" />
        <span className="font-medium">Loading sensor data from API...</span>
      </div>
      
      {/* Stats cards skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-2 mb-8">
        {Array(5).fill(null).map((_, i) => (
          <Card key={i} className="overflow-hidden border-0 rounded-none shadow-sm">
            <CardContent className="p-0 h-full">
              <div className="px-[5px] mx-[5px] py-2 flex-grow flex flex-col justify-center animate-pulse">
                <div className="flex flex-col items-center text-center space-y-3">
                  <Skeleton className="h-4 w-4 rounded-full" />
                  <Skeleton className="h-6 w-20" />
                  <Skeleton className="h-3 w-24" />
                  <Skeleton className="h-3 w-16" />
                </div>
              </div>
              <Skeleton className="h-1 w-full rounded-none" />
            </CardContent>
          </Card>
        ))}
      </div>
      
      {/* Sensor sources skeleton */}
      <Card className="border-0 shadow-sm mb-8">
        <CardContent className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <Skeleton className="h-5 w-5" />
            <Skeleton className="h-6 w-48" />
          </div>
          
          <div className="grid gap-3 animate-pulse">
            {Array(2).fill(null).map((_, i) => (
              <Skeleton key={i} className="h-16 w-full" />
            ))}
          </div>
        </CardContent>
      </Card>
      
      {/* Charts skeleton */}
      <Card className="shadow-sm border-0 mb-8">
        <CardContent className="p-8">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 lg:gap-8 items-center">
            <div className="col-span-1">
              <Skeleton className="h-6 w-48 mb-3" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full mt-2" />
              <Skeleton className="h-4 w-3/4 mt-2" />
            </div>
            <div className="col-span-1 lg:col-span-3">
              <Skeleton className="h-[300px] w-full" />
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card className="shadow-sm border-0">
        <CardContent className="p-8">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 lg:gap-8 items-center">
            <div className="col-span-1">
              <Skeleton className="h-6 w-48 mb-3" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full mt-2" />
              <Skeleton className="h-4 w-3/4 mt-2" />
            </div>
            <div className="col-span-1 lg:col-span-3">
              <Skeleton className="h-[300px] w-full" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
