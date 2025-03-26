
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { TypographyEditorContent } from "./TypographyEditorContent";
import { TypographySettings, defaultSettings } from "./types";

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
    property: 'size' | 'weight' | 'color',
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
        <TypographyEditorContent 
          settings={settings}
          onHeadingChange={handleHeadingChange}
          onBodyChange={handleBodyChange}
        />
        
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
