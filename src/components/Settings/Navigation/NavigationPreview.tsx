
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { NavigationSettings } from "./types";
import { ChevronDown, Home, LayoutDashboard, Settings, BarChart, Users } from "lucide-react";

interface NavigationPreviewProps {
  settings: NavigationSettings;
}

export function NavigationPreview({ settings }: NavigationPreviewProps) {
  // Apply the current settings to a preview of navigation items
  return (
    <Card className="w-full">
      <CardContent className="p-0 overflow-hidden">
        <div className="p-4 border-b border-border">
          <h3 className="text-lg font-medium">Navigation Preview</h3>
        </div>
        
        {/* Sidebar-style preview */}
        <div 
          className="p-4 border-l-2" 
          style={{
            borderColor: settings.borderColor,
            borderLeftWidth: settings.borderWidth,
            borderRadius: settings.borderRadius,
            backgroundColor: "var(--background)"
          }}
        >
          {/* Active nav item */}
          <div className="mb-2 flex items-center gap-2 p-2 rounded-md nav-item-active">
            <Home className="h-4 w-4" />
            <span>Dashboard</span>
          </div>
          
          {/* Regular nav items */}
          <div className="mb-2 flex items-center gap-2 p-2 rounded-md nav-item">
            <LayoutDashboard className="h-4 w-4" />
            <span>Overview</span>
          </div>
          
          <div className="mb-2 flex items-center gap-2 p-2 rounded-md nav-item">
            <BarChart className="h-4 w-4" />
            <span>Analytics</span>
          </div>
          
          {/* With dropdown */}
          <div className="mb-2 flex items-center justify-between p-2 rounded-md nav-item">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              <span>Team</span>
            </div>
            <ChevronDown className="h-4 w-4" />
          </div>
          
          <div className="mb-2 flex items-center gap-2 p-2 rounded-md nav-item">
            <Settings className="h-4 w-4" />
            <span>Settings</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
