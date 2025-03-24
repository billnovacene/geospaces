
import { AlertTriangle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface SitesSidebarEmptyProps {
  onRetry?: () => void;
}

export function SitesSidebarEmpty({ onRetry }: SitesSidebarEmptyProps) {
  return (
    <div className="py-2.5 px-5 text-sm text-[#8E9196]">
      <div className="flex items-center gap-2 mb-2">
        <AlertTriangle className="h-4 w-4" />
        <span>No sites available for this project</span>
      </div>
      <p className="text-xs text-zinc-400 mb-2">Try selecting a different project or check your connection</p>
      
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
