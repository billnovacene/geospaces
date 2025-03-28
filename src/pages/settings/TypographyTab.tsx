
import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Typography } from "@/components/Settings/Typography";
import { TypographyEditor } from "@/components/Settings/Typography/TypographyEditor";

export const TypographyTab = () => {
  const [isEditing, setIsEditing] = useState(false);

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button 
          variant="outline"
          onClick={() => setIsEditing(!isEditing)}
        >
          {isEditing ? "View Typography" : "Edit Typography"}
        </Button>
      </div>
      
      {isEditing ? (
        <TypographyEditor />
      ) : (
        <Typography />
      )}
    </div>
  );
};
