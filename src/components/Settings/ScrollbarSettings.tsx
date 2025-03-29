
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SizeSettings } from "./Scrollbar/SizeSettings";
import { ColorSettings } from "./Scrollbar/ColorSettings";
import { ScrollbarPreview } from "./Scrollbar/ScrollbarPreview";
import { ActionButtons } from "./Scrollbar/ActionButtons";
import { useScrollbarSettings } from "@/hooks/useScrollbarSettings";

export const ScrollbarSettings = () => {
  const {
    settings,
    isUpdating,
    hasChanges,
    handleWidthChange,
    handleRadiusChange,
    handleColorChange,
    applyChanges,
    resetToDefaults,
    cancelChanges,
  } = useScrollbarSettings();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Scrollbar Settings</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Scrollbar Size Settings */}
        <SizeSettings 
          settings={settings}
          onWidthChange={handleWidthChange}
          onRadiusChange={handleRadiusChange}
        />
        
        {/* Light Mode Colors */}
        <ColorSettings
          title="Light Mode Colors"
          mode="lightMode"
          trackColor={settings.lightMode.trackColor}
          thumbColor={settings.lightMode.thumbColor}
          thumbHoverColor={settings.lightMode.thumbHoverColor}
          onColorChange={handleColorChange}
        />
        
        {/* Dark Mode Colors */}
        <ColorSettings
          title="Dark Mode Colors"
          mode="darkMode"
          trackColor={settings.darkMode.trackColor}
          thumbColor={settings.darkMode.thumbColor}
          thumbHoverColor={settings.darkMode.thumbHoverColor}
          onColorChange={handleColorChange}
        />
        
        {/* Preview */}
        <ScrollbarPreview settings={settings} />
        
        {/* Actions */}
        <ActionButtons
          isUpdating={isUpdating}
          onReset={resetToDefaults}
          onApply={applyChanges}
          onCancel={hasChanges ? cancelChanges : undefined}
        />
      </CardContent>
    </Card>
  );
};
