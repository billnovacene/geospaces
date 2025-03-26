import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";

interface NavigationSettings {
  background: string;
  textColor: string;
  hoverBackground: string;
  hoverTextColor: string;
  activeBackground: string;
  activeTextColor: string;
  fontSize: string;
  fontWeight: string;
}

const defaultSettings: NavigationSettings = {
  background: "bg-background",
  textColor: "text-foreground",
  hoverBackground: "hover:bg-accent/10",
  hoverTextColor: "hover:text-accent-foreground",
  activeBackground: "bg-accent",
  activeTextColor: "text-accent-foreground",
  fontSize: "text-sm",
  fontWeight: "font-medium"
};

export const NavigationEditor = () => {
  const [settings, setSettings] = useState<NavigationSettings>(defaultSettings);
  const [isUpdating, setIsUpdating] = useState(false);
  const { toast } = useToast();

  const handleChange = (
    property: keyof NavigationSettings,
    value: string
  ) => {
    setSettings(prev => ({
      ...prev,
      [property]: value
    }));
  };

  const applyChanges = () => {
    setIsUpdating(true);
    
    // Simulate updating CSS variables or classes
    setTimeout(() => {
      // This is a simplified example - in a real app you'd update CSS variables
      // or dynamically generate and inject a style sheet
      
      toast({
        title: "Navigation Styles Updated",
        description: "Your navigation style changes have been applied",
      });
      
      setIsUpdating(false);
    }, 800);
  };

  const resetToDefaults = () => {
    setSettings(defaultSettings);
    toast({
      title: "Navigation Styles Reset",
      description: "Navigation styles have been reset to defaults",
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Navigation Editor</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Navigation Preview */}
        <div className="p-4 border rounded-md">
          <h3 className="heading-3 mb-3">Navigation Preview</h3>
          <div className={`flex space-x-4 p-4 rounded-md ${settings.background}`}>
            <a href="#" className={`px-3 py-2 rounded-md ${settings.textColor} ${settings.fontSize} ${settings.fontWeight} ${settings.hoverBackground} ${settings.hoverTextColor}`}>
              Home
            </a>
            <a href="#" className={`px-3 py-2 rounded-md ${settings.textColor} ${settings.fontSize} ${settings.fontWeight} ${settings.hoverBackground} ${settings.hoverTextColor}`}>
              Dashboard
            </a>
            <a href="#" className={`px-3 py-2 rounded-md ${settings.activeBackground} ${settings.activeTextColor} ${settings.fontSize} ${settings.fontWeight}`}>
              Settings
            </a>
            <a href="#" className={`px-3 py-2 rounded-md ${settings.textColor} ${settings.fontSize} ${settings.fontWeight} ${settings.hoverBackground} ${settings.hoverTextColor}`}>
              Profile
            </a>
          </div>
        </div>
        
        {/* Colors */}
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
        
        {/* Typography */}
        <div className="space-y-4">
          <h3 className="heading-3">Typography</h3>
          <Separator />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="fontSize">Font Size</Label>
              <select
                id="fontSize"
                className="w-full mt-1.5 h-10 rounded-md border border-input bg-background px-3 py-2"
                value={settings.fontSize}
                onChange={(e) => handleChange('fontSize', e.target.value)}
              >
                <option value="text-xs">Small (text-xs)</option>
                <option value="text-sm">Medium (text-sm)</option>
                <option value="text-base">Large (text-base)</option>
              </select>
            </div>
            
            <div>
              <Label htmlFor="fontWeight">Font Weight</Label>
              <select
                id="fontWeight"
                className="w-full mt-1.5 h-10 rounded-md border border-input bg-background px-3 py-2"
                value={settings.fontWeight}
                onChange={(e) => handleChange('fontWeight', e.target.value)}
              >
                <option value="font-normal">Normal (400)</option>
                <option value="font-medium">Medium (500)</option>
                <option value="font-semibold">Semibold (600)</option>
              </select>
            </div>
          </div>
        </div>
        
        <div className="flex justify-end space-x-2 pt-4">
          <Button 
            variant="outline" 
            onClick={resetToDefaults}
          >
            Reset to Defaults
          </Button>
          <Button 
            onClick={applyChanges} 
            disabled={isUpdating}
          >
            {isUpdating ? "Applying..." : "Apply Changes"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
