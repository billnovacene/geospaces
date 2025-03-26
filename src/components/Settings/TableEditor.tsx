
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Table, TableHeader, TableHead, TableBody, TableRow, TableCell } from "@/components/ui/table";

interface TableSettings {
  headerBackground: string;
  headerTextColor: string;
  headerFontSize: string;
  headerFontWeight: string;
  rowBackground: string;
  rowTextColor: string;
  rowFontSize: string;
  rowFontWeight: string;
  borderColor: string;
  hoverBackground: string;
}

const defaultSettings: TableSettings = {
  headerBackground: "bg-muted",
  headerTextColor: "text-muted-foreground",
  headerFontSize: "text-sm",
  headerFontWeight: "font-medium",
  rowBackground: "bg-card",
  rowTextColor: "text-card-foreground",
  rowFontSize: "text-sm",
  rowFontWeight: "font-normal",
  borderColor: "border-border",
  hoverBackground: "hover:bg-muted/50"
};

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
        <div className="p-4 border rounded-md overflow-auto">
          <h3 className="text-lg font-medium mb-3">Table Preview</h3>
          <Table className={`${settings.borderColor}`}>
            <TableHeader className={`${settings.headerBackground}`}>
              <TableRow>
                <TableHead className={`${settings.headerTextColor} ${settings.headerFontSize} ${settings.headerFontWeight}`}>ID</TableHead>
                <TableHead className={`${settings.headerTextColor} ${settings.headerFontSize} ${settings.headerFontWeight}`}>Name</TableHead>
                <TableHead className={`${settings.headerTextColor} ${settings.headerFontSize} ${settings.headerFontWeight}`}>Status</TableHead>
                <TableHead className={`text-right ${settings.headerTextColor} ${settings.headerFontSize} ${settings.headerFontWeight}`}>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow className={`${settings.rowBackground} ${settings.hoverBackground}`}>
                <TableCell className={`${settings.rowTextColor} ${settings.rowFontSize} ${settings.rowFontWeight}`}>001</TableCell>
                <TableCell className={`${settings.rowTextColor} ${settings.rowFontSize} ${settings.rowFontWeight}`}>John Doe</TableCell>
                <TableCell className={`${settings.rowTextColor} ${settings.rowFontSize} ${settings.rowFontWeight}`}>Active</TableCell>
                <TableCell className={`text-right ${settings.rowTextColor} ${settings.rowFontSize} ${settings.rowFontWeight}`}>Edit</TableCell>
              </TableRow>
              <TableRow className={`${settings.rowBackground} ${settings.hoverBackground}`}>
                <TableCell className={`${settings.rowTextColor} ${settings.rowFontSize} ${settings.rowFontWeight}`}>002</TableCell>
                <TableCell className={`${settings.rowTextColor} ${settings.rowFontSize} ${settings.rowFontWeight}`}>Jane Smith</TableCell>
                <TableCell className={`${settings.rowTextColor} ${settings.rowFontSize} ${settings.rowFontWeight}`}>Inactive</TableCell>
                <TableCell className={`text-right ${settings.rowTextColor} ${settings.rowFontSize} ${settings.rowFontWeight}`}>Edit</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
        
        {/* Header Styles */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Header Styles</h3>
          <Separator />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="headerBackground">Background</Label>
              <select
                id="headerBackground"
                className="w-full mt-1.5 h-10 rounded-md border border-input bg-background px-3 py-2"
                value={settings.headerBackground}
                onChange={(e) => handleChange('headerBackground', e.target.value)}
              >
                <option value="bg-muted">Default (bg-muted)</option>
                <option value="bg-gray-50">Light Gray (bg-gray-50)</option>
                <option value="bg-gray-100">Medium Gray (bg-gray-100)</option>
                <option value="bg-primary/10">Primary Light (bg-primary/10)</option>
                <option value="bg-secondary">Secondary (bg-secondary)</option>
              </select>
            </div>
            
            <div>
              <Label htmlFor="headerTextColor">Text Color</Label>
              <select
                id="headerTextColor"
                className="w-full mt-1.5 h-10 rounded-md border border-input bg-background px-3 py-2"
                value={settings.headerTextColor}
                onChange={(e) => handleChange('headerTextColor', e.target.value)}
              >
                <option value="text-muted-foreground">Default (text-muted-foreground)</option>
                <option value="text-gray-600">Gray (text-gray-600)</option>
                <option value="text-gray-800">Dark Gray (text-gray-800)</option>
                <option value="text-primary">Primary (text-primary)</option>
              </select>
            </div>
            
            <div>
              <Label htmlFor="headerFontSize">Font Size</Label>
              <select
                id="headerFontSize"
                className="w-full mt-1.5 h-10 rounded-md border border-input bg-background px-3 py-2"
                value={settings.headerFontSize}
                onChange={(e) => handleChange('headerFontSize', e.target.value)}
              >
                <option value="text-xs">Small (text-xs)</option>
                <option value="text-sm">Medium (text-sm)</option>
                <option value="text-base">Large (text-base)</option>
              </select>
            </div>
            
            <div>
              <Label htmlFor="headerFontWeight">Font Weight</Label>
              <select
                id="headerFontWeight"
                className="w-full mt-1.5 h-10 rounded-md border border-input bg-background px-3 py-2"
                value={settings.headerFontWeight}
                onChange={(e) => handleChange('headerFontWeight', e.target.value)}
              >
                <option value="font-normal">Normal (400)</option>
                <option value="font-medium">Medium (500)</option>
                <option value="font-semibold">Semibold (600)</option>
              </select>
            </div>
          </div>
        </div>
        
        {/* Row Styles */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Row Styles</h3>
          <Separator />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="rowBackground">Background</Label>
              <select
                id="rowBackground"
                className="w-full mt-1.5 h-10 rounded-md border border-input bg-background px-3 py-2"
                value={settings.rowBackground}
                onChange={(e) => handleChange('rowBackground', e.target.value)}
              >
                <option value="bg-card">Default (bg-card)</option>
                <option value="bg-white">White (bg-white)</option>
                <option value="bg-gray-50">Light Gray (bg-gray-50)</option>
              </select>
            </div>
            
            <div>
              <Label htmlFor="rowTextColor">Text Color</Label>
              <select
                id="rowTextColor"
                className="w-full mt-1.5 h-10 rounded-md border border-input bg-background px-3 py-2"
                value={settings.rowTextColor}
                onChange={(e) => handleChange('rowTextColor', e.target.value)}
              >
                <option value="text-card-foreground">Default (text-card-foreground)</option>
                <option value="text-gray-600">Gray (text-gray-600)</option>
                <option value="text-gray-800">Dark Gray (text-gray-800)</option>
              </select>
            </div>
            
            <div>
              <Label htmlFor="rowFontSize">Font Size</Label>
              <select
                id="rowFontSize"
                className="w-full mt-1.5 h-10 rounded-md border border-input bg-background px-3 py-2"
                value={settings.rowFontSize}
                onChange={(e) => handleChange('rowFontSize', e.target.value)}
              >
                <option value="text-xs">Small (text-xs)</option>
                <option value="text-sm">Medium (text-sm)</option>
                <option value="text-base">Large (text-base)</option>
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
                <option value="hover:bg-muted/50">Default (hover:bg-muted/50)</option>
                <option value="hover:bg-gray-100">Light Gray (hover:bg-gray-100)</option>
                <option value="hover:bg-primary/5">Primary Subtle (hover:bg-primary/5)</option>
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
