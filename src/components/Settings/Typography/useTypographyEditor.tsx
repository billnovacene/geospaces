
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
    
    setTimeout(() => {
      // Update document root styles with font family
      document.documentElement.style.fontFamily = settings.fontFamily;
      
      // Apply heading styles to CSS custom properties
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
      document.documentElement.style.setProperty('--body-normal-size', settings.body.normal.size);
      document.documentElement.style.setProperty('--body-small-size', settings.body.small.size);
      
      // Update navigation styles
      document.documentElement.style.setProperty('--nav-item-size', settings.navigation.item.size);
      document.documentElement.style.setProperty('--nav-item-weight', settings.navigation.item.weight);
      document.documentElement.style.setProperty('--nav-item-color', settings.navigation.item.color);
      document.documentElement.style.setProperty('--nav-active-size', settings.navigation.active.size);
      document.documentElement.style.setProperty('--nav-active-weight', settings.navigation.active.weight);
      document.documentElement.style.setProperty('--nav-active-color', settings.navigation.active.color);
      
      // Apply the changes to relevant classes via stylesheet
      const styleElement = document.getElementById('typography-styles') || document.createElement('style');
      styleElement.id = 'typography-styles';
      styleElement.textContent = `
        .heading-1 {
          font-size: var(--heading-1-size, ${settings.headings.h1.size}) !important;
          font-weight: var(--heading-1-weight, ${settings.headings.h1.weight}) !important;
          letter-spacing: var(--heading-1-tracking, ${settings.headings.h1.tracking}) !important;
        }
        .heading-2 {
          font-size: var(--heading-2-size, ${settings.headings.h2.size}) !important;
          font-weight: var(--heading-2-weight, ${settings.headings.h2.weight}) !important;
          letter-spacing: var(--heading-2-tracking, ${settings.headings.h2.tracking}) !important;
        }
        .heading-3 {
          font-size: var(--heading-3-size, ${settings.headings.h3.size}) !important;
          font-weight: var(--heading-3-weight, ${settings.headings.h3.weight}) !important;
          letter-spacing: var(--heading-3-tracking, ${settings.headings.h3.tracking}) !important;
        }
        .heading-4 {
          font-size: var(--heading-4-size, ${settings.headings.h4.size}) !important;
          font-weight: var(--heading-4-weight, ${settings.headings.h4.weight}) !important;
          letter-spacing: var(--heading-4-tracking, ${settings.headings.h4.tracking}) !important;
        }
        .body-large {
          font-size: var(--body-large-size, ${settings.body.large.size}) !important;
        }
        .body-normal {
          font-size: var(--body-normal-size, ${settings.body.normal.size}) !important;
        }
        .body-small {
          font-size: var(--body-small-size, ${settings.body.small.size}) !important;
        }
        .nav-item {
          font-size: var(--nav-item-size, ${settings.navigation.item.size}) !important;
          font-weight: var(--nav-item-weight, ${settings.navigation.item.weight}) !important;
          color: var(--nav-item-color, ${settings.navigation.item.color}) !important;
        }
        .nav-item-active {
          font-size: var(--nav-active-size, ${settings.navigation.active.size}) !important;
          font-weight: var(--nav-active-weight, ${settings.navigation.active.weight}) !important;
          color: var(--nav-active-color, ${settings.navigation.active.color}) !important;
        }
      `;
      
      if (!styleElement.parentNode) {
        document.head.appendChild(styleElement);
      }
      
      // Store settings in localStorage for persistence
      localStorage.setItem('typography-settings', JSON.stringify(settings));
      
      toast({
        title: "Typography Updated",
        description: "Your typography changes have been applied",
      });
      
      setIsUpdating(false);
    }, 800);
  };

  const resetToDefaults = () => {
    setSettings(defaultSettings);
    
    // Remove any custom styles
    const styleElement = document.getElementById('typography-styles');
    if (styleElement) {
      styleElement.textContent = '';
    }
    
    // Clear localStorage settings
    localStorage.removeItem('typography-settings');
    
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
