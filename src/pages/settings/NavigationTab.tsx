
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { NavigationEditor } from "@/components/Settings/Navigation";

export const NavigationTab = () => {
  const [isEditing, setIsEditing] = useState(false);

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button 
          variant="outline"
          onClick={() => setIsEditing(!isEditing)}
        >
          {isEditing ? "View Preview" : "Edit Settings"}
        </Button>
      </div>
      
      {isEditing ? (
        <NavigationEditor />
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Navigation Preview</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <h3 className="heading-3">Horizontal Navigation</h3>
              <Separator />
              
              <div className="p-4 border rounded-md">
                <div className="flex space-x-4 p-4 bg-background rounded-md">
                  <a href="#" className="px-3 py-2 rounded-md nav-item hover:bg-accent/10 hover:text-accent-foreground">
                    Home
                  </a>
                  <a href="#" className="px-3 py-2 rounded-md nav-item hover:bg-accent/10 hover:text-accent-foreground">
                    Dashboard
                  </a>
                  <a href="#" className="px-3 py-2 rounded-md bg-accent nav-item-active">
                    Settings
                  </a>
                  <a href="#" className="px-3 py-2 rounded-md nav-item hover:bg-accent/10 hover:text-accent-foreground">
                    Profile
                  </a>
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <h3 className="heading-3">Sidebar Navigation</h3>
              <Separator />
              
              <div className="p-4 border rounded-md">
                <div className="w-64 p-4 bg-background rounded-md border">
                  <div className="space-y-1">
                    <a href="#" className="block px-3 py-2 rounded-md nav-item hover:bg-accent/10 hover:text-accent-foreground">
                      Home
                    </a>
                    <a href="#" className="block px-3 py-2 rounded-md nav-item hover:bg-accent/10 hover:text-accent-foreground">
                      Dashboard
                    </a>
                    <a href="#" className="block px-3 py-2 rounded-md bg-accent nav-item-active">
                      Settings
                    </a>
                    <a href="#" className="block px-3 py-2 rounded-md nav-item hover:bg-accent/10 hover:text-accent-foreground">
                      Profile
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
