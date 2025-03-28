
import React from "react";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { NavigationSettings } from "./types";

interface BordersTabProps {
  settings: NavigationSettings;
  handleChange: (property: keyof NavigationSettings, value: string) => void;
}

export const BordersTab = ({ settings, handleChange }: BordersTabProps) => {
  return (
    <div className="space-y-4">
      <h3 className="heading-3">Border Styles</h3>
      <Separator />
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="borderWidth">Border Width</Label>
          <select
            id="borderWidth"
            className="w-full mt-1.5 h-10 rounded-md border border-input bg-background px-3 py-2"
            value={settings.borderWidth}
            onChange={(e) => handleChange('borderWidth', e.target.value)}
          >
            <option value="0px">None (0px)</option>
            <option value="1px">Thin (1px)</option>
            <option value="2px">Medium (2px)</option>
            <option value="3px">Thick (3px)</option>
          </select>
        </div>
        
        <div>
          <Label htmlFor="borderColor">Border Color</Label>
          <select
            id="borderColor"
            className="w-full mt-1.5 h-10 rounded-md border border-input bg-background px-3 py-2"
            value={settings.borderColor}
            onChange={(e) => handleChange('borderColor', e.target.value)}
          >
            <option value="transparent">Transparent</option>
            <option value="var(--border)">Default Border</option>
            <option value="var(--primary)">Primary</option>
            <option value="var(--accent)">Accent</option>
            <option value="#e5e7eb">Light Gray</option>
          </select>
        </div>
        
        <div>
          <Label htmlFor="borderRadius">Border Radius</Label>
          <select
            id="borderRadius"
            className="w-full mt-1.5 h-10 rounded-md border border-input bg-background px-3 py-2"
            value={settings.borderRadius}
            onChange={(e) => handleChange('borderRadius', e.target.value)}
          >
            <option value="0">None (0px)</option>
            <option value="4px">Small (4px)</option>
            <option value="8px">Medium (8px)</option>
            <option value="12px">Large (12px)</option>
          </select>
        </div>
        
        <div>
          <Label htmlFor="sidebarBackground">Sidebar Background</Label>
          <select
            id="sidebarBackground"
            className="w-full mt-1.5 h-10 rounded-md border border-input bg-background px-3 py-2"
            value={settings.sidebarBackground}
            onChange={(e) => handleChange('sidebarBackground', e.target.value)}
          >
            <option value="bg-background">Default (Background)</option>
            <option value="bg-sidebar">Sidebar</option>
            <option value="bg-white">White</option>
            <option value="bg-gray-50">Light Gray</option>
            <option value="bg-gray-900">Dark Gray</option>
          </select>
        </div>
      </div>
    </div>
  );
};
