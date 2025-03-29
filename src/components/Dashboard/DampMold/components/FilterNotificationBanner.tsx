
import React from "react";

interface FilterNotificationBannerProps {
  activeFilter: string | null;
}

export const FilterNotificationBanner: React.FC<FilterNotificationBannerProps> = ({ activeFilter }) => {
  if (!activeFilter) return null;
  
  return (
    <div className="bg-blue-50/50 dark:bg-blue-900/30 p-3 border-b border-blue-100 dark:border-blue-900/50">
      <p className="text-sm text-blue-700 dark:text-blue-300">
        Filtering by: <span className="font-medium capitalize">{activeFilter}</span>
        {activeFilter === 'high-risk' && " - showing only zones in Alarm state"}
        {activeFilter === 'caution' && " - showing only zones in Caution state"}
        {activeFilter === 'normal' && " - showing only zones in Good state"}
      </p>
    </div>
  );
};
