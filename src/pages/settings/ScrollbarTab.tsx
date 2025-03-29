
import React, { useEffect } from "react";
import { ScrollbarSettings } from "@/components/Settings/ScrollbarSettings";
import { useTheme } from "@/components/ThemeProvider";

export const ScrollbarTab = () => {
  const { activeTheme } = useTheme();
  
  // Force refresh scrollbar styles when this tab is shown with improved mechanism
  useEffect(() => {
    // Force scrollbar refresh to ensure current theme's styles are applied
    document.documentElement.classList.add('scrollbar-refresh');
    
    // Apply current theme's scrollbar styles directly
    const scrollbarSettings = localStorage.getItem('scrollbar-settings');
    if (scrollbarSettings) {
      try {
        const settings = JSON.parse(scrollbarSettings);
        
        // Apply theme-specific colors based on current theme
        if (activeTheme === 'dark') {
          document.documentElement.style.setProperty('--scrollbar-track-color', settings.darkMode.trackColor);
          document.documentElement.style.setProperty('--scrollbar-thumb-color', settings.darkMode.thumbColor);
          document.documentElement.style.setProperty('--scrollbar-thumb-hover-color', settings.darkMode.thumbHoverColor);
        } else {
          document.documentElement.style.setProperty('--scrollbar-track-color', settings.lightMode.trackColor);
          document.documentElement.style.setProperty('--scrollbar-thumb-color', settings.lightMode.thumbColor);
          document.documentElement.style.setProperty('--scrollbar-thumb-hover-color', settings.lightMode.thumbHoverColor);
        }
        
        // Apply size and radius
        document.documentElement.style.setProperty('--scrollbar-width', `${settings.width}px`);
        document.documentElement.style.setProperty('--scrollbar-height', `${settings.width}px`);
        document.documentElement.style.setProperty('--scrollbar-radius', `${settings.radius}px`);
      } catch (e) {
        console.error("Failed to parse scrollbar settings", e);
      }
    }
    
    // Use a two-step process for better browser rendering
    const timer1 = setTimeout(() => {
      document.documentElement.classList.add('scrollbar-refresh-done');
      document.documentElement.classList.remove('scrollbar-refresh');
      
      // Second timeout to ensure styles are fully applied
      const timer2 = setTimeout(() => {
        document.documentElement.classList.remove('scrollbar-refresh-done');
      }, 100);
      
      return () => clearTimeout(timer2);
    }, 50);
    
    return () => clearTimeout(timer1);
  }, [activeTheme]);

  return <ScrollbarSettings />;
};
