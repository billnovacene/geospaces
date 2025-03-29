
import * as React from "react"
import * as ScrollAreaPrimitive from "@radix-ui/react-scroll-area"

import { cn } from "@/lib/utils"
import { useTheme } from "@/components/ThemeProvider"

const ScrollArea = React.forwardRef<
  React.ElementRef<typeof ScrollAreaPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof ScrollAreaPrimitive.Root>
>(({ className, children, ...props }, ref) => {
  const { activeTheme } = useTheme();

  // Force refresh when theme changes - improved to be more reliable
  React.useEffect(() => {
    // More reliable way to force refresh scrollbar styles
    const scrollbarRefresh = () => {
      // First add refresh class
      document.documentElement.classList.add('scrollbar-refresh');
      
      // Apply correct theme-based styles
      try {
        const savedScrollbarSettings = localStorage.getItem('scrollbar-settings');
        if (savedScrollbarSettings) {
          const settings = JSON.parse(savedScrollbarSettings);
          
          if (activeTheme === 'dark') {
            document.documentElement.style.setProperty('--scrollbar-track-color', `${settings.darkMode.trackColor} !important`);
            document.documentElement.style.setProperty('--scrollbar-thumb-color', `${settings.darkMode.thumbColor} !important`);
            document.documentElement.style.setProperty('--scrollbar-thumb-hover-color', `${settings.darkMode.thumbHoverColor} !important`);
          } else {
            document.documentElement.style.setProperty('--scrollbar-track-color', `${settings.lightMode.trackColor} !important`);
            document.documentElement.style.setProperty('--scrollbar-thumb-color', `${settings.lightMode.thumbColor} !important`);
            document.documentElement.style.setProperty('--scrollbar-thumb-hover-color', `${settings.lightMode.thumbHoverColor} !important`);
          }
        }
      } catch (e) {
        console.error("Failed to apply scrollbar settings in ScrollArea", e);
      }
      
      // Then two-step removal process for better browser rendering
      setTimeout(() => {
        document.documentElement.classList.add('scrollbar-refresh-done');
        document.documentElement.classList.remove('scrollbar-refresh');
        
        setTimeout(() => {
          document.documentElement.classList.remove('scrollbar-refresh-done');
        }, 100);
      }, 50);
    };
    
    scrollbarRefresh();
  }, [activeTheme]);

  return (
    <ScrollAreaPrimitive.Root
      ref={ref}
      className={cn("relative overflow-hidden", className)}
      {...props}
    >
      <ScrollAreaPrimitive.Viewport className="h-full w-full rounded-[inherit]">
        {children}
      </ScrollAreaPrimitive.Viewport>
      <ScrollBar />
      <ScrollAreaPrimitive.Corner />
    </ScrollAreaPrimitive.Root>
  );
});
ScrollArea.displayName = ScrollAreaPrimitive.Root.displayName

const ScrollBar = React.forwardRef<
  React.ElementRef<typeof ScrollAreaPrimitive.ScrollAreaScrollbar>,
  React.ComponentPropsWithoutRef<typeof ScrollAreaPrimitive.ScrollAreaScrollbar>
>(({ className, orientation = "vertical", ...props }, ref) => {
  const { activeTheme } = useTheme();

  return (
    <ScrollAreaPrimitive.ScrollAreaScrollbar
      ref={ref}
      orientation={orientation}
      className={cn(
        "flex touch-none select-none transition-colors",
        orientation === "vertical" &&
          "h-full w-2.5 border-l border-l-transparent p-[1px]",
        orientation === "horizontal" &&
          "h-2.5 flex-col border-t border-t-transparent p-[1px]",
        `theme-${activeTheme}-scrollbar`, // Add a theme-specific class
        activeTheme === "dark" ? "dark-scrollbar" : "light-scrollbar", // More specific theme class
        className
      )}
      {...props}
    >
      <ScrollAreaPrimitive.ScrollAreaThumb 
        className={cn(
          "relative flex-1 rounded-full",
          "bg-[var(--scrollbar-thumb-color)] hover:bg-[var(--scrollbar-thumb-hover-color)]",
          // Add more specific styling for better theme compatibility
          activeTheme === "dark" 
            ? "dark-scrollbar-thumb bg-gray-600 hover:bg-gray-500" 
            : "light-scrollbar-thumb bg-gray-300 hover:bg-gray-400"
        )} 
      />
    </ScrollAreaPrimitive.ScrollAreaScrollbar>
  );
});
ScrollBar.displayName = ScrollAreaPrimitive.ScrollAreaScrollbar.displayName

export { ScrollArea, ScrollBar }
