
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TypographyTab } from "./TypographyTab";
import { ThemeTab } from "./ThemeTab";
import { NavigationTab } from "./NavigationTab";
import { TablesTab } from "./TablesTab";
import { ComponentsTab } from "./ComponentsTab";
import { ColorsTab } from "./ColorsTab";

interface SettingsTabsProps {
  activeTab: string;
  setActiveTab: (value: string) => void;
}

export const SettingsTabs = ({ activeTab, setActiveTab }: SettingsTabsProps) => {
  return (
    <Tabs 
      value={activeTab} 
      onValueChange={setActiveTab}
      className="space-y-4"
    >
      <div className="flex justify-between items-center">
        <TabsList>
          <TabsTrigger value="typography">Typography</TabsTrigger>
          <TabsTrigger value="theme">Theme</TabsTrigger>
          <TabsTrigger value="navigation">Navigation</TabsTrigger>
          <TabsTrigger value="tables">Tables</TabsTrigger>
          <TabsTrigger value="components">Components</TabsTrigger>
          <TabsTrigger value="colors">Colors</TabsTrigger>
        </TabsList>
      </div>
      
      <TabsContent value="typography" className="space-y-4">
        <TypographyTab />
      </TabsContent>
      
      <TabsContent value="theme" className="space-y-4">
        <ThemeTab />
      </TabsContent>
      
      <TabsContent value="navigation" className="space-y-4">
        <NavigationTab />
      </TabsContent>
      
      <TabsContent value="tables" className="space-y-4">
        <TablesTab />
      </TabsContent>
      
      <TabsContent value="components">
        <ComponentsTab />
      </TabsContent>
      
      <TabsContent value="colors">
        <ColorsTab />
      </TabsContent>
    </Tabs>
  );
};
