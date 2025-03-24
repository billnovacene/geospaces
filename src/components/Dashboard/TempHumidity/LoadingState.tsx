
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";
import { Thermometer } from "lucide-react";

export function LoadingState() {
  return (
    <div className="space-y-8">
      {/* Loading state for the data cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-2">
        {[...Array(5)].map((_, i) => (
          <Card key={i} className="border-0 shadow-sm">
            <CardContent className="p-4">
              <div className="flex flex-col space-y-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-8 w-16" />
                <Skeleton className="h-2 w-full mt-2" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      
      {/* Loading state for sensor data sources */}
      <Card className="border-0 shadow-sm">
        <CardContent className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <div className="flex h-5 w-5 items-center justify-center rounded-full bg-primary/10">
              <Thermometer className="h-3 w-3 text-primary animate-pulse" />
            </div>
            <Skeleton className="h-5 w-48" />
          </div>
          
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="rounded-md border p-3 bg-gray-50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Skeleton className="h-4 w-4" />
                    <Skeleton className="h-4 w-32" />
                  </div>
                  <Skeleton className="h-3 w-24" />
                </div>
                <Skeleton className="h-3 w-48 mt-2" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
      
      {/* Chart loading skeletons */}
      <Skeleton className="h-[400px]" />
      <Skeleton className="h-[400px]" />
    </div>
  );
}
