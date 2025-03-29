
import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";

interface ColorSettingsProps {
  title: string;
  mode: 'lightMode' | 'darkMode';
  trackColor: string;
  thumbColor: string;
  thumbHoverColor: string;
  onColorChange: (
    mode: 'lightMode' | 'darkMode',
    type: 'trackColor' | 'thumbColor' | 'thumbHoverColor',
    value: string
  ) => void;
}

export const ColorSettings: React.FC<ColorSettingsProps> = ({
  title,
  mode,
  trackColor,
  thumbColor,
  thumbHoverColor,
  onColorChange,
}) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">{title}</h3>
      <Separator />
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor={`${mode}-track-color`}>Track Color</Label>
          <div className="flex gap-2">
            <div 
              className="w-10 h-10 rounded border" 
              style={{ backgroundColor: trackColor }}
            />
            <Input
              id={`${mode}-track-color`}
              type="text"
              value={trackColor}
              onChange={(e) => onColorChange(mode, 'trackColor', e.target.value)}
            />
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor={`${mode}-thumb-color`}>Thumb Color</Label>
          <div className="flex gap-2">
            <div 
              className="w-10 h-10 rounded border" 
              style={{ backgroundColor: thumbColor }}
            />
            <Input
              id={`${mode}-thumb-color`}
              type="text"
              value={thumbColor}
              onChange={(e) => onColorChange(mode, 'thumbColor', e.target.value)}
            />
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor={`${mode}-thumb-hover-color`}>Thumb Hover</Label>
          <div className="flex gap-2">
            <div 
              className="w-10 h-10 rounded border" 
              style={{ backgroundColor: thumbHoverColor }}
            />
            <Input
              id={`${mode}-thumb-hover-color`}
              type="text"
              value={thumbHoverColor}
              onChange={(e) => onColorChange(mode, 'thumbHoverColor', e.target.value)}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
