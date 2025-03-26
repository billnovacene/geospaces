
export interface TypographySettings {
  headings: {
    h1: { size: string; weight: string; tracking: string; };
    h2: { size: string; weight: string; tracking: string; };
    h3: { size: string; weight: string; tracking: string; };
    h4: { size: string; weight: string; tracking: string; };
  };
  body: {
    large: { size: string; };
    normal: { size: string; };
    small: { size: string; };
  }
}

export const defaultSettings: TypographySettings = {
  headings: {
    h1: { size: "text-3xl", weight: "font-medium", tracking: "tracking-tight" },
    h2: { size: "text-2xl", weight: "font-medium", tracking: "tracking-tight" },
    h3: { size: "text-xl", weight: "font-medium", tracking: "" },
    h4: { size: "text-lg", weight: "font-medium", tracking: "" },
  },
  body: {
    large: { size: "text-base" },
    normal: { size: "text-sm" },
    small: { size: "text-xs" },
  }
};
