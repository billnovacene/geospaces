
import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { useTheme } from "@/components/ThemeProvider";

export interface ScrollbarSettings {
  width: number;
  radius: number;
  lightMode: {
    trackColor: string;
    thumbColor: string;
    thumbHoverColor: string;
  };
  darkMode: {
    trackColor: string;
    thumbColor: string;
    thumbHoverColor: string;
  };
}

export const defaultSettings: ScrollbarSettings = {
  width: 12,
  radius: 9999,
  lightMode: {
    trackColor: "#f3f4f6", // bg-gray-100
    thumbColor: "#d1d5db", // bg-gray-300
    thumbHoverColor: "#9ca3af", // bg-gray-400
  },
  darkMode: {
    trackColor: "#1f2937", // bg-gray-800
    thumbColor: "#4b5563", // bg-gray-600
    thumbHoverColor: "#6b7280", // bg-gray-500
  },
};

export function useScrollbarSettings() {
  const [settings, setSettings] = useState<ScrollbarSettings>(defaultSettings);
  const [originalSettings, setOriginalSettings] = useState<ScrollbarSettings>(defaultSettings);
  const [isUpdating, setIsUpdating] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const { toast } = useToast();
  const { activeTheme } = useTheme();

  // Load saved settings on initial render
  useEffect(() => {
    const savedSettings = localStorage.getItem('scrollbar-settings');
    if (savedSettings) {
      try {
        const parsed = JSON.parse(savedSettings);
        setSettings(parsed);
        setOriginalSettings(parsed);
      } catch (error) {
        console.error("Failed to parse saved scrollbar settings", error);
      }
    }
  }, []);

  // Check for changes
  useEffect(() => {
    const isChanged = JSON.stringify(settings) !== JSON.stringify(originalSettings);
    setHasChanges(isChanged);
  }, [settings, originalSettings]);

  // Handle width change
  const handleWidthChange = (value: number[]) => {
    setSettings((prev) => ({
      ...prev,
      width: value[0],
    }));
  };

  // Handle radius change
  const handleRadiusChange = (value: number[]) => {
    setSettings((prev) => ({
      ...prev,
      radius: value[0],
    }));
  };

  // Handle color change
  const handleColorChange = (
    mode: 'lightMode' | 'darkMode',
    type: 'trackColor' | 'thumbColor' | 'thumbHoverColor',
    value: string
  ) => {
    setSettings((prev) => ({
      ...prev,
      [mode]: {
        ...prev[mode],
        [type]: value,
      },
    }));
  };

  // Cancel changes
  const cancelChanges = () => {
    setSettings(originalSettings);
    toast({
      title: "Changes Cancelled",
      description: "Your scrollbar settings have been reverted",
    });
  };

  // Apply changes to the DOM with improved implementation
  const applyChanges = () => {
    setIsUpdating(true);
    
    setTimeout(() => {
      try {
        // Create a style element for the scrollbar styles
        const styleId = 'global-scrollbar-styles';
        let styleElement = document.getElementById(styleId) as HTMLStyleElement;
        
        if (!styleElement) {
          styleElement = document.createElement('style');
          styleElement.id = styleId;
          document.head.appendChild(styleElement);
        }
        
        // Create CSS that works for both native scrollbars and custom scrollbars
        const css = `
          /* Global scrollbar styles with very high specificity */
          :root {
            --scrollbar-width: ${settings.width}px !important;
            --scrollbar-height: ${settings.width}px !important;
            --scrollbar-radius: ${settings.radius}px !important;
            --scrollbar-track-color: ${settings.lightMode.trackColor} !important;
            --scrollbar-thumb-color: ${settings.lightMode.thumbColor} !important;
            --scrollbar-thumb-hover-color: ${settings.lightMode.thumbHoverColor} !important;
          }
          
          /* Dark mode scrollbar styles with high specificity */
          html.dark, html.dark body, html[class*="dark"], html[data-theme="dark"] {
            --scrollbar-track-color: ${settings.darkMode.trackColor} !important;
            --scrollbar-thumb-color: ${settings.darkMode.thumbColor} !important;
            --scrollbar-thumb-hover-color: ${settings.darkMode.thumbHoverColor} !important;
          }
          
          /* WebKit scrollbars with !important */
          ::-webkit-scrollbar {
            width: var(--scrollbar-width) !important;
            height: var(--scrollbar-height) !important;
          }
          
          ::-webkit-scrollbar-track {
            background-color: var(--scrollbar-track-color) !important;
          }
          
          ::-webkit-scrollbar-thumb {
            background-color: var(--scrollbar-thumb-color) !important;
            border-radius: var(--scrollbar-radius) !important;
          }
          
          ::-webkit-scrollbar-thumb:hover {
            background-color: var(--scrollbar-thumb-hover-color) !important;
          }
          
          /* Firefox scrollbars */
          * {
            scrollbar-width: thin !important;
            scrollbar-color: var(--scrollbar-thumb-color) var(--scrollbar-track-color) !important;
          }
          
          /* Scrollbar preview styles */
          .scrollbar-preview::-webkit-scrollbar {
            width: var(--scrollbar-width) !important;
            height: var(--scrollbar-height) !important;
          }
          
          .scrollbar-preview::-webkit-scrollbar-track {
            background-color: var(--scrollbar-track-color) !important;
          }
          
          .scrollbar-preview::-webkit-scrollbar-thumb {
            background-color: var(--scrollbar-thumb-color) !important;
            border-radius: var(--scrollbar-radius) !important;
          }
          
          .scrollbar-preview::-webkit-scrollbar-thumb:hover {
            background-color: var(--scrollbar-thumb-hover-color) !important;
          }
          
          /* Add styles to ensure ScrollArea components inherit scrollbar styles */
          [data-radix-scroll-area-viewport]::-webkit-scrollbar {
            width: var(--scrollbar-width) !important;
            height: var(--scrollbar-height) !important;
          }
          
          [data-radix-scroll-area-viewport]::-webkit-scrollbar-track {
            background-color: var(--scrollbar-track-color) !important;
          }
          
          [data-radix-scroll-area-viewport]::-webkit-scrollbar-thumb {
            background-color: var(--scrollbar-thumb-color) !important;
            border-radius: var(--scrollbar-radius) !important;
          }
          
          [data-radix-scroll-area-viewport]::-webkit-scrollbar-thumb:hover {
            background-color: var(--scrollbar-thumb-hover-color) !important;
          }
        `;
        
        styleElement.textContent = css;
        
        // Force scrollbar refresh
        document.documentElement.classList.add('scrollbar-refresh');
        setTimeout(() => {
          document.documentElement.classList.add('scrollbar-refresh-done');
          document.documentElement.classList.remove('scrollbar-refresh');
          
          setTimeout(() => {
            document.documentElement.classList.remove('scrollbar-refresh-done');
          }, 100);
        }, 50);
        
        // Store settings in localStorage
        localStorage.setItem('scrollbar-settings', JSON.stringify(settings));
        setOriginalSettings(settings);
        
        toast({
          title: "Scrollbar Settings Updated",
          description: "Your scrollbar customizations have been applied",
        });
      } catch (error) {
        console.error("Failed to apply scrollbar settings", error);
        toast({
          title: "Error",
          description: "Failed to apply scrollbar settings",
          variant: "destructive",
        });
      }
      
      setIsUpdating(false);
    }, 300);
  };

  // Reset to defaults
  const resetToDefaults = () => {
    setSettings(defaultSettings);
    
    toast({
      title: "Scrollbar Settings Reset",
      description: "Settings have been reset to defaults. Click Apply to save changes.",
    });
  };

  return {
    settings,
    isUpdating,
    hasChanges,
    handleWidthChange,
    handleRadiusChange,
    handleColorChange,
    applyChanges,
    resetToDefaults,
    cancelChanges,
  };
}
