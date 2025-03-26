
export interface TableSettings {
  headerBackground: string;
  headerTextColor: string;
  headerFontSize: string;
  headerFontWeight: string;
  rowBackground: string;
  rowTextColor: string;
  rowFontSize: string;
  rowFontWeight: string;
  borderColor: string;
  hoverBackground: string;
}

export const defaultSettings: TableSettings = {
  headerBackground: "bg-muted",
  headerTextColor: "text-muted-foreground",
  headerFontSize: "text-sm",
  headerFontWeight: "font-medium",
  rowBackground: "bg-card",
  rowTextColor: "text-card-foreground",
  rowFontSize: "text-sm",
  rowFontWeight: "font-normal",
  borderColor: "border-border",
  hoverBackground: "hover:bg-muted/50"
};
