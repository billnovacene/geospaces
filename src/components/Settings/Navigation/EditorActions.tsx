
import React from "react";
import { Button } from "@/components/ui/button";
import { RefreshCw, Save } from "lucide-react";

interface EditorActionsProps {
  resetToDefaults: () => void;
  applyChanges: () => void;
  isUpdating: boolean;
}

export function EditorActions({ 
  resetToDefaults, 
  applyChanges, 
  isUpdating 
}: EditorActionsProps) {
  return (
    <div className="flex justify-end gap-2">
      <Button 
        variant="outline" 
        onClick={resetToDefaults} 
        disabled={isUpdating}
      >
        <RefreshCw className="h-4 w-4 mr-2" />
        Reset to Defaults
      </Button>
      <Button 
        variant="default" 
        onClick={applyChanges} 
        disabled={isUpdating}
      >
        {isUpdating ? (
          <>
            <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
            Applying...
          </>
        ) : (
          <>
            <Save className="h-4 w-4 mr-2" />
            Apply Changes
          </>
        )}
      </Button>
    </div>
  );
}
