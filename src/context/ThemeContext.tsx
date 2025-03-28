
import React, { createContext, useContext } from "react";

export type Theme = "light" | "dark" | "system";
export type ColorScheme = "green" | "blue" | "purple";

export interface ThemeSettings {
  theme: Theme;
  colorScheme: ColorScheme;
  autoSwitch: boolean;
  timeBasedSwitch: boolean;
  startDarkTime: string; // Time to start dark mode (format: "HH:MM")
  endDarkTime: string; // Time to end dark mode (format: "HH:MM")
}

export interface ThemeContextType {
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

export const defaultThemeSettings: ThemeSettings = {
  theme: "light",
  colorScheme: "green",
  autoSwitch: false,
  timeBasedSwitch: false,
  startDarkTime: "18:00",
  endDarkTime: "06:00"
};

export const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}
