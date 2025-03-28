
import { Theme, ThemeSettings } from "../context/ThemeContext";

// Determine if the current time is within dark mode hours
export function isWithinDarkModeHours(startDarkTime: string, endDarkTime: string): boolean {
  const now = new Date();
  const currentHour = now.getHours();
  const currentMinute = now.getMinutes();
  const currentTime = `${currentHour.toString().padStart(2, '0')}:${currentMinute.toString().padStart(2, '0')}`;
  
  const [startHour, startMinute] = startDarkTime.split(':').map(Number);
  const [endHour, endMinute] = endDarkTime.split(':').map(Number);
  
  const startTime = startHour * 60 + startMinute;
  const endTime = endHour * 60 + endMinute;
  const currentTimeMinutes = currentHour * 60 + currentMinute;
  
  if (endTime < startTime) {
    // Spans midnight (e.g., 22:00 to 06:00)
    return currentTimeMinutes >= startTime || currentTimeMinutes < endTime;
  } else {
    // Same day (e.g., 18:00 to 22:00)
    return currentTimeMinutes >= startTime && currentTimeMinutes < endTime;
  }
}

// Get system preferred theme
export function getSystemPreferredTheme(): "light" | "dark" {
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

// Determine active theme based on settings
export function determineActiveTheme(settings: ThemeSettings): "light" | "dark" {
  let theme: "light" | "dark" = settings.theme === "light" ? "light" : "dark";
  
  // Handle system preference
  if (settings.theme === "system") {
    theme = getSystemPreferredTheme();
  }
  
  // Handle time-based switching if enabled
  if (settings.timeBasedSwitch) {
    if (isWithinDarkModeHours(settings.startDarkTime, settings.endDarkTime)) {
      theme = "dark";
    } else {
      theme = "light";
    }
  }
  
  return theme;
}

// Apply theme to HTML element
export function applyThemeToDOM(theme: "light" | "dark", colorScheme: string): void {
  if (theme === "dark") {
    document.documentElement.classList.add("dark");
    console.log("Applied dark theme to HTML");
  } else {
    document.documentElement.classList.remove("dark");
    console.log("Removed dark theme from HTML");
  }
  
  // Apply color scheme
  document.documentElement.setAttribute("data-color-scheme", colorScheme);
  
  // Log theme application
  console.log("Theme applied:", theme, "Color scheme:", colorScheme);
}

// Load saved theme settings from localStorage
export function loadSavedThemeSettings(): ThemeSettings | null {
  const savedSettings = localStorage.getItem("themeSettings");
  if (savedSettings) {
    try {
      return JSON.parse(savedSettings);
    } catch (error) {
      console.error("Failed to parse theme settings:", error);
      return null;
    }
  }
  return null;
}

// Save theme settings to localStorage
export function saveThemeSettings(settings: ThemeSettings): void {
  localStorage.setItem("themeSettings", JSON.stringify(settings));
}

// Get initial theme settings
export function getInitialThemeSettings(): ThemeSettings {
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  const currentHour = new Date().getHours();
  const isNightTime = currentHour >= 18 || currentHour < 6;
  
  // Set up default settings based on system or time
  return {
    theme: prefersDark ? "system" : (isNightTime ? "dark" : "light"),
    colorScheme: "green",
    autoSwitch: isNightTime,
    timeBasedSwitch: false,
    startDarkTime: "18:00",
    endDarkTime: "06:00"
  };
}
