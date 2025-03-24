
import { Link } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";

interface DashboardItemProps {
  name: string;
  count: number;
  checked?: boolean;
  to?: string;
}

export function SidebarDashboardItem({
  name,
  count,
  checked = true,
  to
}: DashboardItemProps) {
  const location = useLocation();
  const isActive = to && location.pathname === to;
  
  const content = (
    <div className={cn(
      "flex items-center justify-between py-2.5 px-5 cursor-pointer bg-white sidebar-hover-item",
      isActive && "bg-[#F9F9FA]"
    )}>
      <div className="flex items-center gap-2">
        <span className="text-xs text-zinc-500">▶</span>
        <span className={cn("text-sm font-medium", isActive ? "text-zinc-950" : "text-zinc-800")}>{name}</span>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-sm text-[#8E9196]">{count}</span>
        <Checkbox checked={checked} className="rounded-[3px] border-[#8E9196] bg-neutral-200 hover:bg-neutral-100 text-zinc-400" />
      </div>
    </div>
  );
  
  if (to) {
    return <Link to={to}>{content}</Link>;
  }
  
  return content;
}
