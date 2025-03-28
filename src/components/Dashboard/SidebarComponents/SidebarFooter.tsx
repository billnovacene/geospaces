
import React from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { MoreVertical } from "lucide-react";
import { useTheme } from "@/components/ThemeProvider";
import { SidebarFooter as UISidebarFooter } from "@/components/ui/sidebar";

const APP_VERSION = import.meta.env.VITE_APP_VERSION || "1.2.4";

export function SidebarFooterContent() {
  const { theme, toggleTheme } = useTheme();
  
  return (
    <UISidebarFooter className="border-t border-sidebar-border p-4 bg-white dark:bg-gray-800">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Avatar 
            className="h-8 w-8 bg-transparent cursor-pointer transition-all duration-300 hover:scale-110 overflow-hidden relative"
            onClick={toggleTheme}
          >
            <img 
              src="/lovable-uploads/89e548e5-9c07-4eac-b530-ba4a612f8dac.png" 
              alt="Light mode logo" 
              className="absolute inset-0 h-full w-full transition-all duration-500"
              style={{ 
                opacity: theme === 'light' ? 1 : 0,
                transform: `scale(${theme === 'light' ? 1 : 0.8})` 
              }}
            />
            <img 
              src="/lovable-uploads/e8e7b15c-412f-425f-a64f-04297a69d2ca.png" 
              alt="Dark mode logo" 
              className="absolute inset-0 h-full w-full transition-all duration-500"
              style={{ 
                opacity: theme === 'dark' ? 1 : 0,
                transform: `scale(${theme === 'dark' ? 1 : 0.8})` 
              }}
            />
            <AvatarFallback>{theme === "light" ? "L" : "D"}</AvatarFallback>
          </Avatar>
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
