
import React from "react";
import { Separator } from "@/components/ui/separator";
import { ScrollbarSettings } from "@/hooks/useScrollbarSettings";

interface ScrollbarPreviewProps {
  settings: ScrollbarSettings;
}

export const ScrollbarPreview: React.FC<ScrollbarPreviewProps> = ({ settings }) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Preview</h3>
      <Separator />
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <p className="font-medium">Light Mode</p>
          <div 
            className="h-40 overflow-auto border rounded-md p-4"
            style={{
              backgroundColor: 'white',
              color: 'black',
              '--scrollbar-width': `${settings.width}px`,
              '--scrollbar-track-color': settings.lightMode.trackColor,
              '--scrollbar-thumb-color': settings.lightMode.thumbColor,
              '--scrollbar-thumb-hover-color': settings.lightMode.thumbHoverColor,
            } as React.CSSProperties}
          >
            <div className="space-y-2">
              {Array.from({ length: 20 }).map((_, i) => (
                <p key={i}>Scrollbar preview content line {i + 1}</p>
              ))}
            </div>
          </div>
        </div>
        
        <div className="space-y-2">
          <p className="font-medium">Dark Mode</p>
          <div 
            className="h-40 overflow-auto border rounded-md p-4"
            style={{
              backgroundColor: '#1f2937',
              color: 'white',
              '--scrollbar-width': `${settings.width}px`,
              '--scrollbar-track-color': settings.darkMode.trackColor,
              '--scrollbar-thumb-color': settings.darkMode.thumbColor,
              '--scrollbar-thumb-hover-color': settings.darkMode.thumbHoverColor,
            } as React.CSSProperties}
          >
            <div className="space-y-2">
              {Array.from({ length: 20 }).map((_, i) => (
                <p key={i}>Scrollbar preview content line {i + 1}</p>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
