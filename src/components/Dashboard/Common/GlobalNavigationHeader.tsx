
import React, { useState } from "react";
import { GlobalBreadcrumbNav } from "./GlobalBreadcrumbNav";
import { MonthYearSelector } from "./MonthYearSelector";
import { useLocation } from "react-router-dom";

interface GlobalNavigationHeaderProps {
  onDateChange?: (date: Date) => void;
  initialDate?: Date;
  customDashboardType?: string;
}

export function GlobalNavigationHeader({ 
  onDateChange,
  initialDate,
  customDashboardType
}: GlobalNavigationHeaderProps) {
  const location = useLocation();
  
  return (
    <div className="w-full bg-white dark:bg-slate-900 mb-6 sticky top-0 z-40 border-b border-gray-200 dark:border-gray-800 shadow-sm">
      <div className="dashboard-container">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center h-16 text-gray-800 dark:text-white">
          <GlobalBreadcrumbNav customDashboardType={customDashboardType} />
          
          <MonthYearSelector 
            onDateChange={onDateChange}
            initialDate={initialDate}
          />
        </div>
      </div>
    </div>
  );
}
