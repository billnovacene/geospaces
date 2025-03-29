
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Database, RefreshCw } from "lucide-react";
import { DampMoldContextInfo } from "../hooks/useDampMoldData";

interface EmptyStateViewProps {
  onGenerateData: () => void;
  isLoading: boolean;
  contextInfo: DampMoldContextInfo;
}

export function EmptyStateView({ onGenerateData, isLoading, contextInfo }: EmptyStateViewProps) {
  const contextName = contextInfo.contextType === 'zone' 
    ? `Zone ${contextInfo.zoneId}` 
    : contextInfo.contextType === 'site' 
      ? `Site ${contextInfo.siteId}` 
      : 'this location';

  return (
    <Card className="shadow-md border-0 dark:bg-gray-800/50">
      <CardContent className="pt-6 px-6 pb-8">
        <div className="flex flex-col items-center text-center gap-4">
          <div className="h-12 w-12 rounded-full bg-amber-50 dark:bg-amber-900/30 flex items-center justify-center">
            <AlertTriangle className="h-6 w-6 text-amber-500 dark:text-amber-400" />
          </div>
          
          <div className="space-y-2">
            <h3 className="text-xl font-medium dark:text-white">No damp & mold data available</h3>
            <p className="text-muted-foreground dark:text-gray-300 max-w-md">
              There is no temperature or humidity data available for {contextName} to analyze for damp and mold risk.
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <Button 
              variant="default" 
              onClick={onGenerateData}
              disabled={isLoading}
              className="gap-2"
            >
              {isLoading ? (
                <RefreshCw className="h-4 w-4 animate-spin" />
              ) : (
                <Database className="h-4 w-4" />
              )}
              {isLoading ? "Generating data..." : "Generate test data"}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
