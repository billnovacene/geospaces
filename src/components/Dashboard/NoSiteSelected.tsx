
import { Link } from "react-router-dom";
import { AlertTriangle } from "lucide-react";

export function NoSiteSelected() {
  return (
    <div className="py-2.5 px-5 text-sm text-zinc-500 flex flex-col gap-2">
      <div className="flex items-center gap-2 text-amber-600">
        <AlertTriangle className="h-4 w-4" />
        <span>No site selected</span>
      </div>
      <p className="text-xs text-zinc-400">Select a site to view its zones</p>
      <Link to="/" className="text-xs text-primary hover:underline mt-1">
        Go to dashboard
      </Link>
    </div>
  );
}
