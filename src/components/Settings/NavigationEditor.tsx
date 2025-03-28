
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { NavigationTextEditor } from "./Typography/NavigationTextEditor";

interface NavigationSettings {
  background: string;
  textColor: string;
  hoverBackground: string;
  hoverTextColor: string;
  activeBackground: string;
  activeTextColor: string;
  fontSize: string;
  fontWeight: string;
  borderWidth: string;
  borderColor: string;
  borderRadius: string;
  sidebarBackground: string;
}

const defaultSettings: NavigationSettings = {
  background: "bg-background",
  textColor: "text-foreground",
  hoverBackground: "hover:bg-accent/10",
  hoverTextColor: "hover:text-accent-foreground",
  activeBackground: "bg-accent",
  activeTextColor: "text-accent-foreground",
  fontSize: "text-sm",
  fontWeight: "font-medium",
  borderWidth: "0px",
  borderColor: "transparent",
  borderRadius: "rounded-none",
  sidebarBackground: "bg-sidebar"
};

export const NavigationEditor = () => {
  const [settings, setSettings] = useState<NavigationSettings>(defaultSettings);
  const [activeTab, setActiveTab] = useState("general");
  const [isUpdating, setIsUpdating] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const savedSettings = localStorage.getItem('navigation-settings');
    if (savedSettings) {
      try {
        const parsed = JSON.parse(savedSettings);
        // Ensure we have all the new properties with defaults
        setSettings({
          ...defaultSettings,
          ...parsed
        });
      } catch (e) {
        console.error("Error parsing saved navigation settings", e);
      }
    }
  }, []);

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
    
    setTimeout(() => {
      // Apply the CSS variables
      const bgClass = settings.background.replace('bg-', '');
      const textClass = settings.textColor.replace('text-', '');
      const hoverBgClass = settings.hoverBackground.replace('hover:bg-', '');
      const hoverTextClass = settings.hoverTextColor.replace('hover:text-', '');
      const activeBgClass = settings.activeBackground.replace('bg-', '');
      const activeTextClass = settings.activeTextColor.replace('text-', '');
      const fontSizeClass = settings.fontSize.replace('text-', '');
      const fontWeightClass = settings.fontWeight.replace('font-', '');
      
      // Set CSS variables
      document.documentElement.style.setProperty('--nav-text-color', `var(--${textClass})`);
      document.documentElement.style.setProperty('--nav-hover-bg-color', `var(--${hoverBgClass.replace('/', '-')})`);
      document.documentElement.style.setProperty('--nav-hover-text-color', `var(--${hoverTextClass})`);
      document.documentElement.style.setProperty('--nav-active-bg-color', `var(--${activeBgClass})`);
      document.documentElement.style.setProperty('--nav-active-text-color', `var(--${activeTextClass})`);
      document.documentElement.style.setProperty('--nav-font-size', fontSizeClass === 'xs' ? '0.75rem' : 
                                                 fontSizeClass === 'sm' ? '0.875rem' : '1rem');
      document.documentElement.style.setProperty('--nav-font-weight', fontWeightClass === 'light' ? '300' : 
                                                 fontWeightClass === 'normal' ? '400' : 
                                                 fontWeightClass === 'medium' ? '500' : '600');
      
      // Apply border settings
      document.documentElement.style.setProperty('--sidebar-border-width', settings.borderWidth);
      document.documentElement.style.setProperty('--sidebar-border-color', settings.borderColor);
      document.documentElement.style.setProperty('--sidebar-border-radius', settings.borderRadius);
      
      localStorage.setItem('navigation-settings', JSON.stringify(settings));
      
      toast({
        title: "Navigation Styles Updated",
        description: "Your navigation style changes have been applied",
      });
      
      setIsUpdating(false);
    }, 800);
  };

  const resetToDefaults = () => {
    setSettings(defaultSettings);
    
    const customProps = [
      '--nav-text-color', '--nav-hover-bg-color', '--nav-hover-text-color', 
      '--nav-active-bg-color', '--nav-active-text-color', '--nav-font-size', 
      '--nav-font-weight', '--sidebar-border-width', '--sidebar-border-color',
      '--sidebar-border-radius'
    ];
    
    customProps.forEach(prop => {
      document.documentElement.style.removeProperty(prop);
    });
    
    localStorage.removeItem('navigation-settings');
    
    toast({
      title: "Navigation Styles Reset",
      description: "Navigation styles have been reset to defaults",
    });
  };

  const handleNavItemSizeChange = (value: string) => {
    setSettings(prev => ({
      ...prev,
      fontSize: value
    }));
  };

  const handleNavItemWeightChange = (value: string) => {
    setSettings(prev => ({
      ...prev,
      fontWeight: value
    }));
  };

  const handleNavItemColorChange = (value: string) => {
    setSettings(prev => ({
      ...prev,
      textColor: value
    }));
  };

  const handleActiveNavItemColorChange = (value: string) => {
    setSettings(prev => ({
      ...prev,
      activeTextColor: value
    }));
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Navigation Editor</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-4">
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="typography">Typography</TabsTrigger>
            <TabsTrigger value="borders">Borders</TabsTrigger>
          </TabsList>
          
          <TabsContent value="general" className="space-y-6">
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
          </TabsContent>
          
          <TabsContent value="typography" className="space-y-6">
            <div className="space-y-6">
              <h3 className="heading-3">Navigation Item</h3>
              <Separator />
              
              <NavigationTextEditor
                type="item"
                size={settings.fontSize}
                weight={settings.fontWeight}
                color={settings.textColor}
                onSizeChange={handleNavItemSizeChange}
                onWeightChange={handleNavItemWeightChange}
                onColorChange={handleNavItemColorChange}
              />
              
              <h3 className="heading-3 mt-6">Active Navigation Item</h3>
              <Separator />
              
              <NavigationTextEditor
                type="active"
                size={settings.fontSize}
                weight={settings.fontWeight}
                color={settings.activeTextColor}
                onSizeChange={handleNavItemSizeChange}
                onWeightChange={handleNavItemWeightChange}
                onColorChange={handleActiveNavItemColorChange}
              />
            </div>
          </TabsContent>
          
          <TabsContent value="borders" className="space-y-6">
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
          </TabsContent>
        </Tabs>
        
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
