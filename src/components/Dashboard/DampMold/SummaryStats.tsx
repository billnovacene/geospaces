
import React from "react";

export interface StatItem {
  value: string;
  label: string;
  type: "high-risk" | "caution" | "success" | "normal";
  key?: string;
  secondaryLabel?: string;
}

interface SummaryStatsProps {
  stats: StatItem[];
  onStatClick?: (stat: StatItem) => void;
  activeFilter?: string | null;
}

export function SummaryStats({
  stats,
  onStatClick,
  activeFilter = null
}: SummaryStatsProps) {
  const handleClick = (stat: StatItem) => {
    if (onStatClick) {
      onStatClick(stat);
    }
  };
  
  // Helper function to get color based on type
  const getTypeColor = (type: string): string => {
    switch(type) {
      case "high-risk": return "text-red-500 dark:text-red-400";
      case "caution": return "text-amber-400 dark:text-amber-300";
      case "success": return "text-green-500 dark:text-green-400";
      case "normal": return "text-blue-500 dark:text-blue-400";
      default: return "text-gray-500 dark:text-gray-400";
    }
  };
  
  return <>
      {/* Desktop view for stats - only show on larger screens */}
      <div className="hidden md:flex space-x-4 items-stretch w-3/4 mx-auto">
        {stats.map((stat, index) => {
          const typeColor = getTypeColor(stat.type);
          const words = stat.label.split(' ');
          const primaryLabel = words[0]; // First word (e.g., "Buildings", "Zones")
          const secondaryLabel = stat.secondaryLabel || words.slice(1).join(' '); // Remaining words or custom secondary label
          
          return (
            <div 
              key={index} 
              className={`flex flex-col flex-1 bg-card dark:bg-card rounded-lg overflow-hidden shadow-sm transition-all duration-150 ${onStatClick ? 'cursor-pointer hover:shadow-md' : ''} ${activeFilter === stat.key ? 'ring-2 ring-primary dark:ring-primary' : ''}`}
              onClick={() => handleClick(stat)}
            >
              <div className="flex-grow flex flex-col p-4">
                {/* Text content right-aligned */}
                <div className="flex flex-col items-end">
                  {/* Metric value at the top with larger font */}
                  <div className="text-3xl font-medium text-card-foreground mb-1">
                    {stat.value}
                  </div>
                  
                  {/* Primary label (e.g., "Buildings" or "Zones") */}
                  <div className="text-sm font-medium text-card-foreground/80">
                    {primaryLabel}
                  </div>
                  
                  {/* Secondary label with status color */}
                  <div className={`text-xs font-medium mb-2 ${typeColor}`}>
                    {secondaryLabel}
                  </div>
                </div>
              </div>
              
              {/* Colored line at the bottom - half width, right-aligned */}
              <div className="flex justify-end">
                {stat.type === "high-risk" && <div className={`w-1/2 h-1 ${activeFilter === stat.key ? 'bg-red-600 dark:bg-red-500' : 'bg-red-500 dark:bg-red-400'} ${onStatClick ? 'group-hover:bg-red-600 dark:group-hover:bg-red-500' : ''}`}></div>}
                {stat.type === "caution" && <div className={`w-1/2 h-1 ${activeFilter === stat.key ? 'bg-amber-500 dark:bg-amber-400' : 'bg-amber-400 dark:bg-amber-300'} ${onStatClick ? 'group-hover:bg-amber-500 dark:group-hover:bg-amber-400' : ''}`}></div>}
                {stat.type === "success" && <div className={`w-1/2 h-1 ${activeFilter === stat.key ? 'bg-green-600 dark:bg-green-500' : 'bg-green-500 dark:bg-green-400'} ${onStatClick ? 'group-hover:bg-green-600 dark:group-hover:bg-green-500' : ''}`}></div>}
                {stat.type === "normal" && <div className={`w-1/2 h-1 ${activeFilter === stat.key ? 'bg-blue-600 dark:bg-blue-500' : 'bg-blue-500 dark:bg-blue-400'} ${onStatClick ? 'group-hover:bg-blue-600 dark:group-hover:bg-blue-500' : ''}`}></div>}
              </div>
            </div>
          );
        })}
      </div>
      
      {/* Mobile view for stats - only show on small screens */}
      <div className="grid grid-cols-2 gap-4 mb-8 md:hidden mx-auto w-full">
        {stats.map((stat, index) => {
          const typeColor = getTypeColor(stat.type);
          const words = stat.label.split(' ');
          const primaryLabel = words[0]; // First word (e.g., "Buildings", "Zones")
          const secondaryLabel = stat.secondaryLabel || words.slice(1).join(' '); // Remaining words or custom secondary label
          
          return (
            <div 
              key={index} 
              className={`flex flex-col p-3 bg-card dark:bg-card rounded-lg shadow-sm ${onStatClick ? 'cursor-pointer hover:shadow-md' : ''} ${activeFilter === stat.key ? 'ring-2 ring-primary dark:ring-primary' : ''}`}
              onClick={() => handleClick(stat)}
            >
              {/* Text content right-aligned */}
              <div className="flex flex-col items-end">
                {/* Metric value at the top with larger font */}
                <div className="text-2xl font-medium text-card-foreground mb-1">
                  {stat.value}
                </div>
                
                {/* Primary label (e.g., "Buildings" or "Zones") */}
                <div className="text-sm font-medium text-card-foreground/80">
                  {primaryLabel}
                </div>
                
                {/* Secondary label with status color */}
                <div className={`text-xs font-medium mb-2 ${typeColor}`}>
                  {secondaryLabel}
                </div>
              </div>
              
              {/* Colored line at the bottom - half width, right-aligned */}
              <div className="flex justify-end">
                {stat.type === "high-risk" && <div className={`w-1/2 h-1 ${activeFilter === stat.key ? 'bg-red-600 dark:bg-red-500' : 'bg-red-500 dark:bg-red-400'}`}></div>}
                {stat.type === "caution" && <div className={`w-1/2 h-1 ${activeFilter === stat.key ? 'bg-amber-500 dark:bg-amber-400' : 'bg-amber-400 dark:bg-amber-300'}`}></div>}
                {stat.type === "success" && <div className={`w-1/2 h-1 ${activeFilter === stat.key ? 'bg-green-600 dark:bg-green-500' : 'bg-green-500 dark:bg-green-400'}`}></div>}
                {stat.type === "normal" && <div className={`w-1/2 h-1 ${activeFilter === stat.key ? 'bg-blue-600 dark:bg-blue-500' : 'bg-blue-500 dark:bg-blue-400'}`}></div>}
              </div>
            </div>
          );
        })}
      </div>
    </>;
}
