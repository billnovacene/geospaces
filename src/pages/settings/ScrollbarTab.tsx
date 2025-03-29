
import React, { useEffect } from "react";
import { ScrollbarSettings } from "@/components/Settings/ScrollbarSettings";
import { useTheme } from "@/components/ThemeProvider";

export const ScrollbarTab = () => {
  const { activeTheme } = useTheme();
  
  // Force refresh scrollbar styles when this tab is shown
  useEffect(() => {
    // Force scrollbar refresh to ensure current theme's styles are applied
    document.documentElement.classList.add('scrollbar-refresh');
    const timer = setTimeout(() => {
      document.documentElement.classList.remove('scrollbar-refresh');
    }, 50);
    
    return () => clearTimeout(timer);
  }, [activeTheme]);

  return <ScrollbarSettings />;
};
