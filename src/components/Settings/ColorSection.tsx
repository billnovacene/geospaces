
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";

export const ColorSection = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Colors</CardTitle>
      </CardHeader>
      <CardContent className="space-y-8">
        {/* Primary Colors */}
        <div className="space-y-4">
          <h3 className="heading-3">Primary Colors</h3>
          <Separator />
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <div className="h-24 w-full bg-primary rounded-md flex items-end p-2">
                <Badge variant="secondary" className="bg-white/80">Primary</Badge>
              </div>
              <p className="body-small">
                Class: bg-primary
              </p>
            </div>
            
            <div className="space-y-2">
              <div className="h-24 w-full bg-primary-foreground rounded-md border flex items-end p-2">
                <Badge variant="secondary" className="bg-black/10">Primary Foreground</Badge>
              </div>
              <p className="body-small">
                Class: bg-primary-foreground
              </p>
            </div>
            
            <div className="space-y-2">
              <div className="h-24 w-full bg-secondary rounded-md flex items-end p-2">
                <Badge variant="secondary" className="bg-white/80">Secondary</Badge>
              </div>
              <p className="body-small">
                Class: bg-secondary
              </p>
            </div>
            
            <div className="space-y-2">
              <div className="h-24 w-full bg-secondary-foreground rounded-md flex items-end p-2">
                <Badge variant="secondary" className="bg-white/80">Secondary Foreground</Badge>
              </div>
              <p className="body-small">
                Class: bg-secondary-foreground
              </p>
            </div>
          </div>
        </div>
        
        {/* UI Colors */}
        <div className="space-y-4">
          <h3 className="heading-3">UI Colors</h3>
          <Separator />
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <div className="h-24 w-full bg-card rounded-md border flex items-end p-2">
                <Badge variant="secondary">Card</Badge>
              </div>
              <p className="body-small">
                Class: bg-card
              </p>
            </div>
            
            <div className="space-y-2">
              <div className="h-24 w-full bg-card-foreground rounded-md flex items-end p-2">
                <Badge variant="secondary" className="bg-white/80">Card Foreground</Badge>
              </div>
              <p className="body-small">
                Class: bg-card-foreground
              </p>
            </div>
            
            <div className="space-y-2">
              <div className="h-24 w-full bg-border rounded-md flex items-end p-2">
                <Badge variant="secondary">Border</Badge>
              </div>
              <p className="body-small">
                Class: bg-border
              </p>
            </div>
            
            <div className="space-y-2">
              <div className="h-24 w-full bg-input rounded-md flex items-end p-2">
                <Badge variant="secondary">Input</Badge>
              </div>
              <p className="body-small">
                Class: bg-input
              </p>
            </div>
          </div>
        </div>
        
        {/* Status Colors */}
        <div className="space-y-4">
          <h3 className="heading-3">Status Colors</h3>
          <Separator />
          
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <div className="h-24 w-full bg-destructive rounded-md flex items-end p-2">
                <Badge variant="secondary" className="bg-white/80">Destructive</Badge>
              </div>
              <p className="body-small">
                Class: bg-destructive
              </p>
            </div>
            
            <div className="space-y-2">
              <div className="h-24 w-full bg-muted rounded-md flex items-end p-2">
                <Badge variant="secondary">Muted</Badge>
              </div>
              <p className="body-small">
                Class: bg-muted
              </p>
            </div>
            
            <div className="space-y-2">
              <div className="h-24 w-full bg-accent rounded-md flex items-end p-2">
                <Badge variant="secondary">Accent</Badge>
              </div>
              <p className="body-small">
                Class: bg-accent
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
