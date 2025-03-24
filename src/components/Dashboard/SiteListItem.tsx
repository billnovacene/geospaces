
import { Building } from "lucide-react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Site } from "@/services/interfaces";

interface SiteListItemProps {
  site: Site;
  isActive: boolean;
}

export function SiteListItem({ site, isActive }: SiteListItemProps) {
  return (
    <Link key={site.id} to={`/site/${site.id}`}>
      <div className={cn(
        "flex items-center justify-between py-2.5 px-5 cursor-pointer hover:bg-[#F5F5F6]",
        isActive && "bg-[#F9F9FA] font-bold border-l-4 border-primary text-primary"
      )}>
        <div className="flex items-center gap-2">
          <Building className="h-4 w-4 text-[#8E9196]" />
          <span className="text-sm font-medium text-gray-900">{site.name}</span>
        </div>
        <span className="text-sm text-[#8E9196]">
          {typeof site.devices === 'number' ? site.devices : 0} devices
        </span>
      </div>
    </Link>
  );
}
