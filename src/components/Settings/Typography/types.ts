
export interface TypographySettings {
  fontFamily: string;
  headings: {
    h1: { size: string; weight: string; tracking: string; };
    h2: { size: string; weight: string; tracking: string; };
    h3: { size: string; weight: string; tracking: string; };
    h4: { size: string; weight: string; tracking: string; };
  };
  body: {
    large: { size: string; weight: string; color: string; };
    normal: { size: string; weight: string; color: string; };
    small: { size: string; weight: string; color: string; };
  };
  navigation: {
    item: { size: string; weight: string; color: string; };
    active: { size: string; weight: string; color: string; };
  }
}

export const defaultSettings: TypographySettings = {
  fontFamily: "'Inter', sans-serif",
  headings: {
    h1: { size: "text-3xl", weight: "font-medium", tracking: "tracking-tight" },
    h2: { size: "text-2xl", weight: "font-medium", tracking: "tracking-tight" },
    h3: { size: "text-xl", weight: "font-medium", tracking: "" },
    h4: { size: "text-lg", weight: "font-medium", tracking: "" },
  },
  body: {
    large: { size: "text-base", weight: "font-normal", color: "text-foreground" },
    normal: { size: "text-sm", weight: "font-normal", color: "text-foreground" },
    small: { size: "text-xs", weight: "font-normal", color: "text-muted-foreground" },
  },
  navigation: {
    item: { size: "text-sm", weight: "font-medium", color: "text-foreground" },
    active: { size: "text-sm", weight: "font-medium", color: "text-accent-foreground" }
  }
};
