
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertCircle, RefreshCw } from "lucide-react";

interface ErrorStateViewProps {
  error: Error | null;
  onRetry: () => void;
  isLoading: boolean;
}

export function ErrorStateView({ error, onRetry, isLoading }: ErrorStateViewProps) {
  return (
    <Card className="shadow-md border-0 dark:bg-gray-800/50">
      <CardContent className="pt-6 px-6 pb-8">
        <div className="flex flex-col items-center text-center gap-4">
          <div className="h-12 w-12 rounded-full bg-red-50 dark:bg-red-900/30 flex items-center justify-center">
            <AlertCircle className="h-6 w-6 text-red-500 dark:text-red-400" />
          </div>
          
          <div className="space-y-2">
            <h3 className="text-xl font-medium dark:text-white">Error loading data</h3>
            <p className="text-muted-foreground dark:text-gray-300 max-w-md">
              There was an error loading the damp & mold data.
            </p>
            
            {error && (
              <div className="p-3 bg-red-50 dark:bg-red-900/20 rounded-md mt-2">
                <p className="text-sm text-red-700 dark:text-red-300 font-mono">
                  {error.message}
                </p>
              </div>
            )}
          </div>
          
          <Button 
            variant="default" 
            onClick={onRetry}
            disabled={isLoading}
            className="gap-2"
          >
            {isLoading ? (
              <RefreshCw className="h-4 w-4 animate-spin" />
            ) : (
              <RefreshCw className="h-4 w-4" />
            )}
            {isLoading ? "Retrying..." : "Retry"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
