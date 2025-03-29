
import React from "react";
import { Button } from "@/components/ui/button";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { AlertTriangleIcon, LoaderIcon } from "lucide-react";

interface ErrorStateViewProps {
  error: Error;
  onRetry: () => void;
  isLoading: boolean;
}

export function ErrorStateView({ error, onRetry, isLoading }: ErrorStateViewProps) {
  return (
    <Alert variant="destructive" className="mb-6">
      <AlertTriangleIcon className="h-4 w-4" />
      <AlertTitle>Error Loading Damp & Mold Data</AlertTitle>
      <AlertDescription>
        <div className="mt-2">{error.message}</div>
        <Button 
          onClick={onRetry} 
          disabled={isLoading} 
          variant="outline" 
          size="sm" 
          className="mt-4"
        >
          {isLoading ? (
            <>
              <LoaderIcon className="mr-2 h-4 w-4 animate-spin" />
              Retrying...
            </>
          ) : (
            <>Retry</>
          )}
        </Button>
      </AlertDescription>
    </Alert>
  );
}
