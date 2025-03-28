
import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { NavigationSettings, defaultSettings } from "./types";

export const useNavigationSettings = () => {
  const [settings, setSettings] = useState<NavigationSettings>(defaultSettings);
  const [isUpdating, setIsUpdating] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const savedSettings = localStorage.getItem('navigation-settings');
    if (savedSettings) {
      try {
        const parsed = JSON.parse(savedSettings);
        // Ensure we have all the new properties with defaults
        setSettings({
          ...defaultSettings,
          ...parsed
        });
      } catch (e) {
        console.error("Error parsing saved navigation settings", e);
      }
    }
  }, []);

  const handleChange = (
    property: keyof NavigationSettings,
    value: string
  ) => {
    setSettings(prev => ({
      ...prev,
      [property]: value
    }));
  };

  const applyChanges = () => {
    setIsUpdating(true);
    
    setTimeout(() => {
      // Apply the CSS variables
      const bgClass = settings.background.replace('bg-', '');
      const textClass = settings.textColor.replace('text-', '');
      const hoverBgClass = settings.hoverBackground.replace('hover:bg-', '');
      const hoverTextClass = settings.hoverTextColor.replace('hover:text-', '');
      const activeBgClass = settings.activeBackground.replace('bg-', '');
      const activeTextClass = settings.activeTextColor.replace('text-', '');
      const fontSizeClass = settings.fontSize.replace('text-', '');
      const fontWeightClass = settings.fontWeight.replace('font-', '');
      
      // Set CSS variables
      document.documentElement.style.setProperty('--nav-text-color', `var(--${textClass})`);
      document.documentElement.style.setProperty('--nav-hover-bg-color', `var(--${hoverBgClass.replace('/', '-')})`);
      document.documentElement.style.setProperty('--nav-hover-text-color', `var(--${hoverTextClass})`);
      document.documentElement.style.setProperty('--nav-active-bg-color', `var(--${activeBgClass})`);
      document.documentElement.style.setProperty('--nav-active-text-color', `var(--${activeTextClass})`);
      document.documentElement.style.setProperty('--nav-font-size', fontSizeClass === 'xs' ? '0.75rem' : 
                                               fontSizeClass === 'sm' ? '0.875rem' : '1rem');
      document.documentElement.style.setProperty('--nav-font-weight', fontWeightClass === 'light' ? '300' : 
                                               fontWeightClass === 'normal' ? '400' : 
                                               fontWeightClass === 'medium' ? '500' : '600');
      
      // Apply border settings
      document.documentElement.style.setProperty('--sidebar-border-width', settings.borderWidth);
      document.documentElement.style.setProperty('--sidebar-border-color', settings.borderColor);
      document.documentElement.style.setProperty('--sidebar-border-radius', settings.borderRadius);
      
      localStorage.setItem('navigation-settings', JSON.stringify(settings));
      
      toast({
        title: "Navigation Styles Updated",
        description: "Your navigation style changes have been applied",
      });
      
      setIsUpdating(false);
    }, 800);
  };

  const resetToDefaults = () => {
    setSettings(defaultSettings);
    
    const customProps = [
      '--nav-text-color', '--nav-hover-bg-color', '--nav-hover-text-color', 
      '--nav-active-bg-color', '--nav-active-text-color', '--nav-font-size', 
      '--nav-font-weight', '--sidebar-border-width', '--sidebar-border-color',
      '--sidebar-border-radius'
    ];
    
    customProps.forEach(prop => {
      document.documentElement.style.removeProperty(prop);
    });
    
    localStorage.removeItem('navigation-settings');
    
    toast({
      title: "Navigation Styles Reset",
      description: "Navigation styles have been reset to defaults",
    });
  };

  const handleNavItemSizeChange = (value: string) => {
    setSettings(prev => ({
      ...prev,
      fontSize: value
    }));
  };

  const handleNavItemWeightChange = (value: string) => {
    setSettings(prev => ({
      ...prev,
      fontWeight: value
    }));
  };

  const handleNavItemColorChange = (value: string) => {
    setSettings(prev => ({
      ...prev,
      textColor: value
    }));
  };

  const handleActiveNavItemColorChange = (value: string) => {
    setSettings(prev => ({
      ...prev,
      activeTextColor: value
    }));
  };

  return {
    settings,
    isUpdating,
    handleChange,
    applyChanges,
    resetToDefaults,
    handleNavItemSizeChange,
    handleNavItemWeightChange,
    handleNavItemColorChange,
    handleActiveNavItemColorChange
  };
};
