
import React from "react";
import { Label } from "@/components/ui/label";

interface NavigationTextEditorProps {
  type: 'item' | 'active';
  size: string;
  weight: string;
  color: string;
  onSizeChange: (value: string) => void;
  onWeightChange: (value: string) => void;
  onColorChange: (value: string) => void;
}

export const NavigationTextEditor: React.FC<NavigationTextEditorProps> = ({
  type,
  size,
  weight,
  color,
  onSizeChange,
  onWeightChange,
  onColorChange
}) => {
  const getTypeLabel = () => {
    return type === 'item' ? 'Navigation Item' : 'Active Navigation Item';
  };

  return (
    <div className="space-y-2">
      <div className={`p-2 border rounded ${type === 'active' ? 'bg-accent/10' : ''}`}>
        <span className={`${size} ${weight} ${color}`}>{getTypeLabel()}</span>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <Label htmlFor={`nav-${type}-size`}>Size</Label>
          <select
            id={`nav-${type}-size`}
            className="w-full mt-1.5 h-10 rounded-md border border-input bg-background px-3 py-2"
            value={size}
            onChange={(e) => onSizeChange(e.target.value)}
          >
            <option value="text-xs">Small (text-xs)</option>
            <option value="text-sm">Medium (text-sm)</option>
            <option value="text-base">Large (text-base)</option>
          </select>
        </div>
        
        <div>
          <Label htmlFor={`nav-${type}-weight`}>Weight</Label>
          <select
            id={`nav-${type}-weight`}
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
          <Label htmlFor={`nav-${type}-color`}>Color</Label>
          <select
            id={`nav-${type}-color`}
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
