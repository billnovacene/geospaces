
import { AlertTriangle } from "lucide-react";

export function ZonesErrorState() {
  return (
    <div className="py-2.5 px-5 text-sm text-red-500 flex items-center gap-2">
      <AlertTriangle className="h-4 w-4" />
      <span>Error loading zones</span>
    </div>
  );
}
