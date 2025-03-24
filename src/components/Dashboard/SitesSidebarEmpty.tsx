
import { AlertTriangle } from "lucide-react";

export function SitesSidebarEmpty() {
  return (
    <div className="py-2.5 px-5 text-sm text-[#8E9196]">
      <div className="flex items-center gap-2 mb-2">
        <AlertTriangle className="h-4 w-4" />
        <span>No sites available for this project</span>
      </div>
      <p className="text-xs text-zinc-400">Try selecting a different project</p>
    </div>
  );
}
