
import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";

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
  const [isUpdating, setIsUpdating] = useState(false);
  const { toast } = useToast();

  // Load saved settings on initial render
  useEffect(() => {
    const savedSettings = localStorage.getItem('scrollbar-settings');
    if (savedSettings) {
      try {
        setSettings(JSON.parse(savedSettings));
      } catch (error) {
        console.error("Failed to parse saved scrollbar settings", error);
      }
    }
  }, []);

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

  // Apply changes to the DOM
  const applyChanges = () => {
    setIsUpdating(true);
    
    setTimeout(() => {
      // Set scrollbar CSS variables
      document.documentElement.style.setProperty('--scrollbar-width', `${settings.width}px`);
      document.documentElement.style.setProperty('--scrollbar-height', `${settings.width}px`);
      document.documentElement.style.setProperty('--scrollbar-radius', `${settings.radius}px`);
      
      // Set light mode colors
      document.documentElement.style.setProperty('--scrollbar-track-color', settings.lightMode.trackColor);
      document.documentElement.style.setProperty('--scrollbar-thumb-color', settings.lightMode.thumbColor);
      document.documentElement.style.setProperty('--scrollbar-thumb-hover-color', settings.lightMode.thumbHoverColor);
      
      // Set dark mode colors in :root.dark selector
      const darkModeStyle = document.createElement('style');
      darkModeStyle.textContent = `
        .dark {
          --scrollbar-track-color: ${settings.darkMode.trackColor} !important;
          --scrollbar-thumb-color: ${settings.darkMode.thumbColor} !important;
          --scrollbar-thumb-hover-color: ${settings.darkMode.thumbHoverColor} !important;
        }
      `;
      
      // Remove any previously added style element
      const prevStyle = document.getElementById('scrollbar-dark-style');
      if (prevStyle) {
        prevStyle.remove();
      }
      
      // Add new style element
      darkModeStyle.id = 'scrollbar-dark-style';
      document.head.appendChild(darkModeStyle);
      
      // Force scrollbar refresh
      document.documentElement.classList.add('scrollbar-refresh');
      setTimeout(() => {
        document.documentElement.classList.remove('scrollbar-refresh');
      }, 50);
      
      // Store settings in localStorage
      localStorage.setItem('scrollbar-settings', JSON.stringify(settings));
      
      toast({
        title: "Scrollbar Settings Updated",
        description: "Your scrollbar customizations have been applied",
      });
      
      setIsUpdating(false);
    }, 300);
  };

  // Reset to defaults
  const resetToDefaults = () => {
    setSettings(defaultSettings);
    
    // Reset CSS variables to default values
    document.documentElement.style.removeProperty('--scrollbar-width');
    document.documentElement.style.removeProperty('--scrollbar-height');
    document.documentElement.style.removeProperty('--scrollbar-radius');
    document.documentElement.style.removeProperty('--scrollbar-track-color');
    document.documentElement.style.removeProperty('--scrollbar-thumb-color');
    document.documentElement.style.removeProperty('--scrollbar-thumb-hover-color');
    
    // Remove dark mode style element
    const prevStyle = document.getElementById('scrollbar-dark-style');
    if (prevStyle) {
      prevStyle.remove();
    }
    
    // Force scrollbar refresh
    document.documentElement.classList.add('scrollbar-refresh');
    setTimeout(() => {
      document.documentElement.classList.remove('scrollbar-refresh');
    }, 50);
    
    // Remove stored settings
    localStorage.removeItem('scrollbar-settings');
    
    toast({
      title: "Scrollbar Settings Reset",
      description: "Scrollbar settings have been reset to defaults",
    });
  };

  return {
    settings,
    isUpdating,
    handleWidthChange,
    handleRadiusChange,
    handleColorChange,
    applyChanges,
    resetToDefaults,
  };
}
