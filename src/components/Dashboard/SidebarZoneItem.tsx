
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

interface ZoneItemProps {
  name: string;
  count: number;
  id: number;
  isActive?: boolean;
}

export function SidebarZoneItem({
  name,
  count,
  id,
  isActive = false
}: ZoneItemProps) {
  return (
    <Link to={`/zone/${id}`} className="block">
      <div className={cn(
        "flex items-center justify-between py-2.5 px-5 cursor-pointer bg-white sidebar-hover-item",
        isActive && "bg-[#F9F9FA]"
      )}>
        <div className="flex items-center gap-2">
          <span className="text-xs text-zinc-600">▶</span>
          <span className={isActive ? "nav-item-active" : "nav-item"}>{name}</span>
        </div>
        <span className="text-sm text-[#8E9196]">{count}</span>
      </div>
    </Link>
  );
}
