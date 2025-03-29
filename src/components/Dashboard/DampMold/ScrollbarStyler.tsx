
import React, { useEffect } from "react";
import { useTheme } from "@/components/ThemeProvider";

export function ScrollbarStyler() {
  const { activeTheme } = useTheme();
  
  // Add specific scrollbar styling for DampMoldView
  useEffect(() => {
    const isDarkMode = document.documentElement.classList.contains('dark');
    console.log("ScrollbarStyler: DOM dark mode:", isDarkMode, "Context theme:", activeTheme);
    
    // Force scrollbar refresh
    const refreshScrollbars = () => {
      document.documentElement.classList.add('scrollbar-refresh');
      setTimeout(() => {
        document.documentElement.classList.add('scrollbar-refresh-done');
        document.documentElement.classList.remove('scrollbar-refresh');
        setTimeout(() => {
          document.documentElement.classList.remove('scrollbar-refresh-done');
        }, 100);
      }, 50);
    };
    
    refreshScrollbars();
    
    // Apply direct styles to ensure dark mode scrollbars work in this view
    try {
      const scrollbarSettings = localStorage.getItem('scrollbar-settings');
      if (scrollbarSettings) {
        const settings = JSON.parse(scrollbarSettings);
        const themeColors = isDarkMode ? settings.darkMode : settings.lightMode;
        
        let styleEl = document.getElementById('damp-mold-view-scrollbar-styles');
        if (!styleEl) {
          styleEl = document.createElement('style');
          styleEl.id = 'damp-mold-view-scrollbar-styles';
          document.head.appendChild(styleEl);
        }
        
        // Apply ultra-specific styles
        const css = `
          /* DampMoldView specific scrollbar styles */
          .dark .space-y-6.dark\\:bg-gray-900 *::-webkit-scrollbar-track {
            background-color: ${settings.darkMode.trackColor} !important;
          }
          
          .dark .space-y-6.dark\\:bg-gray-900 *::-webkit-scrollbar-thumb {
            background-color: ${settings.darkMode.thumbColor} !important;
          }
          
          .dark .space-y-6.dark\\:bg-gray-900 *::-webkit-scrollbar-thumb:hover {
            background-color: ${settings.darkMode.thumbHoverColor} !important;
          }
        `;
        
        styleEl.textContent = css;
        
        console.log(`ScrollbarStyler applied ${isDarkMode ? 'dark' : 'light'} scrollbar styles:`, {
          track: themeColors.trackColor,
          thumb: themeColors.thumbColor,
          hover: themeColors.thumbHoverColor
        });
      }
    } catch (e) {
      console.error("Failed to apply DampMoldView scrollbar styles", e);
    }
    
    return () => {
      const styleEl = document.getElementById('damp-mold-view-scrollbar-styles');
      if (styleEl) {
        styleEl.parentNode?.removeChild(styleEl);
      }
    };
  }, [activeTheme]);
  
  return null;
}
