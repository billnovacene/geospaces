
import React, { useEffect, useRef } from "react";
import { Separator } from "@/components/ui/separator";
import { ScrollbarSettings } from "@/hooks/useScrollbarSettings";
import { useTheme } from "@/components/ThemeProvider";

interface ScrollbarPreviewProps {
  settings: ScrollbarSettings;
}

export const ScrollbarPreview: React.FC<ScrollbarPreviewProps> = ({ settings }) => {
  const { activeTheme } = useTheme();
  const lightPreviewRef = useRef<HTMLDivElement>(null);
  const darkPreviewRef = useRef<HTMLDivElement>(null);

  // Apply styles directly to the preview elements with improved specificity
  useEffect(() => {
    if (lightPreviewRef.current) {
      // Apply light mode scrollbar styles directly to the preview with !important
      const lightStyles = lightPreviewRef.current.style;
      lightStyles.setProperty('--scrollbar-width', `${settings.width}px`, 'important');
      lightStyles.setProperty('--scrollbar-height', `${settings.width}px`, 'important');
      lightStyles.setProperty('--scrollbar-radius', `${settings.radius}px`, 'important');
      lightStyles.setProperty('--scrollbar-track-color', settings.lightMode.trackColor, 'important');
      lightStyles.setProperty('--scrollbar-thumb-color', settings.lightMode.thumbColor, 'important');
      lightStyles.setProperty('--scrollbar-thumb-hover-color', settings.lightMode.thumbHoverColor, 'important');
      
      // Directly apply scrollbar properties as well for better support
      lightPreviewRef.current.scrollTop = 0;
    }
    
    if (darkPreviewRef.current) {
      // Apply dark mode scrollbar styles directly to the preview with !important
      const darkStyles = darkPreviewRef.current.style;
      darkStyles.setProperty('--scrollbar-width', `${settings.width}px`, 'important');
      darkStyles.setProperty('--scrollbar-height', `${settings.width}px`, 'important');
      darkStyles.setProperty('--scrollbar-radius', `${settings.radius}px`, 'important');
      darkStyles.setProperty('--scrollbar-track-color', settings.darkMode.trackColor, 'important');
      darkStyles.setProperty('--scrollbar-thumb-color', settings.darkMode.thumbColor, 'important');
      darkStyles.setProperty('--scrollbar-thumb-hover-color', settings.darkMode.thumbHoverColor, 'important');
      
      // Directly apply scrollbar properties as well for better support
      darkPreviewRef.current.scrollTop = 0;
    }
    
    // Also apply styles via a stylesheet for maximum compatibility
    const styleEl = document.createElement('style');
    styleEl.innerHTML = `
      /* Light preview direct styling */
      .scrollbar-preview.light-preview::-webkit-scrollbar-track {
        background-color: ${settings.lightMode.trackColor} !important;
      }
      
      .scrollbar-preview.light-preview::-webkit-scrollbar-thumb {
        background-color: ${settings.lightMode.thumbColor} !important;
        border-radius: ${settings.radius}px !important;
      }
      
      .scrollbar-preview.light-preview::-webkit-scrollbar-thumb:hover {
        background-color: ${settings.lightMode.thumbHoverColor} !important;
      }
      
      .scrollbar-preview.light-preview::-webkit-scrollbar {
        width: ${settings.width}px !important;
        height: ${settings.width}px !important;
      }
      
      /* Dark preview direct styling */
      .scrollbar-preview.dark-preview::-webkit-scrollbar-track {
        background-color: ${settings.darkMode.trackColor} !important;
      }
      
      .scrollbar-preview.dark-preview::-webkit-scrollbar-thumb {
        background-color: ${settings.darkMode.thumbColor} !important;
        border-radius: ${settings.radius}px !important;
      }
      
      .scrollbar-preview.dark-preview::-webkit-scrollbar-thumb:hover {
        background-color: ${settings.darkMode.thumbHoverColor} !important;
      }
      
      .scrollbar-preview.dark-preview::-webkit-scrollbar {
        width: ${settings.width}px !important;
        height: ${settings.width}px !important;
      }
    `;
    document.head.appendChild(styleEl);
    
    return () => {
      document.head.removeChild(styleEl);
    };
  }, [settings]);

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Preview</h3>
      <Separator />
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <p className="font-medium">Light Mode</p>
          <div 
            ref={lightPreviewRef}
            className="h-40 overflow-auto border rounded-md p-4 scrollbar-preview light-preview"
            style={{
              backgroundColor: 'white',
              color: 'black',
            }}
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
            ref={darkPreviewRef}
            className="h-40 overflow-auto border rounded-md p-4 scrollbar-preview dark-preview"
            style={{
              backgroundColor: '#1f2937',
              color: 'white',
            }}
          >
            <div className="space-y-2">
              {Array.from({ length: 20 }).map((_, i) => (
                <p key={i}>Scrollbar preview content line {i + 1}</p>
              ))}
            </div>
          </div>
        </div>
      </div>
      
      <div className="mt-4 text-xs text-muted-foreground">
        <p>Current app theme: <span className="font-mono">{activeTheme}</span></p>
        <p>Dark mode detected: <span className="font-mono">{document.documentElement.classList.contains('dark') ? 'true' : 'false'}</span></p>
      </div>
    </div>
  );
};
