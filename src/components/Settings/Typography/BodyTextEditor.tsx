
import React from "react";
import { Label } from "@/components/ui/label";

interface BodyTextEditorProps {
  type: 'large' | 'normal' | 'small';
  size: string;
  onSizeChange: (value: string) => void;
}

export const BodyTextEditor: React.FC<BodyTextEditorProps> = ({
  type,
  size,
  onSizeChange
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
      <p className={`${size}`}>{getBodyText()}</p>
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
      </div>
    </div>
  );
};
