
import React from "react";
import { NavigationSettings } from "./types";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface GeneralTabProps {
  settings: NavigationSettings;
  handleChange: (property: keyof NavigationSettings, value: string) => void;
}

export function GeneralTab({ settings, handleChange }: GeneralTabProps) {
  return (
    <div className="space-y-4">
      <div className="grid gap-4">
        <div className="space-y-2">
          <Label htmlFor="background">Background</Label>
          <Select 
            value={settings.background} 
            onValueChange={(value) => handleChange("background", value)}
          >
            <SelectTrigger id="background">
              <SelectValue placeholder="Select background" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="bg-background">Background (Default)</SelectItem>
              <SelectItem value="bg-card">Card</SelectItem>
              <SelectItem value="bg-primary/5">Primary (Light)</SelectItem>
              <SelectItem value="bg-secondary">Secondary</SelectItem>
              <SelectItem value="bg-muted">Muted</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="sidebarBackground">Sidebar Background</Label>
          <Select 
            value={settings.sidebarBackground} 
            onValueChange={(value) => handleChange("sidebarBackground", value)}
          >
            <SelectTrigger id="sidebarBackground">
              <SelectValue placeholder="Select sidebar background" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="bg-sidebar">Sidebar (Default)</SelectItem>
              <SelectItem value="bg-background">Background</SelectItem>
              <SelectItem value="bg-card">Card</SelectItem>
              <SelectItem value="bg-muted">Muted</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="hoverBackground">Hover Background</Label>
          <Select 
            value={settings.hoverBackground} 
            onValueChange={(value) => handleChange("hoverBackground", value)}
          >
            <SelectTrigger id="hoverBackground">
              <SelectValue placeholder="Select hover background" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="hover:bg-accent/10">Accent (Light)</SelectItem>
              <SelectItem value="hover:bg-accent">Accent</SelectItem>
              <SelectItem value="hover:bg-primary/10">Primary (Light)</SelectItem>
              <SelectItem value="hover:bg-primary/20">Primary (Medium)</SelectItem>
              <SelectItem value="hover:bg-secondary">Secondary</SelectItem>
              <SelectItem value="hover:bg-muted">Muted</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="activeBackground">Active Background</Label>
          <Select 
            value={settings.activeBackground} 
            onValueChange={(value) => handleChange("activeBackground", value)}
          >
            <SelectTrigger id="activeBackground">
              <SelectValue placeholder="Select active background" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="bg-accent">Accent (Default)</SelectItem>
              <SelectItem value="bg-primary">Primary</SelectItem>
              <SelectItem value="bg-primary/20">Primary (Light)</SelectItem>
              <SelectItem value="bg-secondary">Secondary</SelectItem>
              <SelectItem value="bg-muted">Muted</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}
