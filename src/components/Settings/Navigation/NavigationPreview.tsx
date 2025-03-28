
import React from "react";
import { NavigationSettings } from "./types";

interface NavigationPreviewProps {
  settings: NavigationSettings;
}

export const NavigationPreview = ({ settings }: NavigationPreviewProps) => {
  return (
    <div className="p-4 border rounded-md">
      <h3 className="heading-3 mb-3">Navigation Preview</h3>
      <div className={`flex space-x-4 p-4 rounded-md ${settings.background}`}>
        <a href="#" className={`px-3 py-2 rounded-md ${settings.textColor} ${settings.fontSize} ${settings.fontWeight} ${settings.hoverBackground} ${settings.hoverTextColor}`}>
          Home
        </a>
        <a href="#" className={`px-3 py-2 rounded-md ${settings.textColor} ${settings.fontSize} ${settings.fontWeight} ${settings.hoverBackground} ${settings.hoverTextColor}`}>
          Dashboard
        </a>
        <a href="#" className={`px-3 py-2 rounded-md ${settings.activeBackground} ${settings.activeTextColor} ${settings.fontSize} ${settings.fontWeight}`}>
          Settings
        </a>
        <a href="#" className={`px-3 py-2 rounded-md ${settings.textColor} ${settings.fontSize} ${settings.fontWeight} ${settings.hoverBackground} ${settings.hoverTextColor}`}>
          Profile
        </a>
      </div>
    </div>
  );
};
