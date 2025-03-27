
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TypographyEditorContent } from "./TypographyEditorContent";
import { TypographyEditorActions } from "./TypographyEditorActions";
import { useTypographyEditor } from "./useTypographyEditor";

export const TypographyEditor = () => {
  const {
    settings,
    isUpdating,
    handleFontFamilyChange,
    handleHeadingChange,
    handleBodyChange,
    handleNavigationChange,
    applyChanges,
    resetToDefaults
  } = useTypographyEditor();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Typography Editor</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <TypographyEditorContent 
          settings={settings}
          onFontFamilyChange={handleFontFamilyChange}
          onHeadingChange={handleHeadingChange}
          onBodyChange={handleBodyChange}
          onNavigationChange={handleNavigationChange}
        />
        
        <TypographyEditorActions 
          isUpdating={isUpdating}
          onReset={resetToDefaults}
          onApply={applyChanges}
        />
      </CardContent>
    </Card>
  );
};
