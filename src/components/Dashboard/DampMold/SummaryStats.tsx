
import React from "react";

export interface StatItem {
  value: string;
  label: string;
  type: "high-risk" | "caution" | "success" | "normal";
  key?: string;
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
  
  return <>
      {/* Desktop view for stats - only show on larger screens */}
      <div className="hidden md:flex space-x-4 items-stretch w-3/4 mx-auto">
        {stats.map((stat, index) => (
          <div 
            key={index} 
            className={`flex flex-col flex-1 bg-white rounded-b-lg overflow-hidden shadow-sm transition-all duration-150 ${onStatClick ? 'cursor-pointer hover:shadow-md' : ''} ${activeFilter === stat.key ? 'ring-2 ring-blue-400' : ''}`}
            onClick={() => handleClick(stat)}
          >
            <div className="flex-grow flex flex-col p-3 px-[2px] py-[2px]">
              <div className="text-2xl font-medium text-gray-900 mb-1">
                {stat.value}
              </div>
              <div className="body-small mb-1">
                {stat.label.split(' ').map((word, i) => (
                  <span key={i} className="block leading-tight">{word}</span>
                ))}
              </div>
            </div>
            {stat.type === "high-risk" && <div className={`w-full h-1 ${activeFilter === stat.key ? 'bg-red-600' : 'bg-red-500'} ${onStatClick ? 'group-hover:bg-red-600' : ''}`}></div>}
            {stat.type === "caution" && <div className={`w-full h-1 ${activeFilter === stat.key ? 'bg-amber-500' : 'bg-amber-400'} ${onStatClick ? 'group-hover:bg-amber-500' : ''}`}></div>}
            {stat.type === "success" && <div className={`w-full h-1 ${activeFilter === stat.key ? 'bg-green-600' : 'bg-green-500'} ${onStatClick ? 'group-hover:bg-green-600' : ''}`}></div>}
            {stat.type === "normal" && <div className={`w-full h-1 ${activeFilter === stat.key ? 'bg-blue-600' : 'bg-blue-500'} ${onStatClick ? 'group-hover:bg-blue-600' : ''}`}></div>}
          </div>
        ))}
      </div>
      
      {/* Mobile view for stats - only show on small screens */}
      <div className="grid grid-cols-5 gap-4 mb-8 md:hidden mx-auto w-3/4">
        {stats.map((stat, index) => (
          <div 
            key={index} 
            className={`flex flex-col space-y-1 w-full ${onStatClick ? 'cursor-pointer' : ''} ${activeFilter === stat.key ? 'ring-2 ring-blue-400 p-1 rounded' : ''}`}
            onClick={() => handleClick(stat)}
          >
            <div className="text-4xl font-medium text-gray-900">
              {stat.value}
            </div>
            <div className="body-small mb-1 flex flex-col">
              {stat.label.split(' ').map((word, i) => <span key={i}>{word}</span>)}
            </div>
            {stat.type === "high-risk" && <div className={`w-16 h-1 ${activeFilter === stat.key ? 'bg-red-600' : 'bg-red-500'}`}></div>}
            {stat.type === "caution" && <div className={`w-16 h-1 ${activeFilter === stat.key ? 'bg-amber-500' : 'bg-amber-400'}`}></div>}
            {stat.type === "success" && <div className={`w-16 h-1 ${activeFilter === stat.key ? 'bg-green-600' : 'bg-green-500'}`}></div>}
            {stat.type === "normal" && <div className={`w-16 h-1 ${activeFilter === stat.key ? 'bg-blue-600' : 'bg-blue-500'}`}></div>}
          </div>
        ))}
      </div>
    </>;
}
