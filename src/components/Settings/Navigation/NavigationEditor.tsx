
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { GeneralTab } from "./GeneralTab";
import { TypographyTab } from "./TypographyTab";
import { BordersTab } from "./BordersTab";
import { EditorActions } from "./EditorActions";
import { NavigationPreview } from "./NavigationPreview";
import { useNavigationSettings } from "./useNavigationSettings";

export const NavigationEditor = () => {
  const [activeTab, setActiveTab] = useState("general");
  const {
    settings,
    isUpdating,
    handleChange,
    applyChanges,
    resetToDefaults,
    handleNavItemSizeChange,
    handleNavItemWeightChange,
    handleNavItemColorChange,
    handleActiveNavItemColorChange
  } = useNavigationSettings();

  return (
    <div className="grid md:grid-cols-2 gap-6">
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
              <GeneralTab 
                settings={settings} 
                handleChange={handleChange} 
              />
            </TabsContent>
            
            <TabsContent value="typography" className="space-y-6">
              <TypographyTab 
                settings={settings}
                handleNavItemSizeChange={handleNavItemSizeChange}
                handleNavItemWeightChange={handleNavItemWeightChange}
                handleNavItemColorChange={handleNavItemColorChange}
                handleActiveNavItemColorChange={handleActiveNavItemColorChange}
              />
            </TabsContent>
            
            <TabsContent value="borders" className="space-y-6">
              <BordersTab 
                settings={settings} 
                handleChange={handleChange} 
              />
            </TabsContent>
          </Tabs>
          
          <EditorActions 
            resetToDefaults={resetToDefaults}
            applyChanges={applyChanges}
            isUpdating={isUpdating}
          />
        </CardContent>
      </Card>
      
      {/* Preview card */}
      <NavigationPreview settings={settings} />
    </div>
  );
};
