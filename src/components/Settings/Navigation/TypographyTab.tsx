
import React from "react";
import { Separator } from "@/components/ui/separator";
import { NavigationSettings } from "./types";
import { NavigationTextEditor } from "../Typography/NavigationTextEditor";

interface TypographyTabProps {
  settings: NavigationSettings;
  handleNavItemSizeChange: (value: string) => void;
  handleNavItemWeightChange: (value: string) => void;
  handleNavItemColorChange: (value: string) => void;
  handleActiveNavItemColorChange: (value: string) => void;
}

export const TypographyTab = ({
  settings,
  handleNavItemSizeChange,
  handleNavItemWeightChange,
  handleNavItemColorChange,
  handleActiveNavItemColorChange
}: TypographyTabProps) => {
  return (
    <div className="space-y-6">
      <h3 className="heading-3">Navigation Item</h3>
      <Separator />
      
      <NavigationTextEditor
        type="item"
        size={settings.fontSize}
        weight={settings.fontWeight}
        color={settings.textColor}
        onSizeChange={handleNavItemSizeChange}
        onWeightChange={handleNavItemWeightChange}
        onColorChange={handleNavItemColorChange}
      />
      
      <h3 className="heading-3 mt-6">Active Navigation Item</h3>
      <Separator />
      
      <NavigationTextEditor
        type="active"
        size={settings.fontSize}
        weight={settings.fontWeight}
        color={settings.activeTextColor}
        onSizeChange={handleNavItemSizeChange}
        onWeightChange={handleNavItemWeightChange}
        onColorChange={handleActiveNavItemColorChange}
      />
    </div>
  );
};
