
import React from "react";
import { Link } from "react-router-dom";
import { Building } from "lucide-react";
import { cn } from "@/lib/utils";
import { SiteStatusBadge } from "@/components/Dashboard/SiteStatusBadge";
import { Site } from "@/services/interfaces";

interface SiteListItemProps {
  site: Site;
  isActive?: boolean;
  linkTo?: string;
}

export const SiteListItem = ({ 
  site, 
  isActive = false,
  linkTo 
}: SiteListItemProps) => {
  const defaultLink = `/site/${site.id}`;
  const sitePath = linkTo || defaultLink;

  return (
    <Link to={sitePath} className="block">
      <div className={cn(
        "flex items-center justify-between py-2.5 px-5 cursor-pointer hover:bg-[#F5F5F6]",
        isActive && "bg-[#F9F9FA] border-l-4 border-primary"
      )}>
        <div className="flex items-center gap-2">
          <Building className={cn(
            "h-4 w-4",
            isActive ? "text-primary" : "text-zinc-600"
          )} />
          <span className={cn(
            "text-sm font-medium text-gray-900",
            isActive && "text-primary"
          )}>
            {site.name}
          </span>
        </div>
        <SiteStatusBadge status={site.status || "Active"} />
      </div>
    </Link>
  );
};
