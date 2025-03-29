
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
      const savedScrollbarSettings = localStorage.getItem('scrollbar-settings');
      if (savedScrollbarSettings) {
        const settings = JSON.parse(savedScrollbarSettings);
        
        // Apply current theme-specific colors with !important for higher specificity
        const themeColors = activeTheme === 'dark' ? settings.darkMode : settings.lightMode;
        
        // Create a style element specifically for this component's theme changes
        let styleEl = document.getElementById('scroll-area-theme-styles');
        if (!styleEl) {
          styleEl = document.createElement('style');
          styleEl.id = 'scroll-area-theme-styles';
          document.head.appendChild(styleEl);
        }
        
        // Create CSS that directly targets Radix UI scrollbar elements with very high specificity
        const css = `
          /* Direct style for ScrollArea elements */
          [data-radix-scroll-area-viewport]::-webkit-scrollbar-track {
            background-color: ${themeColors.trackColor} !important;
          }
          
          [data-radix-scroll-area-viewport]::-webkit-scrollbar-thumb {
            background-color: ${themeColors.thumbColor} !important;
          }
          
          [data-radix-scroll-area-viewport]::-webkit-scrollbar-thumb:hover {
            background-color: ${themeColors.thumbHoverColor} !important;
          }
          
          /* General scrollbar styles for dark mode */
          ${activeTheme === 'dark' ? `
            *::-webkit-scrollbar-track {
              background-color: ${themeColors.trackColor} !important;
            }
            
            *::-webkit-scrollbar-thumb {
              background-color: ${themeColors.thumbColor} !important;
            }
            
            *::-webkit-scrollbar-thumb:hover {
              background-color: ${themeColors.thumbHoverColor} !important;
            }
          ` : ''}
        `;
        
        styleEl.textContent = css;
      }
    } catch (e) {
      console.error("Failed to apply scrollbar settings in ScrollArea", e);
    }
    
    // Force refresh scrollbars to apply new styles
    document.documentElement.classList.add('scrollbar-refresh');
    setTimeout(() => {
      document.documentElement.classList.remove('scrollbar-refresh');
      document.documentElement.classList.add('scrollbar-refresh-done');
      
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
          // Use CSS variables with !important to ensure theme consistency
          "bg-[var(--scrollbar-thumb-color)] hover:bg-[var(--scrollbar-thumb-hover-color)]"
        )} 
      />
    </ScrollAreaPrimitive.ScrollAreaScrollbar>
  );
});
ScrollBar.displayName = ScrollAreaPrimitive.ScrollAreaScrollbar.displayName

export { ScrollArea, ScrollBar }
