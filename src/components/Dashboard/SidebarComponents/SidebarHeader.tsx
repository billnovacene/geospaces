
import React from "react";
import { Button } from "@/components/ui/button";
import { Settings } from "lucide-react";
import { useTheme } from "@/components/ThemeProvider";

export function SidebarHeader() {
  const { activeTheme } = useTheme();
  
  return (
    <div className="h-16 flex items-center justify-between px-5 border-b border-sidebar-border">
      <div className="flex flex-col justify-center">
        <div className="text-xs text-sidebar-foreground/60">Projects</div>
        <h2 className="text-base font-bold text-sidebar-foreground">Zircon Dashboard</h2>
      </div>
      <Button variant="ghost" size="icon" className="text-sidebar-foreground/60 hover:text-sidebar-foreground hover:bg-sidebar-accent/10">
        <Settings className="h-5 w-5" />
      </Button>
    </div>
  );
}
