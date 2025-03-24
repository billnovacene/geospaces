
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";

export const ProjectErrorState = () => {
  return (
    <div className="container mx-auto py-6">
      <Button variant="outline" size="sm" asChild className="mb-6">
        <a href="/">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Dashboard
        </a>
      </Button>
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col items-center justify-center h-40 text-center">
            <p className="text-destructive mb-2">Failed to load project</p>
            <p className="text-muted-foreground text-sm">Please try again later or check your connection</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
