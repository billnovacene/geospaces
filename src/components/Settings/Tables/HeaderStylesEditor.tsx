
import React from "react";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { TableSettings } from "./types";

interface HeaderStylesEditorProps {
  settings: TableSettings;
  onSettingChange: (property: keyof TableSettings, value: string) => void;
}

export const HeaderStylesEditor: React.FC<HeaderStylesEditorProps> = ({ 
  settings, 
  onSettingChange 
}) => {
  return (
    <div className="space-y-4">
      <h3 className="heading-3">Header Styles</h3>
      <Separator />
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="headerBackground">Background</Label>
          <select
            id="headerBackground"
            className="w-full mt-1.5 h-10 rounded-md border border-input bg-background px-3 py-2"
            value={settings.headerBackground}
            onChange={(e) => onSettingChange('headerBackground', e.target.value)}
          >
            <option value="bg-muted">Default (bg-muted)</option>
            <option value="bg-gray-50">Light Gray (bg-gray-50)</option>
            <option value="bg-gray-100">Medium Gray (bg-gray-100)</option>
            <option value="bg-primary/10">Primary Light (bg-primary/10)</option>
            <option value="bg-secondary">Secondary (bg-secondary)</option>
          </select>
        </div>
        
        <div>
          <Label htmlFor="headerTextColor">Text Color</Label>
          <select
            id="headerTextColor"
            className="w-full mt-1.5 h-10 rounded-md border border-input bg-background px-3 py-2"
            value={settings.headerTextColor}
            onChange={(e) => onSettingChange('headerTextColor', e.target.value)}
          >
            <option value="text-muted-foreground">Default (text-muted-foreground)</option>
            <option value="text-gray-600">Gray (text-gray-600)</option>
            <option value="text-gray-800">Dark Gray (text-gray-800)</option>
            <option value="text-primary">Primary (text-primary)</option>
          </select>
        </div>
        
        <div>
          <Label htmlFor="headerFontSize">Font Size</Label>
          <select
            id="headerFontSize"
            className="w-full mt-1.5 h-10 rounded-md border border-input bg-background px-3 py-2"
            value={settings.headerFontSize}
            onChange={(e) => onSettingChange('headerFontSize', e.target.value)}
          >
            <option value="text-xs">Small (text-xs)</option>
            <option value="text-sm">Medium (text-sm)</option>
            <option value="text-base">Large (text-base)</option>
          </select>
        </div>
        
        <div>
          <Label htmlFor="headerFontWeight">Font Weight</Label>
          <select
            id="headerFontWeight"
            className="w-full mt-1.5 h-10 rounded-md border border-input bg-background px-3 py-2"
            value={settings.headerFontWeight}
            onChange={(e) => onSettingChange('headerFontWeight', e.target.value)}
          >
            <option value="font-normal">Normal (400)</option>
            <option value="font-medium">Medium (500)</option>
            <option value="font-semibold">Semibold (600)</option>
          </select>
        </div>
      </div>
    </div>
  );
};
