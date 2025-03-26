
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
    <div className="mb-6">
      <Breadcrumb className="mb-4">
        <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <Link to="/" className="flex items-center">
              <Home className="mr-1 h-3 w-3" />
              Home
            </Link>
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <Link to="/dashboard/damp-mold" className="flex items-center">
              <LayoutDashboard className="mr-1 h-3 w-3" />
              Dashboards
            </Link>
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <Link to="#" className="flex items-center font-medium">
              <Droplet className="mr-1 h-3 w-3" />
              Damp & Mold
            </Link>
          </BreadcrumbLink>
        </BreadcrumbItem>
        {contextType !== "all" && (
          <>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink className="font-medium">
                {contextName}
              </BreadcrumbLink>
            </BreadcrumbItem>
          </>
        )}
      </Breadcrumb>
      
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold text-gray-900">
          {contextType === "zone" && `Zone: ${contextName}`}
          {contextType === "site" && `Site: ${contextName}`}
          {contextType === "all" && "All Locations"}
        </h1>
      </div>
      
      {isUsingMockData && (
        <Card className="bg-yellow-50 border-yellow-200 mb-4">
          <CardContent className="p-3 flex items-center text-sm text-yellow-800">
            <AlertTriangle className="h-4 w-4 mr-2 flex-shrink-0" />
            <p>
              Using simulated data for demonstration. Connect real sensors for accurate monitoring.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
