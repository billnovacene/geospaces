
import React from "react";
import { Button } from "@/components/ui/button";

interface ActionButtonsProps {
  isUpdating: boolean;
  onReset: () => void;
  onApply: () => void;
}

export const ActionButtons: React.FC<ActionButtonsProps> = ({
  isUpdating,
  onReset,
  onApply,
}) => {
  return (
    <div className="flex justify-end space-x-2 pt-4">
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
