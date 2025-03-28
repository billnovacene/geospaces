
import React from "react";
import { Label } from "@/components/ui/label";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";

// Expanded font options with additional popular fonts
const fontOptions = [
  { value: "'Inter', sans-serif", label: "Inter" },
  { value: "'Roboto', sans-serif", label: "Roboto" },
  { value: "'Open Sans', sans-serif", label: "Open Sans" },
  { value: "'Montserrat', sans-serif", label: "Montserrat" },
  { value: "'Playfair Display', serif", label: "Playfair Display" },
  { value: "'Poppins', sans-serif", label: "Poppins" },
  { value: "'Lato', sans-serif", label: "Lato" },
  { value: "'Source Sans Pro', sans-serif", label: "Source Sans Pro" },
  { value: "'Raleway', sans-serif", label: "Raleway" },
  { value: "'Work Sans', sans-serif", label: "Work Sans" },
  { value: "'Signal', sans-serif", label: "Signal" },
  // Additional modern fonts
  { value: "'Nunito', sans-serif", label: "Nunito" },
  { value: "'Quicksand', sans-serif", label: "Quicksand" },
  { value: "'Ubuntu', sans-serif", label: "Ubuntu" },
  { value: "'Merriweather', serif", label: "Merriweather" },
  { value: "'Fira Sans', sans-serif", label: "Fira Sans" },
  { value: "'PT Sans', sans-serif", label: "PT Sans" },
  { value: "'Oxygen', sans-serif", label: "Oxygen" },
  { value: "'IBM Plex Sans', sans-serif", label: "IBM Plex Sans" },
  { value: "'Rubik', sans-serif", label: "Rubik" }
];

interface FontSelectorProps {
  selectedFont: string;
  onFontChange: (font: string) => void;
  label?: string;
  description?: string;
}

export const FontSelector: React.FC<FontSelectorProps> = ({
  selectedFont,
  onFontChange,
  label = "Font Family",
  description
}) => {
  return (
    <div className="space-y-2">
      <Label htmlFor="font-selector">{label}</Label>
      {description && (
        <p className="text-sm text-muted-foreground mb-2">{description}</p>
      )}
      <Select value={selectedFont} onValueChange={onFontChange}>
        <SelectTrigger id="font-selector" className="w-full">
          <SelectValue placeholder="Select font" />
        </SelectTrigger>
        <SelectContent className="max-h-[400px]">
          {fontOptions.map((font) => (
            <SelectItem key={font.value} value={font.value}>
              <span style={{ fontFamily: font.value }}>{font.label}</span>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};
