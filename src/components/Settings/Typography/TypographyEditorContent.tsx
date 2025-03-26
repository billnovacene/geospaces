
import React from "react";
import { Separator } from "@/components/ui/separator";
import { HeadingEditor } from "./HeadingEditor";
import { BodyTextEditor } from "./BodyTextEditor";
import { TypographySettings } from "./types";
import { NavigationTextEditor } from "./NavigationTextEditor";

interface TypographyEditorContentProps {
  settings: TypographySettings;
  onHeadingChange: (level: 'h1' | 'h2' | 'h3' | 'h4', property: 'size' | 'weight' | 'tracking', value: string) => void;
  onBodyChange: (type: 'large' | 'normal' | 'small', property: 'size' | 'weight' | 'color', value: string) => void;
  onNavigationChange: (type: 'item' | 'active', property: 'size' | 'weight' | 'color', value: string) => void;
}

export const TypographyEditorContent: React.FC<TypographyEditorContentProps> = ({
  settings,
  onHeadingChange,
  onBodyChange,
  onNavigationChange
}) => {
  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Heading Styles</h3>
        <Separator />
        
        <div className="grid grid-cols-1 gap-6">
          {/* Heading 1 */}
          <HeadingEditor 
            level="h1"
            size={settings.headings.h1.size}
            weight={settings.headings.h1.weight}
            tracking={settings.headings.h1.tracking}
            onSizeChange={(value) => onHeadingChange('h1', 'size', value)}
            onWeightChange={(value) => onHeadingChange('h1', 'weight', value)}
            onTrackingChange={(value) => onHeadingChange('h1', 'tracking', value)}
          />
          
          {/* Heading 2 */}
          <HeadingEditor 
            level="h2"
            size={settings.headings.h2.size}
            weight={settings.headings.h2.weight}
            tracking={settings.headings.h2.tracking}
            onSizeChange={(value) => onHeadingChange('h2', 'size', value)}
            onWeightChange={(value) => onHeadingChange('h2', 'weight', value)}
            onTrackingChange={(value) => onHeadingChange('h2', 'tracking', value)}
          />
          
          {/* Body Text */}
          <div className="space-y-4 pt-4">
            <h3 className="text-lg font-medium">Body Text Styles</h3>
            <Separator />
            
            <div className="space-y-6">
              {/* Body Large */}
              <BodyTextEditor 
                type="large"
                size={settings.body.large.size}
                weight={settings.body.large.weight}
                color={settings.body.large.color}
                onSizeChange={(value) => onBodyChange('large', 'size', value)}
                onWeightChange={(value) => onBodyChange('large', 'weight', value)}
                onColorChange={(value) => onBodyChange('large', 'color', value)}
              />
              
              {/* Body Normal */}
              <BodyTextEditor 
                type="normal"
                size={settings.body.normal.size}
                weight={settings.body.normal.weight}
                color={settings.body.normal.color}
                onSizeChange={(value) => onBodyChange('normal', 'size', value)}
                onWeightChange={(value) => onBodyChange('normal', 'weight', value)}
                onColorChange={(value) => onBodyChange('normal', 'color', value)}
              />

              {/* Body Small */}
              <BodyTextEditor 
                type="small"
                size={settings.body.small.size}
                weight={settings.body.small.weight}
                color={settings.body.small.color}
                onSizeChange={(value) => onBodyChange('small', 'size', value)}
                onWeightChange={(value) => onBodyChange('small', 'weight', value)}
                onColorChange={(value) => onBodyChange('small', 'color', value)}
              />
            </div>
          </div>
          
          {/* Navigation Text */}
          <div className="space-y-4 pt-4">
            <h3 className="text-lg font-medium">Navigation Styles</h3>
            <Separator />
            
            <div className="space-y-6">
              {/* Navigation Item */}
              <NavigationTextEditor 
                type="item"
                size={settings.navigation.item.size}
                weight={settings.navigation.item.weight}
                color={settings.navigation.item.color}
                onSizeChange={(value) => onNavigationChange('item', 'size', value)}
                onWeightChange={(value) => onNavigationChange('item', 'weight', value)}
                onColorChange={(value) => onNavigationChange('item', 'color', value)}
              />
              
              {/* Navigation Active Item */}
              <NavigationTextEditor 
                type="active"
                size={settings.navigation.active.size}
                weight={settings.navigation.active.weight}
                color={settings.navigation.active.color}
                onSizeChange={(value) => onNavigationChange('active', 'size', value)}
                onWeightChange={(value) => onNavigationChange('active', 'weight', value)}
                onColorChange={(value) => onNavigationChange('active', 'color', value)}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
