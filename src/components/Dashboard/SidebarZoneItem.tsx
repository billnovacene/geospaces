
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
        "flex items-center justify-between py-2.5 px-5 cursor-pointer sidebar-hover-item",
        isActive ? "nav-item-active" : "nav-item",
        isActive && "dark:bg-gray-700"
      )}>
        <div className="flex items-center gap-2">
          <span className="text-xs text-zinc-600 dark:text-zinc-400">▶</span>
          <span className="dark:text-gray-300">{name}</span>
        </div>
        <span className="text-sm text-[#8E9196] dark:text-gray-400">{count}</span>
      </div>
    </Link>
  );
}
