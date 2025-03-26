
import React from "react";
import { Label } from "@/components/ui/label";

interface BodyTextEditorProps {
  type: 'large' | 'normal' | 'small';
  size: string;
  weight: string;
  color: string;
  onSizeChange: (value: string) => void;
  onWeightChange: (value: string) => void;
  onColorChange: (value: string) => void;
}

export const BodyTextEditor: React.FC<BodyTextEditorProps> = ({
  type,
  size,
  weight,
  color,
  onSizeChange,
  onWeightChange,
  onColorChange
}) => {
  const getBodyText = () => {
    switch (type) {
      case 'large':
        return "This is body large text style";
      case 'normal':
        return "This is body normal text style";
      case 'small':
        return "This is body small text style";
      default:
        return "Body text";
    }
  };

  const getSizeOptions = () => {
    switch (type) {
      case 'large':
        return (
          <>
            <option value="text-sm">Small (text-sm)</option>
            <option value="text-base">Medium (text-base)</option>
            <option value="text-lg">Large (text-lg)</option>
          </>
        );
      case 'normal':
        return (
          <>
            <option value="text-xs">Small (text-xs)</option>
            <option value="text-sm">Medium (text-sm)</option>
            <option value="text-base">Large (text-base)</option>
          </>
        );
      case 'small':
        return (
          <>
            <option value="text-xs">Small (text-xs)</option>
            <option value="text-sm">Medium (text-sm)</option>
            <option value="text-base">Large (text-base)</option>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-2">
      <p className={`${size} ${weight} ${color}`}>{getBodyText()}</p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <Label htmlFor={`body-${type}-size`}>Size</Label>
          <select
            id={`body-${type}-size`}
            className="w-full mt-1.5 h-10 rounded-md border border-input bg-background px-3 py-2"
            value={size}
            onChange={(e) => onSizeChange(e.target.value)}
          >
            {getSizeOptions()}
          </select>
        </div>
        
        <div>
          <Label htmlFor={`body-${type}-weight`}>Weight</Label>
          <select
            id={`body-${type}-weight`}
            className="w-full mt-1.5 h-10 rounded-md border border-input bg-background px-3 py-2"
            value={weight}
            onChange={(e) => onWeightChange(e.target.value)}
          >
            <option value="font-light">Light (300)</option>
            <option value="font-normal">Normal (400)</option>
            <option value="font-medium">Medium (500)</option>
            <option value="font-semibold">Semibold (600)</option>
          </select>
        </div>
        
        <div>
          <Label htmlFor={`body-${type}-color`}>Color</Label>
          <select
            id={`body-${type}-color`}
            className="w-full mt-1.5 h-10 rounded-md border border-input bg-background px-3 py-2"
            value={color}
            onChange={(e) => onColorChange(e.target.value)}
          >
            <option value="text-foreground">Default</option>
            <option value="text-muted-foreground">Muted</option>
            <option value="text-primary">Primary</option>
            <option value="text-secondary">Secondary</option>
            <option value="text-accent">Accent</option>
          </select>
        </div>
      </div>
    </div>
  );
};
