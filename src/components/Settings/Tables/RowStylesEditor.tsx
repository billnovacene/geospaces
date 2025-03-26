
import React from "react";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { TableSettings } from "./types";

interface RowStylesEditorProps {
  settings: TableSettings;
  onSettingChange: (property: keyof TableSettings, value: string) => void;
}

export const RowStylesEditor: React.FC<RowStylesEditorProps> = ({ 
  settings, 
  onSettingChange 
}) => {
  return (
    <div className="space-y-4">
      <h3 className="heading-3">Row Styles</h3>
      <Separator />
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="rowBackground">Background</Label>
          <select
            id="rowBackground"
            className="w-full mt-1.5 h-10 rounded-md border border-input bg-background px-3 py-2"
            value={settings.rowBackground}
            onChange={(e) => onSettingChange('rowBackground', e.target.value)}
          >
            <option value="bg-card">Default (bg-card)</option>
            <option value="bg-white">White (bg-white)</option>
            <option value="bg-gray-50">Light Gray (bg-gray-50)</option>
          </select>
        </div>
        
        <div>
          <Label htmlFor="rowTextColor">Text Color</Label>
          <select
            id="rowTextColor"
            className="w-full mt-1.5 h-10 rounded-md border border-input bg-background px-3 py-2"
            value={settings.rowTextColor}
            onChange={(e) => onSettingChange('rowTextColor', e.target.value)}
          >
            <option value="text-card-foreground">Default (text-card-foreground)</option>
            <option value="text-gray-600">Gray (text-gray-600)</option>
            <option value="text-gray-800">Dark Gray (text-gray-800)</option>
          </select>
        </div>
        
        <div>
          <Label htmlFor="rowFontSize">Font Size</Label>
          <select
            id="rowFontSize"
            className="w-full mt-1.5 h-10 rounded-md border border-input bg-background px-3 py-2"
            value={settings.rowFontSize}
            onChange={(e) => onSettingChange('rowFontSize', e.target.value)}
          >
            <option value="text-xs">Small (text-xs)</option>
            <option value="text-sm">Medium (text-sm)</option>
            <option value="text-base">Large (text-base)</option>
          </select>
        </div>
        
        <div>
          <Label htmlFor="hoverBackground">Hover Background</Label>
          <select
            id="hoverBackground"
            className="w-full mt-1.5 h-10 rounded-md border border-input bg-background px-3 py-2"
            value={settings.hoverBackground}
            onChange={(e) => onSettingChange('hoverBackground', e.target.value)}
          >
            <option value="hover:bg-muted/50">Default (hover:bg-muted/50)</option>
            <option value="hover:bg-gray-100">Light Gray (hover:bg-gray-100)</option>
            <option value="hover:bg-primary/5">Primary Subtle (hover:bg-primary/5)</option>
          </select>
        </div>
      </div>
    </div>
  );
};
