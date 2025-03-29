
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";

interface ScrollbarSettings {
  width: number;
  radius: number;
  lightMode: {
    trackColor: string;
    thumbColor: string;
    thumbHoverColor: string;
  };
  darkMode: {
    trackColor: string;
    thumbColor: string;
    thumbHoverColor: string;
  };
}

const defaultSettings: ScrollbarSettings = {
  width: 12,
  radius: 9999,
  lightMode: {
    trackColor: "#f3f4f6", // bg-gray-100
    thumbColor: "#d1d5db", // bg-gray-300
    thumbHoverColor: "#9ca3af", // bg-gray-400
  },
  darkMode: {
    trackColor: "#1f2937", // bg-gray-800
    thumbColor: "#4b5563", // bg-gray-600
    thumbHoverColor: "#6b7280", // bg-gray-500
  },
};

export const ScrollbarSettings = () => {
  const [settings, setSettings] = useState<ScrollbarSettings>(defaultSettings);
  const [isUpdating, setIsUpdating] = useState(false);
  const { toast } = useToast();

  // Load saved settings on initial render
  useEffect(() => {
    const savedSettings = localStorage.getItem('scrollbar-settings');
    if (savedSettings) {
      try {
        setSettings(JSON.parse(savedSettings));
      } catch (error) {
        console.error("Failed to parse saved scrollbar settings", error);
      }
    }
  }, []);

  // Handle width change
  const handleWidthChange = (value: number[]) => {
    setSettings((prev) => ({
      ...prev,
      width: value[0],
    }));
  };

  // Handle radius change
  const handleRadiusChange = (value: number[]) => {
    setSettings((prev) => ({
      ...prev,
      radius: value[0],
    }));
  };

  // Handle color change
  const handleColorChange = (
    mode: 'lightMode' | 'darkMode',
    type: 'trackColor' | 'thumbColor' | 'thumbHoverColor',
    value: string
  ) => {
    setSettings((prev) => ({
      ...prev,
      [mode]: {
        ...prev[mode],
        [type]: value,
      },
    }));
  };

  // Apply changes to the DOM
  const applyChanges = () => {
    setIsUpdating(true);
    
    setTimeout(() => {
      // Set scrollbar CSS variables
      document.documentElement.style.setProperty('--scrollbar-width', `${settings.width}px`);
      document.documentElement.style.setProperty('--scrollbar-height', `${settings.width}px`);
      document.documentElement.style.setProperty('--scrollbar-radius', `${settings.radius}px`);
      
      // Set light mode colors
      document.documentElement.style.setProperty('--scrollbar-track-color', settings.lightMode.trackColor);
      document.documentElement.style.setProperty('--scrollbar-thumb-color', settings.lightMode.thumbColor);
      document.documentElement.style.setProperty('--scrollbar-thumb-hover-color', settings.lightMode.thumbHoverColor);
      
      // Set dark mode colors in :root.dark selector
      const darkModeStyle = document.createElement('style');
      darkModeStyle.textContent = `
        .dark {
          --scrollbar-track-color: ${settings.darkMode.trackColor};
          --scrollbar-thumb-color: ${settings.darkMode.thumbColor};
          --scrollbar-thumb-hover-color: ${settings.darkMode.thumbHoverColor};
        }
      `;
      
      // Remove any previously added style element
      const prevStyle = document.getElementById('scrollbar-dark-style');
      if (prevStyle) {
        prevStyle.remove();
      }
      
      // Add new style element
      darkModeStyle.id = 'scrollbar-dark-style';
      document.head.appendChild(darkModeStyle);
      
      // Force scrollbar refresh
      document.documentElement.classList.add('scrollbar-refresh');
      setTimeout(() => {
        document.documentElement.classList.remove('scrollbar-refresh');
      }, 50);
      
      // Store settings in localStorage
      localStorage.setItem('scrollbar-settings', JSON.stringify(settings));
      
      toast({
        title: "Scrollbar Settings Updated",
        description: "Your scrollbar customizations have been applied",
      });
      
      setIsUpdating(false);
    }, 300);
  };

  // Reset to defaults
  const resetToDefaults = () => {
    setSettings(defaultSettings);
    
    // Reset CSS variables to default values
    document.documentElement.style.removeProperty('--scrollbar-width');
    document.documentElement.style.removeProperty('--scrollbar-height');
    document.documentElement.style.removeProperty('--scrollbar-radius');
    document.documentElement.style.removeProperty('--scrollbar-track-color');
    document.documentElement.style.removeProperty('--scrollbar-thumb-color');
    document.documentElement.style.removeProperty('--scrollbar-thumb-hover-color');
    
    // Remove dark mode style element
    const prevStyle = document.getElementById('scrollbar-dark-style');
    if (prevStyle) {
      prevStyle.remove();
    }
    
    // Force scrollbar refresh
    document.documentElement.classList.add('scrollbar-refresh');
    setTimeout(() => {
      document.documentElement.classList.remove('scrollbar-refresh');
    }, 50);
    
    // Remove stored settings
    localStorage.removeItem('scrollbar-settings');
    
    toast({
      title: "Scrollbar Settings Reset",
      description: "Scrollbar settings have been reset to defaults",
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Scrollbar Settings</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Scrollbar Size Settings */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Size Settings</h3>
          <Separator />
          
          <div className="space-y-6">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="scrollbar-width">Width</Label>
                <Badge variant="outline">{settings.width}px</Badge>
              </div>
              <Slider
                id="scrollbar-width"
                min={6}
                max={20}
                step={1}
                value={[settings.width]}
                onValueChange={handleWidthChange}
              />
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="scrollbar-radius">Rounded Corners</Label>
                <Badge variant="outline">{settings.radius === 9999 ? 'Full' : `${settings.radius}px`}</Badge>
              </div>
              <Slider
                id="scrollbar-radius"
                min={0}
                max={9999}
                step={1}
                value={[settings.radius]}
                onValueChange={handleRadiusChange}
              />
              <p className="text-xs text-muted-foreground mt-1">
                Slide all the way to the right for fully rounded corners.
              </p>
            </div>
          </div>
        </div>
        
        {/* Light Mode Colors */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Light Mode Colors</h3>
          <Separator />
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="light-track-color">Track Color</Label>
              <div className="flex gap-2">
                <div 
                  className="w-10 h-10 rounded border" 
                  style={{ backgroundColor: settings.lightMode.trackColor }}
                />
                <Input
                  id="light-track-color"
                  type="text"
                  value={settings.lightMode.trackColor}
                  onChange={(e) => handleColorChange('lightMode', 'trackColor', e.target.value)}
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="light-thumb-color">Thumb Color</Label>
              <div className="flex gap-2">
                <div 
                  className="w-10 h-10 rounded border" 
                  style={{ backgroundColor: settings.lightMode.thumbColor }}
                />
                <Input
                  id="light-thumb-color"
                  type="text"
                  value={settings.lightMode.thumbColor}
                  onChange={(e) => handleColorChange('lightMode', 'thumbColor', e.target.value)}
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="light-thumb-hover-color">Thumb Hover</Label>
              <div className="flex gap-2">
                <div 
                  className="w-10 h-10 rounded border" 
                  style={{ backgroundColor: settings.lightMode.thumbHoverColor }}
                />
                <Input
                  id="light-thumb-hover-color"
                  type="text"
                  value={settings.lightMode.thumbHoverColor}
                  onChange={(e) => handleColorChange('lightMode', 'thumbHoverColor', e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>
        
        {/* Dark Mode Colors */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Dark Mode Colors</h3>
          <Separator />
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="dark-track-color">Track Color</Label>
              <div className="flex gap-2">
                <div 
                  className="w-10 h-10 rounded border" 
                  style={{ backgroundColor: settings.darkMode.trackColor }}
                />
                <Input
                  id="dark-track-color"
                  type="text"
                  value={settings.darkMode.trackColor}
                  onChange={(e) => handleColorChange('darkMode', 'trackColor', e.target.value)}
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="dark-thumb-color">Thumb Color</Label>
              <div className="flex gap-2">
                <div 
                  className="w-10 h-10 rounded border" 
                  style={{ backgroundColor: settings.darkMode.thumbColor }}
                />
                <Input
                  id="dark-thumb-color"
                  type="text"
                  value={settings.darkMode.thumbColor}
                  onChange={(e) => handleColorChange('darkMode', 'thumbColor', e.target.value)}
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="dark-thumb-hover-color">Thumb Hover</Label>
              <div className="flex gap-2">
                <div 
                  className="w-10 h-10 rounded border" 
                  style={{ backgroundColor: settings.darkMode.thumbHoverColor }}
                />
                <Input
                  id="dark-thumb-hover-color"
                  type="text"
                  value={settings.darkMode.thumbHoverColor}
                  onChange={(e) => handleColorChange('darkMode', 'thumbHoverColor', e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>
        
        {/* Preview */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Preview</h3>
          <Separator />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <p className="font-medium">Light Mode</p>
              <div 
                className="h-40 overflow-auto border rounded-md p-4"
                style={{
                  backgroundColor: 'white',
                  color: 'black',
                  '--scrollbar-width': `${settings.width}px`,
                  '--scrollbar-track-color': settings.lightMode.trackColor,
                  '--scrollbar-thumb-color': settings.lightMode.thumbColor,
                  '--scrollbar-thumb-hover-color': settings.lightMode.thumbHoverColor,
                } as React.CSSProperties}
              >
                <div className="space-y-2">
                  {Array.from({ length: 20 }).map((_, i) => (
                    <p key={i}>Scrollbar preview content line {i + 1}</p>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="space-y-2">
              <p className="font-medium">Dark Mode</p>
              <div 
                className="h-40 overflow-auto border rounded-md p-4"
                style={{
                  backgroundColor: '#1f2937',
                  color: 'white',
                  '--scrollbar-width': `${settings.width}px`,
                  '--scrollbar-track-color': settings.darkMode.trackColor,
                  '--scrollbar-thumb-color': settings.darkMode.thumbColor,
                  '--scrollbar-thumb-hover-color': settings.darkMode.thumbHoverColor,
                } as React.CSSProperties}
              >
                <div className="space-y-2">
                  {Array.from({ length: 20 }).map((_, i) => (
                    <p key={i}>Scrollbar preview content line {i + 1}</p>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Actions */}
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
