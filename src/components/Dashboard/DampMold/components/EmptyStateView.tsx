
import React from "react";
import { Button } from "@/components/ui/button";
import { DatabaseIcon, LoaderIcon } from "lucide-react";

interface EmptyStateViewProps {
  onGenerateData: () => void;
  isLoading: boolean;
  contextInfo: any;
}

export function EmptyStateView({ onGenerateData, isLoading, contextInfo }: EmptyStateViewProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center space-y-6">
      <DatabaseIcon className="h-16 w-16 text-muted-foreground/50" />
      <div className="space-y-2">
        <h3 className="text-xl font-medium">No Damp & Mold Data Found</h3>
        <p className="text-muted-foreground max-w-md">
          {contextInfo.contextType === "zone"
            ? `There is no data for this zone (${contextInfo.contextName}).`
            : contextInfo.contextType === "site"
            ? `There is no data for this site (${contextInfo.contextName}).`
            : "There is no damp & mold data in the database."}
        </p>
      </div>
      <Button 
        onClick={onGenerateData} 
        disabled={isLoading} 
        variant="default"
        className="mt-4"
      >
        {isLoading ? (
          <>
            <LoaderIcon className="mr-2 h-4 w-4 animate-spin" />
            Generating...
          </>
        ) : (
          <>Generate Test Data</>
        )}
      </Button>
    </div>
  );
}
