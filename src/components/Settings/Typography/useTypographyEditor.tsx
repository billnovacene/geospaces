
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { TypographySettings, defaultSettings } from "./types";

export const useTypographyEditor = () => {
  const [settings, setSettings] = useState<TypographySettings>(defaultSettings);
  const [isUpdating, setIsUpdating] = useState(false);
  const { toast } = useToast();

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
    
    // Simulate updating CSS variables or classes
    setTimeout(() => {
      // Update document root styles with font family
      document.documentElement.style.fontFamily = settings.fontFamily;
      
      // Update CSS variables in the document root
      const root = document.documentElement;
      
      // Update navigation styles
      document.documentElement.style.setProperty('--nav-item-size', settings.navigation.item.size);
      document.documentElement.style.setProperty('--nav-item-weight', settings.navigation.item.weight);
      document.documentElement.style.setProperty('--nav-item-color', settings.navigation.item.color);
      document.documentElement.style.setProperty('--nav-active-size', settings.navigation.active.size);
      document.documentElement.style.setProperty('--nav-active-weight', settings.navigation.active.weight);
      document.documentElement.style.setProperty('--nav-active-color', settings.navigation.active.color);
      
      toast({
        title: "Typography Updated",
        description: "Your typography changes have been applied",
      });
      
      setIsUpdating(false);
    }, 800);
  };

  const resetToDefaults = () => {
    setSettings(defaultSettings);
    document.documentElement.style.fontFamily = defaultSettings.fontFamily;
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
