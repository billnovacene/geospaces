
import React from "react";
import { NavigationSettings } from "./types";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";

interface BordersTabProps {
  settings: NavigationSettings;
  handleChange: (property: keyof NavigationSettings, value: string) => void;
}

export function BordersTab({ settings, handleChange }: BordersTabProps) {
  return (
    <div className="space-y-4">
      <div className="grid gap-4">
        <div className="space-y-2">
          <Label htmlFor="borderWidth">Border Width</Label>
          <Select 
            value={settings.borderWidth} 
            onValueChange={(value) => handleChange("borderWidth", value)}
          >
            <SelectTrigger id="borderWidth">
              <SelectValue placeholder="Select border width" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="0px">None</SelectItem>
              <SelectItem value="1px">Thin (1px)</SelectItem>
              <SelectItem value="2px">Medium (2px)</SelectItem>
              <SelectItem value="4px">Thick (4px)</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="borderColor">Border Color</Label>
          <Select 
            value={settings.borderColor} 
            onValueChange={(value) => handleChange("borderColor", value)}
          >
            <SelectTrigger id="borderColor">
              <SelectValue placeholder="Select border color" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="transparent">Transparent</SelectItem>
              <SelectItem value="var(--border)">Border (Default)</SelectItem>
              <SelectItem value="var(--primary)">Primary</SelectItem>
              <SelectItem value="var(--accent)">Accent</SelectItem>
              <SelectItem value="var(--muted)">Muted</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="borderRadius">Border Radius</Label>
          <Select 
            value={settings.borderRadius} 
            onValueChange={(value) => handleChange("borderRadius", value)}
          >
            <SelectTrigger id="borderRadius">
              <SelectValue placeholder="Select border radius" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="rounded-none">None</SelectItem>
              <SelectItem value="rounded-sm">Small</SelectItem>
              <SelectItem value="rounded-md">Medium</SelectItem>
              <SelectItem value="rounded-lg">Large</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}
