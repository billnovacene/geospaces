
import React from "react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { MoreVertical } from "lucide-react";
import { useTheme } from "@/components/ThemeProvider";
import { SidebarFooter as UISidebarFooter } from "@/components/ui/sidebar";

// Import process.env to get the build version
const APP_VERSION = import.meta.env.VITE_APP_VERSION || "1.2.4"; // Fallback to hardcoded version if env var not set

export function SidebarFooterContent() {
  const { theme, toggleTheme } = useTheme();
  
  return (
    <UISidebarFooter className="border-t border-sidebar-border p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Avatar 
            className="h-8 w-8 bg-transparent cursor-pointer transition-transform hover:scale-110 duration-300 overflow-hidden"
            onClick={toggleTheme}
          >
            <div className="h-16 relative transition-all duration-300" style={{ transform: theme === 'dark' ? 'translateY(-50%)' : 'none' }}>
              <img 
                src="/lovable-uploads/e04538fb-8a3f-43c4-ba17-b41d6191317c.png" 
                alt="Light logo" 
                className="h-8 w-8 absolute top-0"
              />
              <img 
                src="/lovable-uploads/c7617745-f793-43e6-b68e-1739f76d0a94.png" 
                alt="Dark logo" 
                className="h-8 w-8 absolute top-8"
              />
            </div>
            <AvatarFallback>{theme === "light" ? "L" : "D"}</AvatarFallback>
          </Avatar>
          <div>
            <div className="font-semibold text-sm">Novacene</div>
            <div className="flex flex-col">
              <span className="text-xs font-medium text-sidebar-primary font-['Signal'] tracking-tighter">GEOSPACES</span>
              <span className="text-xs font-mono">{APP_VERSION}</span>
            </div>
          </div>
        </div>
        <Button variant="ghost" size="icon" className="text-muted-foreground">
          <MoreVertical className="h-5 w-5" />
        </Button>
      </div>
    </UISidebarFooter>
  );
}
