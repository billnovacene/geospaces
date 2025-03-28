
import React, { useEffect } from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { MoreVertical } from "lucide-react";
import { useTheme } from "@/components/ThemeProvider";
import { SidebarFooter as UISidebarFooter } from "@/components/ui/sidebar";

const APP_VERSION = import.meta.env.VITE_APP_VERSION || "1.2.4";

// Image paths for theme toggle
const LIGHT_MODE_ICON = "/lovable-uploads/0209629a-5277-4431-afc9-8dbfbe6a414e.png";
const DARK_MODE_ICON = "/lovable-uploads/74f0f7ce-a0ee-4ac8-b105-28031f319b00.png";

export function SidebarFooterContent() {
  const { theme, activeTheme, toggleTheme } = useTheme();

  // Add logging to help diagnose theme state
  useEffect(() => {
    console.log("Current theme in SidebarFooter:", theme);
    console.log("Active theme in SidebarFooter:", activeTheme);
    console.log("HTML class contains 'dark':", document.documentElement.classList.contains("dark"));
  }, [theme, activeTheme]);

  return (
    <UISidebarFooter className="border-t border-sidebar-border p-4 bg-white dark:bg-gray-800">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div 
            className="theme-toggle h-8 w-8 rounded-full cursor-pointer flex items-center justify-center overflow-hidden"
            onClick={toggleTheme}
            title={`Switch to ${activeTheme === 'dark' ? 'light' : 'dark'} mode`}
          >
            <img 
              src={activeTheme === 'dark' ? LIGHT_MODE_ICON : DARK_MODE_ICON} 
              alt={`Switch to ${activeTheme === 'dark' ? 'light' : 'dark'} mode`}
              className="h-full w-full object-cover transition-transform hover:scale-110"
            />
          </div>
          <div>
            <div className="font-semibold text-sm dark:text-white">Novacene</div>
            <div className="flex flex-col">
              <span className="text-xs font-medium text-sidebar-primary font-['Signal'] tracking-tighter dark:text-white/80">GEOSPACES</span>
              <span className="text-xs font-mono dark:text-white/70">{APP_VERSION}</span>
            </div>
          </div>
        </div>
        <Button variant="ghost" size="icon" className="text-muted-foreground dark:text-white/70">
          <MoreVertical className="h-5 w-5" />
        </Button>
      </div>
    </UISidebarFooter>
  );
}
