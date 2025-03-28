
import React from "react";
import { Button } from "@/components/ui/button";

interface EditorActionsProps {
  resetToDefaults: () => void;
  applyChanges: () => void;
  isUpdating: boolean;
}

export const EditorActions = ({ resetToDefaults, applyChanges, isUpdating }: EditorActionsProps) => {
  return (
    <div className="flex justify-end space-x-2 pt-4">
      <Button 
        variant="outline" 
        onClick={resetToDefaults}
      >
        Reset to Defaults
      </Button>
      <Button 
        onClick={applyChanges} 
        disabled={isUpdating}
      >
        {isUpdating ? "Applying..." : "Apply Changes"}
      </Button>
    </div>
  );
};
