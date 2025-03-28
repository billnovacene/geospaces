
import React from "react";
import { StatItem, SummaryStats } from "./SummaryStats";

interface DashboardHeaderProps {
  title: string;
  subtitle?: string;
  stats: StatItem[];
  onStatClick?: (stat: StatItem) => void;
  activeFilter?: string | null;
}

export function DashboardHeader({
  title,
  subtitle,
  stats,
  onStatClick,
  activeFilter
}: DashboardHeaderProps) {
  return (
    <div className="mb-6">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between px-[20px] py-[20px] bg-card dark:bg-gray-800/50">
        <div className="flex flex-col mb-6 md:mb-0 md:w-1/4 pr-4">
          <h1 className="heading-1 mb-1 font-light text-left text-3xl text-gray-800 dark:text-white">{title}</h1>
          {subtitle && (
            <p className="body-normal text-sm font-extralight text-muted-foreground dark:text-gray-300">{subtitle}</p>
          )}
        </div>
        
        {/* Summary stats displayed via the reusable component */}
        <div className="md:w-3/4">
          <SummaryStats 
            stats={stats} 
            onStatClick={onStatClick}
            activeFilter={activeFilter}
          />
        </div>
      </div>
    </div>
  );
}
