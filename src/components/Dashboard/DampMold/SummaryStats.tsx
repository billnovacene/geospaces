
import React from "react";

export interface StatItem {
  value: string;
  label: string;
  type: "high-risk" | "caution" | "success" | "normal";
}

interface SummaryStatsProps {
  stats: StatItem[];
}

export function SummaryStats({ stats }: SummaryStatsProps) {
  return (
    <>
      {/* Desktop view for stats - only show on larger screens */}
      <div className="hidden md:flex space-x-4">
        {stats.map((stat, index) => (
          <div key={index} className="flex flex-col space-y-1">
            <div className="text-2xl font-medium text-gray-900">
              {stat.value}
            </div>
            <div className="body-small mb-1">
              {stat.label.split(' ').map((word, i) => (
                <span key={i} className="block leading-tight">{word}</span>
              ))}
            </div>
            {stat.type === "high-risk" && (
              <div className="w-full h-1 bg-red-500"></div>
            )}
            {stat.type === "caution" && (
              <div className="w-full h-1 bg-amber-400"></div>
            )}
            {stat.type === "success" && (
              <div className="w-full h-1 bg-green-500"></div>
            )}
            {stat.type === "normal" && (
              <div className="w-full h-1 bg-blue-500"></div>
            )}
          </div>
        ))}
      </div>
      
      {/* Mobile view for stats - only show on small screens */}
      <div className="grid grid-cols-5 gap-4 mb-8 md:hidden mx-auto w-3/4">
        {stats.map((stat, index) => (
          <div key={index} className="flex flex-col space-y-1">
            <div className="text-4xl font-medium text-gray-900">
              {stat.value}
            </div>
            <div className="body-small mb-1 flex flex-col">
              {stat.label.split(' ').map((word, i) => (
                <span key={i}>{word}</span>
              ))}
            </div>
            {stat.type === "high-risk" && (
              <div className="w-16 h-1 bg-red-500"></div>
            )}
            {stat.type === "caution" && (
              <div className="w-16 h-1 bg-amber-400"></div>
            )}
            {stat.type === "success" && (
              <div className="w-16 h-1 bg-green-500"></div>
            )}
            {stat.type === "normal" && (
              <div className="w-16 h-1 bg-blue-500"></div>
            )}
          </div>
        ))}
      </div>
    </>
  );
}
