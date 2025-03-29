
import React from "react";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ScrollbarSettings } from "@/hooks/useScrollbarSettings";

interface SizeSettingsProps {
  settings: ScrollbarSettings;
  onWidthChange: (value: number[]) => void;
  onRadiusChange: (value: number[]) => void;
}

export const SizeSettings: React.FC<SizeSettingsProps> = ({
  settings,
  onWidthChange,
  onRadiusChange,
}) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Size Settings</h3>
      <Separator />
      
      <div className="space-y-6">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="scrollbar-width">Width</Label>
            <Badge variant="outline">{settings.width}px</Badge>
          </div>
          <Slider
            id="scrollbar-width"
            min={6}
            max={20}
            step={1}
            value={[settings.width]}
            onValueChange={onWidthChange}
          />
        </div>
        
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="scrollbar-radius">Rounded Corners</Label>
            <Badge variant="outline">{settings.radius === 9999 ? 'Full' : `${settings.radius}px`}</Badge>
          </div>
          <Slider
            id="scrollbar-radius"
            min={0}
            max={9999}
            step={1}
            value={[settings.radius]}
            onValueChange={onRadiusChange}
          />
          <p className="text-xs text-muted-foreground mt-1">
            Slide all the way to the right for fully rounded corners.
          </p>
        </div>
      </div>
    </div>
  );
};
