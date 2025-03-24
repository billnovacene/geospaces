
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export const ProjectLoadingState = () => {
  return (
    <div className="container mx-auto py-6">
      <Button variant="outline" size="sm" asChild className="mb-6">
        <a href="/">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Dashboard
        </a>
      </Button>
      
      <div className="space-y-4">
        <Skeleton className="h-12 w-80" />
        <Card>
          <CardHeader>
            <Skeleton className="h-7 w-40" />
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
