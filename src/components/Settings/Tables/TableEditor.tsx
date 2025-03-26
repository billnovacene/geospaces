
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { TablePreview } from "./TablePreview";
import { HeaderStylesEditor } from "./HeaderStylesEditor";
import { RowStylesEditor } from "./RowStylesEditor";
import { TableSettings, defaultSettings } from "./types";

export const TableEditor = () => {
  const [settings, setSettings] = useState<TableSettings>(defaultSettings);
  const [isUpdating, setIsUpdating] = useState(false);
  const { toast } = useToast();

  const handleChange = (
    property: keyof TableSettings,
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
      // In a real implementation, you would apply these styles to actual tables
      // by updating CSS variables or class definitions
      
      toast({
        title: "Table Styles Updated",
        description: "Your table style changes have been applied",
      });
      
      setIsUpdating(false);
    }, 800);
  };

  const resetToDefaults = () => {
    setSettings(defaultSettings);
    toast({
      title: "Table Styles Reset",
      description: "Table styles have been reset to defaults",
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Table Editor</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Table Preview */}
        <TablePreview settings={settings} />
        
        {/* Header Styles */}
        <HeaderStylesEditor 
          settings={settings}
          onSettingChange={handleChange}
        />
        
        {/* Row Styles */}
        <RowStylesEditor 
          settings={settings}
          onSettingChange={handleChange}
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
