
import React from "react";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Card, CardContent } from "@/components/ui/card";
import { AlertTriangle, Home, LayoutDashboard, Droplet } from "lucide-react";
import { Link } from "react-router-dom";

interface DampMoldHeaderProps {
  contextType: "zone" | "site" | "all";
  contextName?: string;
  isUsingMockData: boolean;
}

export function DampMoldHeader({ 
  contextType, 
  contextName = "Unknown",
  isUsingMockData 
}: DampMoldHeaderProps) {
  return (
    <div className="mb-6 mt-4">
      <Breadcrumb className="mb-4">
        <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <Link to="/" className="flex items-center text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300">
              <Home className="mr-1 h-3 w-3" />
              Home
            </Link>
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <Link to="/dashboard/damp-mold" className="flex items-center text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300">
              <LayoutDashboard className="mr-1 h-3 w-3" />
              Dashboards
            </Link>
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <Link to="#" className="flex items-center font-medium text-blue-700 dark:text-blue-300">
              <Droplet className="mr-1 h-3 w-3" />
              Damp & Mold
            </Link>
          </BreadcrumbLink>
        </BreadcrumbItem>
        {contextType !== "all" && (
          <>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink className="font-medium text-blue-800 dark:text-blue-200">
                {contextName}
              </BreadcrumbLink>
            </BreadcrumbItem>
          </>
        )}
      </Breadcrumb>
      
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold text-blue-900 dark:text-blue-100">
          {contextType === "zone" && `Zone: ${contextName}`}
          {contextType === "site" && `Site: ${contextName}`}
          {contextType === "all" && "All Locations"}
        </h1>
      </div>
      
      {isUsingMockData && (
        <Card className="bg-amber-50 border-amber-200 dark:bg-amber-900/20 dark:border-amber-800/50 mb-4">
          <CardContent className="p-3 flex items-center text-sm text-amber-800 dark:text-amber-300">
            <AlertTriangle className="h-4 w-4 mr-2 flex-shrink-0 text-amber-600 dark:text-amber-400" />
            <p>
              Using simulated data for demonstration. Connect real sensors for accurate monitoring.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
