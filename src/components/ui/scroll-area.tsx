
import * as React from "react"
import * as ScrollAreaPrimitive from "@radix-ui/react-scroll-area"
import { cn } from "@/lib/utils"
import { useTheme } from "@/components/ThemeProvider"

const ScrollArea = React.forwardRef<
  React.ElementRef<typeof ScrollAreaPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof ScrollAreaPrimitive.Root>
>(({ className, children, ...props }, ref) => {
  const { activeTheme } = useTheme();

  // Force refresh scrollbar styles when theme changes
  React.useEffect(() => {
    try {
      const savedScrollbarSettings = localStorage.getItem('scrollbar-settings');
      if (savedScrollbarSettings) {
        const settings = JSON.parse(savedScrollbarSettings);
        
        // Apply scrollbar styles based on current theme with !important for higher specificity
        const currentMode = activeTheme === 'dark' ? 'darkMode' : 'lightMode';
        const colors = settings[currentMode];
        
        document.documentElement.style.setProperty('--scrollbar-track-color', `${colors.trackColor} !important`);
        document.documentElement.style.setProperty('--scrollbar-thumb-color', `${colors.thumbColor} !important`);
        document.documentElement.style.setProperty('--scrollbar-thumb-hover-color', `${colors.thumbHoverColor} !important`);
        
        // Apply size and radius settings
        document.documentElement.style.setProperty('--scrollbar-width', `${settings.width}px !important`);
        document.documentElement.style.setProperty('--scrollbar-height', `${settings.width}px !important`);
        document.documentElement.style.setProperty('--scrollbar-radius', `${settings.radius}px !important`);
      }
    } catch (e) {
      console.error("Failed to apply scrollbar settings in ScrollArea", e);
    }
    
    // Improved scrollbar refresh mechanism
    document.documentElement.classList.add('scrollbar-refresh');
    setTimeout(() => {
      document.documentElement.classList.add('scrollbar-refresh-done');
      document.documentElement.classList.remove('scrollbar-refresh');
      
      // Remove the refresh-done class after styles are fully applied
      setTimeout(() => {
        document.documentElement.classList.remove('scrollbar-refresh-done');
      }, 100);
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
          // Apply scrollbar styles directly to ensure they take effect
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
          // Use CSS variables for colors with !important to ensure theme consistency
          "bg-[var(--scrollbar-thumb-color)] hover:bg-[var(--scrollbar-thumb-hover-color)]"
        )} 
      />
    </ScrollAreaPrimitive.ScrollAreaScrollbar>
  );
});
ScrollBar.displayName = ScrollAreaPrimitive.ScrollAreaScrollbar.displayName

export { ScrollArea, ScrollBar }
