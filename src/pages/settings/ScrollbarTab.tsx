
import React, { useEffect } from "react";
import { ScrollbarSettings } from "@/components/Settings/ScrollbarSettings";
import { useTheme } from "@/components/ThemeProvider";

export const ScrollbarTab = () => {
  const { activeTheme } = useTheme();
  
  // Force refresh scrollbar styles when this tab is shown
  useEffect(() => {
    console.log("ScrollbarTab mounted with activeTheme:", activeTheme);
    
    // Create a dedicated style element for immediate scrollbar styling
    let styleEl = document.getElementById('scrollbar-tab-direct-styles');
    if (!styleEl) {
      styleEl = document.createElement('style');
      styleEl.id = 'scrollbar-tab-direct-styles';
      document.head.appendChild(styleEl);
    }
    
    // Get saved scrollbar settings
    const scrollbarSettings = localStorage.getItem('scrollbar-settings');
    if (scrollbarSettings) {
      try {
        const settings = JSON.parse(scrollbarSettings);
        
        // Apply correct dark/light mode colors based on active theme with direct DOM inspection
        const isDarkMode = document.documentElement.classList.contains('dark');
        console.log("Dark mode detected via DOM:", isDarkMode);
        console.log("Active theme from context:", activeTheme);
        
        // Use DOM detection primarily, context as fallback
        const effectiveTheme = isDarkMode ? 'dark' : activeTheme;
        const colors = effectiveTheme === 'dark' ? settings.darkMode : settings.lightMode;
        
        // Create CSS with !important to override any existing styles
        const css = `
          /* Direct override with maximum specificity */
          html.dark *::-webkit-scrollbar-track,
          .dark *::-webkit-scrollbar-track,
          [data-theme="dark"] *::-webkit-scrollbar-track {
            background-color: ${settings.darkMode.trackColor} !important;
          }
          
          html.dark *::-webkit-scrollbar-thumb,
          .dark *::-webkit-scrollbar-thumb,
          [data-theme="dark"] *::-webkit-scrollbar-thumb {
            background-color: ${settings.darkMode.thumbColor} !important;
          }
          
          html.dark *::-webkit-scrollbar-thumb:hover,
          .dark *::-webkit-scrollbar-thumb:hover,
          [data-theme="dark"] *::-webkit-scrollbar-thumb:hover {
            background-color: ${settings.darkMode.thumbHoverColor} !important;
          }
          
          /* Light mode with high specificity */
          html:not(.dark) *::-webkit-scrollbar-track,
          :not(.dark) *::-webkit-scrollbar-track {
            background-color: ${settings.lightMode.trackColor} !important;
          }
          
          html:not(.dark) *::-webkit-scrollbar-thumb,
          :not(.dark) *::-webkit-scrollbar-thumb {
            background-color: ${settings.lightMode.thumbColor} !important;
          }
          
          html:not(.dark) *::-webkit-scrollbar-thumb:hover,
          :not(.dark) *::-webkit-scrollbar-thumb:hover {
            background-color: ${settings.lightMode.thumbHoverColor} !important;
          }
          
          /* Force scrollbar width/height/radius */
          *::-webkit-scrollbar {
            width: ${settings.width}px !important;
            height: ${settings.width}px !important;
          }
          
          *::-webkit-scrollbar-thumb {
            border-radius: ${settings.radius}px !important;
          }
          
          /* Additional Firefox styles */
          * {
            scrollbar-color: ${colors.thumbColor} ${colors.trackColor} !important;
          }
        `;
        
        styleEl.textContent = css;
        
        console.log(`ScrollbarTab applied ${effectiveTheme} mode styles:`, {
          track: colors.trackColor,
          thumb: colors.thumbColor,
          hover: colors.thumbHoverColor
        });
      } catch (e) {
        console.error("Failed to apply scrollbar settings in ScrollbarTab", e);
      }
    } else {
      console.warn("No scrollbar settings found in localStorage");
    }
    
    // Force refresh scrollbars with a multi-step process for better browser rendering
    document.documentElement.classList.add('scrollbar-refresh');
    
    const timer1 = setTimeout(() => {
      document.documentElement.classList.add('scrollbar-refresh-done');
      document.documentElement.classList.remove('scrollbar-refresh');
      
      const timer2 = setTimeout(() => {
        document.documentElement.classList.remove('scrollbar-refresh-done');
      }, 100);
      
      return () => clearTimeout(timer2);
    }, 50);
    
    return () => {
      clearTimeout(timer1);
      // Clean up style element when component unmounts
      if (styleEl && styleEl.parentNode) {
        styleEl.parentNode.removeChild(styleEl);
      }
    };
  }, [activeTheme]);

  return <ScrollbarSettings />;
};
