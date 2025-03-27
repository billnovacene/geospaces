
import React, { useState, useEffect } from "react";
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

  // Load saved settings on component mount
  useEffect(() => {
    const savedSettings = localStorage.getItem('table-settings');
    if (savedSettings) {
      try {
        setSettings(JSON.parse(savedSettings));
      } catch (e) {
        console.error("Error parsing saved table settings", e);
      }
    }
  }, []);

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
    
    setTimeout(() => {
      // Create or update stylesheet with table styles
      const styleElement = document.getElementById('table-styles') || document.createElement('style');
      styleElement.id = 'table-styles';
      styleElement.textContent = `
        .table-header {
          background-color: var(--header-bg, ${settings.headerBackground}) !important;
          color: var(--header-text, ${settings.headerTextColor}) !important;
          font-size: var(--header-size, ${settings.headerFontSize}) !important;
          font-weight: var(--header-weight, ${settings.headerFontWeight}) !important;
        }
        
        .table-cell {
          background-color: var(--row-bg, ${settings.rowBackground}) !important;
          color: var(--row-text, ${settings.rowTextColor}) !important;
          font-size: var(--row-size, ${settings.rowFontSize}) !important;
          font-weight: var(--row-weight, ${settings.rowFontWeight}) !important;
        }
        
        table {
          border-color: var(--table-border, ${settings.borderColor}) !important;
        }
        
        tbody tr:hover {
          background-color: var(--row-hover, ${settings.hoverBackground}) !important;
        }
      `;
      
      if (!styleElement.parentNode) {
        document.head.appendChild(styleElement);
      }
      
      // Save settings to localStorage
      localStorage.setItem('table-settings', JSON.stringify(settings));
      
      toast({
        title: "Table Styles Updated",
        description: "Your table style changes have been applied",
      });
      
      setIsUpdating(false);
    }, 800);
  };

  const resetToDefaults = () => {
    setSettings(defaultSettings);
    
    // Remove custom styles
    const styleElement = document.getElementById('table-styles');
    if (styleElement) {
      styleElement.textContent = '';
    }
    
    // Clear localStorage
    localStorage.removeItem('table-settings');
    
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
