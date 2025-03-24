
import { Link } from "react-router-dom";
import { AlertTriangle, Building } from "lucide-react";

export function NoSiteSelected() {
  return (
    <div className="py-3 px-5 text-sm text-zinc-500 flex flex-col gap-2">
      <div className="flex items-center gap-2 text-amber-600">
        <AlertTriangle className="h-4 w-4" />
        <span className="font-medium">No site selected</span>
      </div>
      <div className="flex items-center gap-2 text-zinc-400 mt-1">
        <Building className="h-4 w-4" />
        <span>Select a site to view its zones</span>
      </div>
      <Link to="/" className="text-xs text-primary hover:underline mt-2">
        Go to dashboard
      </Link>
    </div>
  );
}
