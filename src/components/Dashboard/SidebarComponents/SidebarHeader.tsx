
import React from "react";
import { Button } from "@/components/ui/button";
import { Settings } from "lucide-react";

export function SidebarHeader() {
  return (
    <div className="h-16 flex items-center justify-between border-b border-sidebar-border px-5">
      <div className="flex flex-col justify-center">
        <div className="text-xs text-muted-foreground">Projects</div>
        <h2 className="text-base font-bold">Zircon</h2>
      </div>
      <Button variant="ghost" size="icon" className="text-muted-foreground">
        <Settings className="h-5 w-5" />
      </Button>
    </div>
  );
}
