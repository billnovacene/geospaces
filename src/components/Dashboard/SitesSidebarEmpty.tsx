
import { AlertTriangle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface SitesSidebarEmptyProps {
  onRetry?: () => void;
  projectId?: number;
  isLoading?: boolean;
  error?: any;
}

export function SitesSidebarEmpty({ 
  onRetry, 
  projectId, 
  isLoading, 
  error 
}: SitesSidebarEmptyProps) {
  return (
    <div className="py-2.5 px-5 text-sm text-[#8E9196]">
      <div className="flex items-center gap-2 mb-2">
        <AlertTriangle className="h-4 w-4" />
        <span>No sites available for project ID: {projectId || 'Unknown'}</span>
      </div>
      <p className="text-xs text-zinc-400 mb-2">
        {isLoading ? "Loading sites..." : 
         error ? "Error loading sites. Please try again." : 
         "Check your connection or refresh to try again."}
      </p>
      
      {onRetry && (
        <Button 
          variant="outline" 
          size="sm" 
          onClick={onRetry}
          className="w-full text-xs mt-1 h-8"
        >
          <RefreshCw className="h-3 w-3 mr-1" />
          Refresh Sites
        </Button>
      )}
    </div>
  );
}
