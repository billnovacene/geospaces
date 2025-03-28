
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
    <div className="w-full bg-background border-b border-border mb-6 sticky top-0 z-30">
      <div className="dashboard-container">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center h-16">
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
