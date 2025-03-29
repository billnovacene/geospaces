
import React, { useEffect, useState } from "react";
import { 
  ThemeContext, 
  ThemeSettings, 
  defaultThemeSettings, 
  Theme, 
  ColorScheme 
} from "../context/ThemeContext";
import { 
  determineActiveTheme, 
  applyThemeToDOM, 
  loadSavedThemeSettings, 
  saveThemeSettings, 
  getInitialThemeSettings,
  getSystemPreferredTheme 
} from "../utils/themeUtils";

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<ThemeSettings>(defaultThemeSettings);
  const [activeTheme, setActiveTheme] = useState<"light" | "dark">("light");

  // Load saved settings or use defaults
  useEffect(() => {
    const savedSettings = loadSavedThemeSettings();
    if (savedSettings) {
      setSettings({
        ...defaultThemeSettings,
        ...savedSettings
      });
    } else {
      // Set up default settings based on system or time
      setSettings(getInitialThemeSettings());
    }
  }, []);

  // Determine active theme based on settings and apply it
  useEffect(() => {
    const theme = determineActiveTheme(settings);
    setActiveTheme(theme);
    
    // Apply theme to HTML element
    applyThemeToDOM(theme, settings.colorScheme);
    
    // Store the last active theme
    localStorage.setItem("activeTheme", theme);
    
    // Apply scrollbar styles based on theme with a direct style element for maximum specificity
    const applyScrollbarStyles = () => {
      // Get any saved scrollbar settings
      const savedScrollbarSettings = localStorage.getItem('scrollbar-settings');
      if (savedScrollbarSettings) {
        try {
          const settings = JSON.parse(savedScrollbarSettings);
          
          // Create a dedicated style element for theme-specific scrollbar styles
          let styleEl = document.getElementById('theme-scrollbar-styles');
          if (!styleEl) {
            styleEl = document.createElement('style');
            styleEl.id = 'theme-scrollbar-styles';
            document.head.appendChild(styleEl);
          }
          
          // Select the appropriate colors based on current theme
          const colors = theme === 'dark' ? settings.darkMode : settings.lightMode;
          
          // Create CSS with !important for maximum specificity
          // This ensures scrollbar colors override any other styles
          const css = `
            /* Global CSS Variables with !important */
            :root {
              --scrollbar-width: ${settings.width}px !important;
              --scrollbar-height: ${settings.width}px !important;
              --scrollbar-radius: ${settings.radius}px !important;
              --scrollbar-track-color: ${colors.trackColor} !important;
              --scrollbar-thumb-color: ${colors.thumbColor} !important;
              --scrollbar-thumb-hover-color: ${colors.thumbHoverColor} !important;
            }
            
            /* Direct style application for WebKit scrollbars */
            *::-webkit-scrollbar-track {
              background-color: ${colors.trackColor} !important;
            }
            
            *::-webkit-scrollbar-thumb {
              background-color: ${colors.thumbColor} !important;
            }
            
            *::-webkit-scrollbar-thumb:hover {
              background-color: ${colors.thumbHoverColor} !important;
            }
            
            /* Special theme-specific styles for dark mode */
            ${theme === 'dark' ? `
              /* High specificity selectors for dark mode */
              html.dark *::-webkit-scrollbar-track,
              .dark *::-webkit-scrollbar-track,
              [data-theme="dark"] *::-webkit-scrollbar-track {
                background-color: ${colors.trackColor} !important;
              }
              
              html.dark *::-webkit-scrollbar-thumb,
              .dark *::-webkit-scrollbar-thumb,
              [data-theme="dark"] *::-webkit-scrollbar-thumb {
                background-color: ${colors.thumbColor} !important;
              }
              
              html.dark *::-webkit-scrollbar-thumb:hover,
              .dark *::-webkit-scrollbar-thumb:hover,
              [data-theme="dark"] *::-webkit-scrollbar-thumb:hover {
                background-color: ${colors.thumbHoverColor} !important;
              }
              
              /* Target Radix UI scroll components directly */
              [data-radix-scroll-area-viewport]::-webkit-scrollbar-track {
                background-color: ${colors.trackColor} !important;
              }
              
              [data-radix-scroll-area-viewport]::-webkit-scrollbar-thumb {
                background-color: ${colors.thumbColor} !important;
              }
              
              [data-radix-scroll-area-viewport]::-webkit-scrollbar-thumb:hover {
                background-color: ${colors.thumbHoverColor} !important;
              }
            ` : ''}
          `;
          
          styleEl.textContent = css;
          
          // Add CSS class to document for debugging
          document.documentElement.classList.toggle('scrollbar-dark-mode', theme === 'dark');
          
          console.log(`Applied ${theme} mode scrollbar styles:`, {
            track: colors.trackColor,
            thumb: colors.thumbColor,
            hover: colors.thumbHoverColor
          });
        } catch (e) {
          console.error("Failed to apply scrollbar settings", e);
        }
      }
      
      // Force refresh scrollbars with a class toggle technique
      document.documentElement.classList.add('scrollbar-refresh');
      setTimeout(() => {
        document.documentElement.classList.add('scrollbar-refresh-done');
        document.documentElement.classList.remove('scrollbar-refresh');
        
        setTimeout(() => {
          document.documentElement.classList.remove('scrollbar-refresh-done');
        }, 100);
      }, 50);
    };
    
    applyScrollbarStyles();
  }, [settings]);

  // Listen for system theme changes
  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    
    const handleChange = () => {
      if (settings.theme === "system") {
        const newTheme = getSystemPreferredTheme();
        setActiveTheme(newTheme);
        
        // Apply theme to HTML element
        applyThemeToDOM(newTheme, settings.colorScheme);
        
        console.log("System theme changed to:", newTheme);
      }
    };
    
    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, [settings.theme]);

  // Theme control functions
  const setTheme = (theme: Theme) => {
    updateThemeSettings({ theme });
  };

  const setColorScheme = (colorScheme: ColorScheme) => {
    updateThemeSettings({ colorScheme });
  };

  const toggleTheme = () => {
    console.log("Toggle theme called, current theme:", settings.theme);
    const newTheme = settings.theme === "light" ? "dark" : "light";
    updateThemeSettings({ theme: newTheme });
    console.log(`Theme toggled from ${settings.theme} to ${newTheme}`);
  };

  const updateThemeSettings = (newSettings: Partial<ThemeSettings>) => {
    const updatedSettings = { ...settings, ...newSettings };
    setSettings(updatedSettings);
    saveThemeSettings(updatedSettings);
  };

  const contextValue = {
    theme: settings.theme,
    activeTheme,
    colorScheme: settings.colorScheme,
    autoSwitch: settings.autoSwitch,
    timeBasedSwitch: settings.timeBasedSwitch,
    startDarkTime: settings.startDarkTime,
    endDarkTime: settings.endDarkTime,
    setTheme,
    setColorScheme,
    toggleTheme,
    updateThemeSettings
  };

  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  );
}

// Re-export useTheme hook
export { useTheme } from "../context/ThemeContext";
