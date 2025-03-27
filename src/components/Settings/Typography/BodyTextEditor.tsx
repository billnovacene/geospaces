
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
  const getTypeLabel = () => {
    switch (type) {
      case 'large': return 'Body Large';
      case 'normal': return 'Body Normal';
      case 'small': return 'Body Small';
      default: return 'Body Text';
    }
  };

  return (
    <div className="space-y-2">
      <p className={`${size} ${weight} ${color}`}>{getTypeLabel()} - The quick brown fox jumps over the lazy dog</p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <Label htmlFor={`body-${type}-size`}>Size</Label>
          <select
            id={`body-${type}-size`}
            className="w-full mt-1.5 h-10 rounded-md border border-input bg-background px-3 py-2"
            value={size}
            onChange={(e) => onSizeChange(e.target.value)}
          >
            <option value="text-xs">Small (text-xs)</option>
            <option value="text-sm">Medium (text-sm)</option>
            <option value="text-base">Large (text-base)</option>
            <option value="text-lg">Extra Large (text-lg)</option>
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
            <option value="font-normal">Regular (400)</option>
            <option value="font-medium">Medium (500)</option>
            <option value="font-semibold">Semibold (600)</option>
            <option value="font-bold">Bold (700)</option>
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
            <option value="text-gray-500">Gray Medium</option>
            <option value="text-gray-700">Gray Dark</option>
          </select>
        </div>
      </div>
    </div>
  );
};
