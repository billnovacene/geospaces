
import React from "react";
import { Label } from "@/components/ui/label";

interface HeadingEditorProps {
  level: 'h1' | 'h2' | 'h3' | 'h4';
  size: string;
  weight: string;
  tracking: string;
  onSizeChange: (value: string) => void;
  onWeightChange: (value: string) => void;
  onTrackingChange: (value: string) => void;
}

export const HeadingEditor: React.FC<HeadingEditorProps> = ({
  level,
  size,
  weight,
  tracking,
  onSizeChange,
  onWeightChange,
  onTrackingChange
}) => {
  const LevelTag = level as keyof JSX.IntrinsicElements;
  
  return (
    <div className="space-y-4">
      <div className="flex items-baseline justify-between">
        <LevelTag className={`${size} ${weight} ${tracking}`}>
          Heading {level.charAt(1)}
        </LevelTag>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <Label htmlFor={`${level}-size`}>Size</Label>
          <select
            id={`${level}-size`}
            className="w-full mt-1.5 h-10 rounded-md border border-input bg-background px-3 py-2"
            value={size}
            onChange={(e) => onSizeChange(e.target.value)}
          >
            {level === 'h1' && (
              <>
                <option value="text-3xl">Medium (text-3xl)</option>
                <option value="text-4xl">Large (text-4xl)</option>
                <option value="text-5xl">Extra Large (text-5xl)</option>
              </>
            )}
            {level === 'h2' && (
              <>
                <option value="text-xl">Small (text-xl)</option>
                <option value="text-2xl">Medium (text-2xl)</option>
                <option value="text-3xl">Large (text-3xl)</option>
              </>
            )}
            {level === 'h3' && (
              <>
                <option value="text-lg">Small (text-lg)</option>
                <option value="text-xl">Medium (text-xl)</option>
                <option value="text-2xl">Large (text-2xl)</option>
              </>
            )}
            {level === 'h4' && (
              <>
                <option value="text-base">Small (text-base)</option>
                <option value="text-lg">Medium (text-lg)</option>
                <option value="text-xl">Large (text-xl)</option>
              </>
            )}
          </select>
        </div>
        
        <div>
          <Label htmlFor={`${level}-weight`}>Weight</Label>
          <select
            id={`${level}-weight`}
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
          <Label htmlFor={`${level}-tracking`}>Letter Spacing</Label>
          <select
            id={`${level}-tracking`}
            className="w-full mt-1.5 h-10 rounded-md border border-input bg-background px-3 py-2"
            value={tracking}
            onChange={(e) => onTrackingChange(e.target.value)}
          >
            <option value="">Normal</option>
            <option value="tracking-tight">Tight</option>
            <option value="tracking-wide">Wide</option>
          </select>
        </div>
      </div>
    </div>
  );
};
