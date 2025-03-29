
import React from "react";

interface FilterNotificationBannerProps {
  activeFilter: string | null;
  isImporting?: boolean;
}

export function FilterNotificationBanner({ activeFilter, isImporting }: FilterNotificationBannerProps) {
  if (isImporting) {
    return (
      <div className="bg-blue-50/50 dark:bg-blue-900/30 p-3 border-b border-blue-100 dark:border-blue-900/50">
        <p className="text-sm text-blue-700 dark:text-blue-300 flex items-center">
          <span className="inline-block h-2 w-2 bg-blue-500 rounded-full animate-pulse mr-2"></span>
          Importing data from Google Sheet... Please wait.
        </p>
      </div>
    );
  }
  
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
