
import React from "react";
import { Button } from "@/components/ui/button";

interface ActionButtonsProps {
  isUpdating: boolean;
  onReset: () => void;
  onApply: () => void;
  onCancel?: () => void;
}

export const ActionButtons: React.FC<ActionButtonsProps> = ({
  isUpdating,
  onReset,
  onApply,
  onCancel,
}) => {
  return (
    <div className="flex justify-end space-x-2 pt-4">
      {onCancel && (
        <Button 
          variant="ghost" 
          onClick={onCancel}
        >
          Cancel
        </Button>
      )}
      <Button 
        variant="outline" 
        onClick={onReset}
      >
        Reset to Defaults
      </Button>
      <Button 
        onClick={onApply} 
        disabled={isUpdating}
      >
        {isUpdating ? "Applying..." : "Apply Changes"}
      </Button>
    </div>
  );
};
