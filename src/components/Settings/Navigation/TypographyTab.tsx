
import React from "react";
import { NavigationSettings } from "./types";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface TypographyTabProps {
  settings: NavigationSettings;
  handleNavItemSizeChange: (value: string) => void;
  handleNavItemWeightChange: (value: string) => void;
  handleNavItemColorChange: (value: string) => void;
  handleActiveNavItemColorChange: (value: string) => void;
}

export function TypographyTab({ 
  settings,
  handleNavItemSizeChange,
  handleNavItemWeightChange,
  handleNavItemColorChange,
  handleActiveNavItemColorChange
}: TypographyTabProps) {
  return (
    <div className="space-y-4">
      <div className="grid gap-4">
        <div className="space-y-2">
          <Label htmlFor="fontSize">Font Size</Label>
          <Select 
            value={settings.fontSize} 
            onValueChange={handleNavItemSizeChange}
          >
            <SelectTrigger id="fontSize">
              <SelectValue placeholder="Select font size" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="text-xs">Extra Small</SelectItem>
              <SelectItem value="text-sm">Small</SelectItem>
              <SelectItem value="text-base">Medium</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="fontWeight">Font Weight</Label>
          <Select 
            value={settings.fontWeight} 
            onValueChange={handleNavItemWeightChange}
          >
            <SelectTrigger id="fontWeight">
              <SelectValue placeholder="Select font weight" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="font-light">Light</SelectItem>
              <SelectItem value="font-normal">Regular</SelectItem>
              <SelectItem value="font-medium">Medium</SelectItem>
              <SelectItem value="font-semibold">Semi Bold</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="textColor">Text Color</Label>
          <Select 
            value={settings.textColor} 
            onValueChange={handleNavItemColorChange}
          >
            <SelectTrigger id="textColor">
              <SelectValue placeholder="Select text color" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="text-foreground">Foreground (Default)</SelectItem>
              <SelectItem value="text-muted-foreground">Muted</SelectItem>
              <SelectItem value="text-primary">Primary</SelectItem>
              <SelectItem value="text-secondary-foreground">Secondary</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="hoverTextColor">Hover Text Color</Label>
          <Select 
            value={settings.hoverTextColor} 
            onValueChange={(value) => handleNavItemColorChange(value)}
          >
            <SelectTrigger id="hoverTextColor">
              <SelectValue placeholder="Select hover text color" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="hover:text-accent-foreground">Accent Foreground</SelectItem>
              <SelectItem value="hover:text-primary">Primary</SelectItem>
              <SelectItem value="hover:text-secondary-foreground">Secondary</SelectItem>
              <SelectItem value="hover:text-foreground">Foreground</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="activeTextColor">Active Text Color</Label>
          <Select 
            value={settings.activeTextColor} 
            onValueChange={handleActiveNavItemColorChange}
          >
            <SelectTrigger id="activeTextColor">
              <SelectValue placeholder="Select active text color" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="text-accent-foreground">Accent Foreground (Default)</SelectItem>
              <SelectItem value="text-primary-foreground">Primary Foreground</SelectItem>
              <SelectItem value="text-secondary-foreground">Secondary Foreground</SelectItem>
              <SelectItem value="text-foreground">Foreground</SelectItem>
              <SelectItem value="text-white">White</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}
