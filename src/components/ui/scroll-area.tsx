
import * as React from "react"
import * as ScrollAreaPrimitive from "@radix-ui/react-scroll-area"
import { cn } from "@/lib/utils"
import { useTheme } from "@/components/ThemeProvider"

const ScrollArea = React.forwardRef<
  React.ElementRef<typeof ScrollAreaPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof ScrollAreaPrimitive.Root>
>(({ className, children, ...props }, ref) => {
  const { activeTheme } = useTheme();

  // Apply dark mode scrollbar styles when theme changes
  React.useEffect(() => {
    try {
      // Check actual DOM state for dark mode
      const isDarkMode = document.documentElement.classList.contains('dark');
      console.log("ScrollArea: DOM dark mode:", isDarkMode, "Context theme:", activeTheme);
      
      // Use DOM detection primarily, context as fallback
      const effectiveTheme = isDarkMode ? 'dark' : activeTheme;
      
      // Get saved scrollbar settings or attempt to initialize default ones
      const savedScrollbarSettings = localStorage.getItem('scrollbar-settings');
      if (!savedScrollbarSettings) {
        console.warn("ScrollArea: No scrollbar settings, initializing defaults");
        // Create default settings if none exist
        const defaultSettings = {
          width: 12,
          radius: 9999,
          lightMode: {
            trackColor: "#f3f4f6", 
            thumbColor: "#d1d5db", 
            thumbHoverColor: "#9ca3af",
          },
          darkMode: {
            trackColor: "#1f2937", 
            thumbColor: "#4b5563", 
            thumbHoverColor: "#6b7280",
          }
        };
        localStorage.setItem('scrollbar-settings', JSON.stringify(defaultSettings));
      }
      
      const settings = savedScrollbarSettings ? JSON.parse(savedScrollbarSettings) : null;
      if (settings) {
        // Apply current theme-specific colors with !important for higher specificity
        const themeColors = effectiveTheme === 'dark' ? settings.darkMode : settings.lightMode;
        
        // Create a style element specifically for ScrollArea components
        let styleEl = document.getElementById('scroll-area-theme-styles');
        if (!styleEl) {
          styleEl = document.createElement('style');
          styleEl.id = 'scroll-area-theme-styles';
          document.head.appendChild(styleEl);
        }
        
        // Create CSS that directly targets Radix UI scrollbar elements with very high specificity
        const css = `
          /* Direct style for ScrollArea elements with maximum specificity */
          [data-radix-scroll-area-viewport]::-webkit-scrollbar-track {
            background-color: ${themeColors.trackColor} !important;
          }
          
          [data-radix-scroll-area-viewport]::-webkit-scrollbar-thumb {
            background-color: ${themeColors.thumbColor} !important;
          }
          
          [data-radix-scroll-area-viewport]::-webkit-scrollbar-thumb:hover {
            background-color: ${themeColors.thumbHoverColor} !important;
          }
          
          /* Size and radius for ScrollArea scrollbars */
          [data-radix-scroll-area-viewport]::-webkit-scrollbar {
            width: ${settings.width}px !important;
            height: ${settings.width}px !important;
          }
          
          [data-radix-scroll-area-viewport]::-webkit-scrollbar-thumb {
            border-radius: ${settings.radius}px !important;
          }
          
          /* Firefox scrollbar style for ScrollArea */
          [data-radix-scroll-area-viewport] {
            scrollbar-color: ${themeColors.thumbColor} ${themeColors.trackColor} !important;
            scrollbar-width: thin !important;
          }
        `;
        
        styleEl.textContent = css;
        
        console.log(`ScrollArea applied ${effectiveTheme} scrollbar colors:`, {
          track: themeColors.trackColor,
          thumb: themeColors.thumbColor,
          hover: themeColors.thumbHoverColor
        });
      }
    } catch (e) {
      console.error("Failed to apply scrollbar settings in ScrollArea", e);
    }
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
          // Use CSS variables with !important to ensure theme consistency
          "bg-[var(--scrollbar-thumb-color)] hover:bg-[var(--scrollbar-thumb-hover-color)]"
        )} 
      />
    </ScrollAreaPrimitive.ScrollAreaScrollbar>
  );
});
ScrollBar.displayName = ScrollAreaPrimitive.ScrollAreaScrollbar.displayName

export { ScrollArea, ScrollBar }
