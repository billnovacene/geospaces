
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
    <div className="w-full bg-white border-b border-gray-200 mb-6">
      <div className="container mx-auto py-4 px-4 md:px-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
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
