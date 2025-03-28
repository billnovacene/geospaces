
export interface NavigationSettings {
  background: string;
  textColor: string;
  hoverBackground: string;
  hoverTextColor: string;
  activeBackground: string;
  activeTextColor: string;
  fontSize: string;
  fontWeight: string;
  borderWidth: string;
  borderColor: string;
  borderRadius: string;
  sidebarBackground: string;
}

export const defaultSettings: NavigationSettings = {
  background: "bg-background",
  textColor: "text-foreground",
  hoverBackground: "hover:bg-accent/10",
  hoverTextColor: "hover:text-accent-foreground",
  activeBackground: "bg-accent",
  activeTextColor: "text-accent-foreground",
  fontSize: "text-sm",
  fontWeight: "font-medium",
  borderWidth: "0px",
  borderColor: "transparent",
  borderRadius: "rounded-none",
  sidebarBackground: "bg-sidebar"
};
