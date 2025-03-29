
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

  // Determine active theme based on settings
  useEffect(() => {
    const theme = determineActiveTheme(settings);
    setActiveTheme(theme);
    
    // Apply theme to HTML element
    applyThemeToDOM(theme, settings.colorScheme);
    
    // Store the last active theme
    localStorage.setItem("activeTheme", theme);
    
    // Improved scrollbar style application
    const applyScrollbarStyles = () => {
      // Get any saved scrollbar settings
      const savedScrollbarSettings = localStorage.getItem('scrollbar-settings');
      if (savedScrollbarSettings) {
        try {
          const settings = JSON.parse(savedScrollbarSettings);
          
          // Clear any inline styles first
          document.documentElement.style.removeProperty('--scrollbar-track-color');
          document.documentElement.style.removeProperty('--scrollbar-thumb-color');
          document.documentElement.style.removeProperty('--scrollbar-thumb-hover-color');
          
          // Apply the appropriate theme colors with !important for higher specificity
          if (theme === 'dark') {
            document.documentElement.style.setProperty('--scrollbar-track-color', `${settings.darkMode.trackColor} !important`);
            document.documentElement.style.setProperty('--scrollbar-thumb-color', `${settings.darkMode.thumbColor} !important`);
            document.documentElement.style.setProperty('--scrollbar-thumb-hover-color', `${settings.darkMode.thumbHoverColor} !important`);
          } else {
            document.documentElement.style.setProperty('--scrollbar-track-color', `${settings.lightMode.trackColor} !important`);
            document.documentElement.style.setProperty('--scrollbar-thumb-color', `${settings.lightMode.thumbColor} !important`);
            document.documentElement.style.setProperty('--scrollbar-thumb-hover-color', `${settings.lightMode.thumbHoverColor} !important`);
          }
          
          // Apply size and radius settings
          document.documentElement.style.setProperty('--scrollbar-width', `${settings.width}px`);
          document.documentElement.style.setProperty('--scrollbar-height', `${settings.width}px`);
          document.documentElement.style.setProperty('--scrollbar-radius', `${settings.radius}px`);
        } catch (e) {
          console.error("Failed to parse scrollbar settings", e);
        }
      }
      
      // Improved scrollbar refresh mechanism
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

  // Set theme
  const setTheme = (theme: Theme) => {
    updateThemeSettings({ theme });
  };

  // Set color scheme
  const setColorScheme = (colorScheme: ColorScheme) => {
    updateThemeSettings({ colorScheme });
  };

  // Toggle between light and dark
  const toggleTheme = () => {
    console.log("Toggle theme called, current theme:", settings.theme);
    const newTheme = settings.theme === "light" ? "dark" : "light";
    updateThemeSettings({ theme: newTheme });
    console.log(`Theme toggled from ${settings.theme} to ${newTheme}`);
  };

  // Update theme settings
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
