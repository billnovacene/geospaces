
import React from "react";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { NavigationSettings } from "./types";
import { NavigationPreview } from "./NavigationPreview";

interface GeneralTabProps {
  settings: NavigationSettings;
  handleChange: (property: keyof NavigationSettings, value: string) => void;
}

export const GeneralTab = ({ settings, handleChange }: GeneralTabProps) => {
  return (
    <div className="space-y-6">
      <NavigationPreview settings={settings} />
      
      <div className="space-y-4">
        <h3 className="heading-3">Colors</h3>
        <Separator />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="background">Background</Label>
            <select
              id="background"
              className="w-full mt-1.5 h-10 rounded-md border border-input bg-background px-3 py-2"
              value={settings.background}
              onChange={(e) => handleChange('background', e.target.value)}
            >
              <option value="bg-background">Default (bg-background)</option>
              <option value="bg-white">White (bg-white)</option>
              <option value="bg-gray-100">Light Gray (bg-gray-100)</option>
              <option value="bg-gray-800">Dark Gray (bg-gray-800)</option>
              <option value="bg-primary/10">Primary Light (bg-primary/10)</option>
            </select>
          </div>
          
          <div>
            <Label htmlFor="textColor">Text Color</Label>
            <select
              id="textColor"
              className="w-full mt-1.5 h-10 rounded-md border border-input bg-background px-3 py-2"
              value={settings.textColor}
              onChange={(e) => handleChange('textColor', e.target.value)}
            >
              <option value="text-foreground">Default (text-foreground)</option>
              <option value="text-gray-600">Gray (text-gray-600)</option>
              <option value="text-gray-800">Dark Gray (text-gray-800)</option>
              <option value="text-white">White (text-white)</option>
              <option value="text-primary">Primary (text-primary)</option>
            </select>
          </div>
          
          <div>
            <Label htmlFor="hoverBackground">Hover Background</Label>
            <select
              id="hoverBackground"
              className="w-full mt-1.5 h-10 rounded-md border border-input bg-background px-3 py-2"
              value={settings.hoverBackground}
              onChange={(e) => handleChange('hoverBackground', e.target.value)}
            >
              <option value="hover:bg-accent/10">Default (hover:bg-accent/10)</option>
              <option value="hover:bg-gray-100">Light Gray (hover:bg-gray-100)</option>
              <option value="hover:bg-primary/10">Primary Light (hover:bg-primary/10)</option>
              <option value="hover:bg-secondary">Secondary (hover:bg-secondary)</option>
            </select>
          </div>
          
          <div>
            <Label htmlFor="activeBackground">Active Background</Label>
            <select
              id="activeBackground"
              className="w-full mt-1.5 h-10 rounded-md border border-input bg-background px-3 py-2"
              value={settings.activeBackground}
              onChange={(e) => handleChange('activeBackground', e.target.value)}
            >
              <option value="bg-accent">Default (bg-accent)</option>
              <option value="bg-primary">Primary (bg-primary)</option>
              <option value="bg-secondary">Secondary (bg-secondary)</option>
              <option value="bg-gray-200">Light Gray (bg-gray-200)</option>
              <option value="bg-gray-800">Dark Gray (bg-gray-800)</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};
