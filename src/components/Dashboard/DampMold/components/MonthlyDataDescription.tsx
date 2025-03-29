
import React from "react";

interface MonthlyDataDescriptionProps {
  activeFilter: string | null;
  lastImport?: { date: string; count: number } | null;
}

export function MonthlyDataDescription({ activeFilter, lastImport }: MonthlyDataDescriptionProps) {
  return (
    <div className="w-full md:w-1/4">
      <p className="text-sm text-card-foreground/80 dark:text-gray-300">
        Monthly data shows historical patterns of humidity and temperature, 
        highlighting zones that have experienced sustained high-risk conditions.
        {activeFilter && (
          <span className="block mt-2 text-blue-700 dark:text-blue-400 font-medium">
            Currently filtering data by {activeFilter}.
          </span>
        )}
        {lastImport && (
          <span className="block mt-2 text-gray-600 dark:text-gray-400 text-xs">
            Last import: {lastImport.date} ({lastImport.count} records)
          </span>
        )}
      </p>
    </div>
  );
}
