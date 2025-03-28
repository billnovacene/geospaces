
import React, { createContext, useContext, useEffect, useState } from "react";

type Theme = "light" | "dark" | "system";
type ColorScheme = "green" | "blue" | "purple";

interface ThemeSettings {
  theme: Theme;
  colorScheme: ColorScheme;
  autoSwitch: boolean;
  timeBasedSwitch: boolean;
  startDarkTime: string; // Time to start dark mode (format: "HH:MM")
  endDarkTime: string; // Time to end dark mode (format: "HH:MM")
}

interface ThemeContextType {
  theme: Theme;
  activeTheme: "light" | "dark"; // The actual applied theme (resolves system)
  colorScheme: ColorScheme;
  autoSwitch: boolean;
  timeBasedSwitch: boolean;
  startDarkTime: string;
  endDarkTime: string;
  setTheme: (theme: Theme) => void;
  setColorScheme: (colorScheme: ColorScheme) => void;
  toggleTheme: () => void;
  updateThemeSettings: (settings: Partial<ThemeSettings>) => void;
}

const defaultThemeSettings: ThemeSettings = {
  theme: "light",
  colorScheme: "green",
  autoSwitch: false,
  timeBasedSwitch: false,
  startDarkTime: "18:00",
  endDarkTime: "06:00"
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<ThemeSettings>(defaultThemeSettings);
  const [activeTheme, setActiveTheme] = useState<"light" | "dark">("light");

  // Load saved settings or use defaults
  useEffect(() => {
    const savedSettings = localStorage.getItem("themeSettings");
    if (savedSettings) {
      try {
        const parsed = JSON.parse(savedSettings);
        setSettings({
          ...defaultThemeSettings,
          ...parsed
        });
      } catch (error) {
        console.error("Failed to parse theme settings:", error);
      }
    } else {
      // Check if we should use system preference
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      const currentHour = new Date().getHours();
      const isNightTime = currentHour >= 18 || currentHour < 6;
      
      // Set up default settings based on system or time
      const initialTheme = prefersDark ? "system" : (isNightTime ? "dark" : "light");
      setSettings({
        ...defaultThemeSettings,
        theme: initialTheme,
        autoSwitch: isNightTime
      });
    }
  }, []);

  // Determine active theme based on settings
  useEffect(() => {
    let theme: "light" | "dark" = settings.theme === "light" ? "light" : "dark";
    
    // Handle system preference
    if (settings.theme === "system") {
      theme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    }
    
    // Handle time-based switching if enabled
    if (settings.timeBasedSwitch) {
      const now = new Date();
      const currentHour = now.getHours();
      const currentMinute = now.getMinutes();
      const currentTime = `${currentHour.toString().padStart(2, '0')}:${currentMinute.toString().padStart(2, '0')}`;
      
      const [startHour, startMinute] = settings.startDarkTime.split(':').map(Number);
      const [endHour, endMinute] = settings.endDarkTime.split(':').map(Number);
      
      const startTime = startHour * 60 + startMinute;
      const endTime = endHour * 60 + endMinute;
      const currentTimeMinutes = currentHour * 60 + currentMinute;
      
      // Check if current time is within dark mode hours
      // For example, if dark mode is 10:00 PM to 6:00 AM
      if (endTime < startTime) {
        // Spans midnight (e.g., 22:00 to 06:00)
        if (currentTimeMinutes >= startTime || currentTimeMinutes < endTime) {
          theme = "dark";
        } else {
          theme = "light";
        }
      } else {
        // Same day (e.g., 18:00 to 22:00)
        if (currentTimeMinutes >= startTime && currentTimeMinutes < endTime) {
          theme = "dark";
        } else {
          theme = "light";
        }
      }
    }
    
    setActiveTheme(theme);
    applyTheme(theme, settings.colorScheme);
    
    // Add logging to help debug
    console.log("ThemeProvider: activeTheme set to", theme);
    
  }, [settings]);

  // Listen for system theme changes
  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    
    const handleChange = () => {
      if (settings.theme === "system") {
        const newTheme = mediaQuery.matches ? "dark" : "light";
        setActiveTheme(newTheme);
        applyTheme(newTheme, settings.colorScheme);
        console.log("System theme changed to:", newTheme);
      }
    };
    
    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, [settings.theme, settings.colorScheme]);

  // Apply theme to DOM
  const applyTheme = (theme: "light" | "dark", colorScheme: ColorScheme) => {
    // Force document class update for reliability
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    
    // Apply color scheme
    document.documentElement.setAttribute("data-color-scheme", colorScheme);
    
    // Store the last active theme
    localStorage.setItem("activeTheme", theme);
    
    // Log theme application
    console.log("Theme applied:", theme, "Color scheme:", colorScheme);
  };

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
    const newTheme = settings.theme === "light" ? "dark" : "light";
    updateThemeSettings({ theme: newTheme });
    console.log(`Theme toggled from ${settings.theme} to ${newTheme}`);
  };

  // Update theme settings
  const updateThemeSettings = (newSettings: Partial<ThemeSettings>) => {
    const updatedSettings = { ...settings, ...newSettings };
    setSettings(updatedSettings);
    localStorage.setItem("themeSettings", JSON.stringify(updatedSettings));
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

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}
