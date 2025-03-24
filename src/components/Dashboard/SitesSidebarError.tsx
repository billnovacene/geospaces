
import { AlertTriangle } from "lucide-react";

interface SitesSidebarErrorProps {
  onRetry: () => void;
}

export function SitesSidebarError({ onRetry }: SitesSidebarErrorProps) {
  return (
    <div className="py-2.5 px-5 text-sm text-red-500 flex items-center gap-2">
      <AlertTriangle className="h-4 w-4" />
      <span>Error loading sites</span>
      <button 
        onClick={onRetry} 
        className="ml-2 text-xs text-primary hover:underline"
      >
        Retry
      </button>
    </div>
  );
}
