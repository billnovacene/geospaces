
import React from "react";

interface FilterNotificationBannerProps {
  activeFilter: string | null;
}

export function FilterNotificationBanner({ activeFilter }: FilterNotificationBannerProps) {
  if (!activeFilter) return null;
  
  return (
    <div className="bg-blue-50/50 dark:bg-blue-900/30 p-3 border-b border-blue-100 dark:border-blue-900/50">
      <p className="text-sm text-blue-700 dark:text-blue-300">
        Filtering by: <span className="font-medium capitalize">{activeFilter}</span>
        {activeFilter === 'high-risk' && " - showing only high risk zones"}
        {activeFilter === 'caution' && " - showing only caution zones"}
        {activeFilter === 'normal' && " - showing only normal zones"}
      </p>
    </div>
  );
}
