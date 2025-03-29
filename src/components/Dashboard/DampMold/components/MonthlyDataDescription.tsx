
import React from "react";

interface MonthlyDataDescriptionProps {
  activeFilter: string | null;
}

export function MonthlyDataDescription({ activeFilter }: MonthlyDataDescriptionProps) {
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
      </p>
    </div>
  );
}
