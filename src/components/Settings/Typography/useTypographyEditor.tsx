
import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { TypographySettings, defaultSettings } from "./types";

export const useTypographyEditor = () => {
  const [settings, setSettings] = useState<TypographySettings>(defaultSettings);
  const [isUpdating, setIsUpdating] = useState(false);
  const { toast } = useToast();

  // Load saved settings on initial render
  useEffect(() => {
    const savedSettings = localStorage.getItem('typography-settings');
    if (savedSettings) {
      try {
        setSettings(JSON.parse(savedSettings));
      } catch (error) {
        console.error("Failed to parse saved typography settings", error);
      }
    }
  }, []);

  const handleFontFamilyChange = (fontFamily: string) => {
    setSettings(prev => ({
      ...prev,
      fontFamily
    }));
  };

  const handleHeadingChange = (
    level: 'h1' | 'h2' | 'h3' | 'h4',
    property: 'size' | 'weight' | 'tracking',
    value: string
  ) => {
    setSettings(prev => ({
      ...prev,
      headings: {
        ...prev.headings,
        [level]: {
          ...prev.headings[level],
          [property]: value
        }
      }
    }));
  };

  const handleBodyChange = (
    type: 'large' | 'normal' | 'small',
    property: 'size' | 'weight' | 'color',
    value: string
  ) => {
    setSettings(prev => ({
      ...prev,
      body: {
        ...prev.body,
        [type]: {
          ...prev.body[type],
          [property]: value
        }
      }
    }));
  };

  const handleNavigationChange = (
    type: 'item' | 'active',
    property: 'size' | 'weight' | 'color',
    value: string
  ) => {
    setSettings(prev => ({
      ...prev,
      navigation: {
        ...prev.navigation,
        [type]: {
          ...prev.navigation[type],
          [property]: value
        }
      }
    }));
  };

  const applyChanges = () => {
    setIsUpdating(true);
    
    setTimeout(() => {
      // Set font family
      document.documentElement.style.setProperty('--font-family-base', settings.fontFamily);
      
      // Apply heading styles
      document.documentElement.style.setProperty('--heading-1-size', settings.headings.h1.size);
      document.documentElement.style.setProperty('--heading-1-weight', settings.headings.h1.weight);
      document.documentElement.style.setProperty('--heading-1-tracking', settings.headings.h1.tracking);
      
      document.documentElement.style.setProperty('--heading-2-size', settings.headings.h2.size);
      document.documentElement.style.setProperty('--heading-2-weight', settings.headings.h2.weight);
      document.documentElement.style.setProperty('--heading-2-tracking', settings.headings.h2.tracking);
      
      document.documentElement.style.setProperty('--heading-3-size', settings.headings.h3.size);
      document.documentElement.style.setProperty('--heading-3-weight', settings.headings.h3.weight);
      document.documentElement.style.setProperty('--heading-3-tracking', settings.headings.h3.tracking);
      
      document.documentElement.style.setProperty('--heading-4-size', settings.headings.h4.size);
      document.documentElement.style.setProperty('--heading-4-weight', settings.headings.h4.weight);
      document.documentElement.style.setProperty('--heading-4-tracking', settings.headings.h4.tracking);
      
      // Apply body text styles
      document.documentElement.style.setProperty('--body-large-size', settings.body.large.size);
      document.documentElement.style.setProperty('--body-large-weight', settings.body.large.weight);
      document.documentElement.style.setProperty('--body-large-color', settings.body.large.color);
      
      document.documentElement.style.setProperty('--body-normal-size', settings.body.normal.size);
      document.documentElement.style.setProperty('--body-normal-weight', settings.body.normal.weight);
      document.documentElement.style.setProperty('--body-normal-color', settings.body.normal.color);
      
      document.documentElement.style.setProperty('--body-small-size', settings.body.small.size);
      document.documentElement.style.setProperty('--body-small-weight', settings.body.small.weight);
      document.documentElement.style.setProperty('--body-small-color', settings.body.small.color);
      
      // Update navigation styles
      document.documentElement.style.setProperty('--nav-item-size', settings.navigation.item.size);
      document.documentElement.style.setProperty('--nav-item-weight', settings.navigation.item.weight);
      document.documentElement.style.setProperty('--nav-item-color', settings.navigation.item.color);
      
      document.documentElement.style.setProperty('--nav-active-size', settings.navigation.active.size);
      document.documentElement.style.setProperty('--nav-active-weight', settings.navigation.active.weight);
      document.documentElement.style.setProperty('--nav-active-color', settings.navigation.active.color);
      
      // Store settings in localStorage for persistence
      localStorage.setItem('typography-settings', JSON.stringify(settings));
      
      toast({
        title: "Typography Updated",
        description: "Your typography changes have been applied across the entire site",
      });
      
      setIsUpdating(false);
    }, 800);
  };

  const resetToDefaults = () => {
    setSettings(defaultSettings);
    
    // Reset CSS variables to default values
    Object.entries(defaultSettings.headings).forEach(([level, props]) => {
      Object.entries(props).forEach(([prop, value]) => {
        document.documentElement.style.setProperty(`--heading-${level}-${prop}`, value as string);
      });
    });
    
    Object.entries(defaultSettings.body).forEach(([type, props]) => {
      Object.entries(props).forEach(([prop, value]) => {
        document.documentElement.style.setProperty(`--body-${type}-${prop}`, value as string);
      });
    });
    
    Object.entries(defaultSettings.navigation).forEach(([type, props]) => {
      Object.entries(props).forEach(([prop, value]) => {
        document.documentElement.style.setProperty(`--nav-${type}-${prop}`, value as string);
      });
    });
    
    document.documentElement.style.setProperty('--font-family-base', defaultSettings.fontFamily);
    
    // Clear localStorage settings
    localStorage.removeItem('typography-settings');
    
    toast({
      title: "Typography Reset",
      description: "Typography settings have been reset to defaults",
    });
  };

  return {
    settings,
    isUpdating,
    handleFontFamilyChange,
    handleHeadingChange,
    handleBodyChange,
    handleNavigationChange,
    applyChanges,
    resetToDefaults
  };
};
