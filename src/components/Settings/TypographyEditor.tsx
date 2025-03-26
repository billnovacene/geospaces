import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";

interface TypographySettings {
  headings: {
    h1: { size: string; weight: string; tracking: string; };
    h2: { size: string; weight: string; tracking: string; };
    h3: { size: string; weight: string; tracking: string; };
    h4: { size: string; weight: string; tracking: string; };
  };
  body: {
    large: { size: string; };
    normal: { size: string; };
    small: { size: string; };
  }
}

const defaultSettings: TypographySettings = {
  headings: {
    h1: { size: "text-3xl", weight: "font-medium", tracking: "tracking-tight" },
    h2: { size: "text-2xl", weight: "font-medium", tracking: "tracking-tight" },
    h3: { size: "text-xl", weight: "font-medium", tracking: "" },
    h4: { size: "text-lg", weight: "font-medium", tracking: "" },
  },
  body: {
    large: { size: "text-base" },
    normal: { size: "text-sm" },
    small: { size: "text-xs" },
  }
};

export const TypographyEditor = () => {
  const [settings, setSettings] = useState<TypographySettings>(defaultSettings);
  const [isUpdating, setIsUpdating] = useState(false);
  const { toast } = useToast();

  const handleHeadingChange = (
    level: 'h1' | 'h2' | 'h3' | 'h4',
    property: 'size' | 'weight' | 'tracking',
    value: string
  ) => {
    setSettings(prev => ({
      ...prev,
      headings: {
        ...prev.headings,
        [level]: {
          ...prev.headings[level],
          [property]: value
        }
      }
    }));
  };

  const handleBodyChange = (
    type: 'large' | 'normal' | 'small',
    property: 'size',
    value: string
  ) => {
    setSettings(prev => ({
      ...prev,
      body: {
        ...prev.body,
        [type]: {
          ...prev.body[type],
          [property]: value
        }
      }
    }));
  };

  const applyChanges = () => {
    setIsUpdating(true);
    
    // Simulate updating CSS variables or classes
    setTimeout(() => {
      const root = document.documentElement;
      
      // This is a simplified example - in a real app you'd update CSS variables
      // or dynamically generate and inject a style sheet
      
      // For demonstration, we'll just show a toast
      toast({
        title: "Typography Updated",
        description: "Your typography changes have been applied",
      });
      
      setIsUpdating(false);
    }, 800);
  };

  const resetToDefaults = () => {
    setSettings(defaultSettings);
    toast({
      title: "Typography Reset",
      description: "Typography settings have been reset to defaults",
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Typography Editor</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Headings Section */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Heading Styles</h3>
          <Separator />
          
          <div className="grid grid-cols-1 gap-6">
            {/* Heading 1 */}
            <div className="space-y-4">
              <div className="flex items-baseline justify-between">
                <h1 className={`${settings.headings.h1.size} ${settings.headings.h1.weight} ${settings.headings.h1.tracking}`}>
                  Heading 1
                </h1>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="h1-size">Size</Label>
                  <select
                    id="h1-size"
                    className="w-full mt-1.5 h-10 rounded-md border border-input bg-background px-3 py-2"
                    value={settings.headings.h1.size}
                    onChange={(e) => handleHeadingChange('h1', 'size', e.target.value)}
                  >
                    <option value="text-2xl">Small (text-2xl)</option>
                    <option value="text-3xl">Medium (text-3xl)</option>
                    <option value="text-4xl">Large (text-4xl)</option>
                  </select>
                </div>
                
                <div>
                  <Label htmlFor="h1-weight">Weight</Label>
                  <select
                    id="h1-weight"
                    className="w-full mt-1.5 h-10 rounded-md border border-input bg-background px-3 py-2"
                    value={settings.headings.h1.weight}
                    onChange={(e) => handleHeadingChange('h1', 'weight', e.target.value)}
                  >
                    <option value="font-normal">Normal (400)</option>
                    <option value="font-medium">Medium (500)</option>
                    <option value="font-semibold">Semibold (600)</option>
                  </select>
                </div>
                
                <div>
                  <Label htmlFor="h1-tracking">Letter Spacing</Label>
                  <select
                    id="h1-tracking"
                    className="w-full mt-1.5 h-10 rounded-md border border-input bg-background px-3 py-2"
                    value={settings.headings.h1.tracking}
                    onChange={(e) => handleHeadingChange('h1', 'tracking', e.target.value)}
                  >
                    <option value="">Normal</option>
                    <option value="tracking-tight">Tight</option>
                    <option value="tracking-wide">Wide</option>
                  </select>
                </div>
              </div>
            </div>
            
            {/* Heading 2 */}
            <div className="space-y-4 pt-2">
              <div className="flex items-baseline justify-between">
                <h2 className={`${settings.headings.h2.size} ${settings.headings.h2.weight} ${settings.headings.h2.tracking}`}>
                  Heading 2
                </h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="h2-size">Size</Label>
                  <select
                    id="h2-size"
                    className="w-full mt-1.5 h-10 rounded-md border border-input bg-background px-3 py-2"
                    value={settings.headings.h2.size}
                    onChange={(e) => handleHeadingChange('h2', 'size', e.target.value)}
                  >
                    <option value="text-xl">Small (text-xl)</option>
                    <option value="text-2xl">Medium (text-2xl)</option>
                    <option value="text-3xl">Large (text-3xl)</option>
                  </select>
                </div>
                
                <div>
                  <Label htmlFor="h2-weight">Weight</Label>
                  <select
                    id="h2-weight"
                    className="w-full mt-1.5 h-10 rounded-md border border-input bg-background px-3 py-2"
                    value={settings.headings.h2.weight}
                    onChange={(e) => handleHeadingChange('h2', 'weight', e.target.value)}
                  >
                    <option value="font-normal">Normal (400)</option>
                    <option value="font-medium">Medium (500)</option>
                    <option value="font-semibold">Semibold (600)</option>
                  </select>
                </div>
                
                <div>
                  <Label htmlFor="h2-tracking">Letter Spacing</Label>
                  <select
                    id="h2-tracking"
                    className="w-full mt-1.5 h-10 rounded-md border border-input bg-background px-3 py-2"
                    value={settings.headings.h2.tracking}
                    onChange={(e) => handleHeadingChange('h2', 'tracking', e.target.value)}
                  >
                    <option value="">Normal</option>
                    <option value="tracking-tight">Tight</option>
                    <option value="tracking-wide">Wide</option>
                  </select>
                </div>
              </div>
            </div>
            
            {/* Body Text */}
            <div className="space-y-4 pt-4">
              <h3 className="text-lg font-medium">Body Text Styles</h3>
              <Separator />
              
              <div className="space-y-6">
                {/* Body Large */}
                <div className="space-y-2">
                  <p className={`${settings.body.large.size}`}>This is body large text style</p>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="body-large-size">Size</Label>
                      <select
                        id="body-large-size"
                        className="w-full mt-1.5 h-10 rounded-md border border-input bg-background px-3 py-2"
                        value={settings.body.large.size}
                        onChange={(e) => handleBodyChange('large', 'size', e.target.value)}
                      >
                        <option value="text-sm">Small (text-sm)</option>
                        <option value="text-base">Medium (text-base)</option>
                        <option value="text-lg">Large (text-lg)</option>
                      </select>
                    </div>
                  </div>
                </div>
                
                {/* Body Normal */}
                <div className="space-y-2">
                  <p className={`${settings.body.normal.size}`}>This is body normal text style</p>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="body-normal-size">Size</Label>
                      <select
                        id="body-normal-size"
                        className="w-full mt-1.5 h-10 rounded-md border border-input bg-background px-3 py-2"
                        value={settings.body.normal.size}
                        onChange={(e) => handleBodyChange('normal', 'size', e.target.value)}
                      >
                        <option value="text-xs">Small (text-xs)</option>
                        <option value="text-sm">Medium (text-sm)</option>
                        <option value="text-base">Large (text-base)</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
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
