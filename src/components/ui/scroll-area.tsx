
import * as React from "react"
import * as ScrollAreaPrimitive from "@radix-ui/react-scroll-area"

import { cn } from "@/lib/utils"
import { useTheme } from "@/components/ThemeProvider"

const ScrollArea = React.forwardRef<
  React.ElementRef<typeof ScrollAreaPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof ScrollAreaPrimitive.Root>
>(({ className, children, ...props }, ref) => {
  const { activeTheme } = useTheme();

  // Force refresh when theme changes
  React.useEffect(() => {
    // Get scrollbar settings from localStorage
    try {
      const savedScrollbarSettings = localStorage.getItem('scrollbar-settings');
      if (savedScrollbarSettings) {
        const settings = JSON.parse(savedScrollbarSettings);
        
        // Apply scrollbar styles based on current theme
        if (activeTheme === 'dark') {
          document.documentElement.style.setProperty('--scrollbar-track-color', settings.darkMode.trackColor);
          document.documentElement.style.setProperty('--scrollbar-thumb-color', settings.darkMode.thumbColor);
          document.documentElement.style.setProperty('--scrollbar-thumb-hover-color', settings.darkMode.thumbHoverColor);
        } else {
          document.documentElement.style.setProperty('--scrollbar-track-color', settings.lightMode.trackColor);
          document.documentElement.style.setProperty('--scrollbar-thumb-color', settings.lightMode.thumbColor);
          document.documentElement.style.setProperty('--scrollbar-thumb-hover-color', settings.lightMode.thumbHoverColor);
        }
        
        // Apply general scrollbar properties
        document.documentElement.style.setProperty('--scrollbar-width', `${settings.width}px`);
        document.documentElement.style.setProperty('--scrollbar-height', `${settings.width}px`);
        document.documentElement.style.setProperty('--scrollbar-radius', `${settings.radius}px`);
      }
    } catch (e) {
      console.error("Failed to apply scrollbar settings in ScrollArea", e);
    }
    
    // Force refresh scrollbar styles
    document.documentElement.classList.add('scrollbar-refresh');
    setTimeout(() => {
      document.documentElement.classList.remove('scrollbar-refresh');
    }, 50);
  }, [activeTheme]);

  return (
    <ScrollAreaPrimitive.Root
      ref={ref}
      className={cn("relative overflow-hidden", className)}
      {...props}
    >
      <ScrollAreaPrimitive.Viewport 
        className="h-full w-full rounded-[inherit]"
        style={{
          // Override any hardcoded scrollbar styling that might be applied
          scrollbarWidth: 'thin',
          scrollbarColor: 'var(--scrollbar-thumb-color) var(--scrollbar-track-color)',
        }}
      >
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
        className
      )}
      {...props}
    >
      <ScrollAreaPrimitive.ScrollAreaThumb 
        className={cn(
          "relative flex-1 rounded-full",
          // Use CSS variables for colors to ensure theme consistency
          "bg-[var(--scrollbar-thumb-color)] hover:bg-[var(--scrollbar-thumb-hover-color)]"
        )} 
      />
    </ScrollAreaPrimitive.ScrollAreaScrollbar>
  );
});
ScrollBar.displayName = ScrollAreaPrimitive.ScrollAreaScrollbar.displayName

export { ScrollArea, ScrollBar }
