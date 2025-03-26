
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export const Typography = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Typography</CardTitle>
      </CardHeader>
      <CardContent className="space-y-8">
        {/* Headings Section */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Headings</h3>
          <Separator />
          
          <div className="space-y-4">
            <div className="p-4 border rounded-md">
              <h1 className="heading-1">Heading 1</h1>
              <p className="text-sm text-muted-foreground mt-1">
                Class: heading-1 • Font: Inter • Size: text-3xl • Weight: font-medium
              </p>
            </div>
            
            <div className="p-4 border rounded-md">
              <h2 className="heading-2">Heading 2</h2>
              <p className="text-sm text-muted-foreground mt-1">
                Class: heading-2 • Font: Inter • Size: text-2xl • Weight: font-medium
              </p>
            </div>
            
            <div className="p-4 border rounded-md">
              <h3 className="heading-3">Heading 3</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Class: heading-3 • Font: Inter • Size: text-xl • Weight: font-medium
              </p>
            </div>
            
            <div className="p-4 border rounded-md">
              <h4 className="heading-4">Heading 4</h4>
              <p className="text-sm text-muted-foreground mt-1">
                Class: heading-4 • Font: Inter • Size: text-lg • Weight: font-medium
              </p>
            </div>
          </div>
        </div>
        
        {/* Body Text Section */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Body Text</h3>
          <Separator />
          
          <div className="space-y-4">
            <div className="p-4 border rounded-md">
              <p className="body-large">This is body large text</p>
              <p className="text-sm text-muted-foreground mt-1">
                Class: body-large • Font: Inter • Size: text-base • Weight: regular
              </p>
            </div>
            
            <div className="p-4 border rounded-md">
              <p className="body-normal">This is body normal text</p>
              <p className="text-sm text-muted-foreground mt-1">
                Class: body-normal • Font: Inter • Size: text-sm • Weight: regular
              </p>
            </div>
            
            <div className="p-4 border rounded-md">
              <p className="body-small">This is body small text</p>
              <p className="text-sm text-muted-foreground mt-1">
                Class: body-small • Font: Inter • Size: text-xs • Weight: regular
              </p>
            </div>
            
            <div className="p-4 border rounded-md">
              <p className="caption">This is caption text</p>
              <p className="text-sm text-muted-foreground mt-1">
                Class: caption • Font: Inter • Size: text-xs • Weight: light
              </p>
            </div>
          </div>
        </div>
        
        {/* Font Weights Section */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Font Weights</h3>
          <Separator />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 border rounded-md">
              <p className="text-base font-light">Font Weight: Light (300)</p>
              <p className="text-sm text-muted-foreground mt-1">
                Class: font-light
              </p>
            </div>
            
            <div className="p-4 border rounded-md">
              <p className="text-base font-normal">Font Weight: Normal (400)</p>
              <p className="text-sm text-muted-foreground mt-1">
                Class: font-normal
              </p>
            </div>
            
            <div className="p-4 border rounded-md">
              <p className="text-base font-medium">Font Weight: Medium (500)</p>
              <p className="text-sm text-muted-foreground mt-1">
                Class: font-medium
              </p>
            </div>
            
            <div className="p-4 border rounded-md">
              <p className="text-base font-semibold">Font Weight: Semibold (600)</p>
              <p className="text-sm text-muted-foreground mt-1">
                Class: font-semibold
              </p>
            </div>
          </div>
        </div>
        
        {/* Default HTML Tags */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Default HTML Tags</h3>
          <Separator />
          
          <div className="p-4 border rounded-md space-y-4">
            <h1>This is an h1 tag</h1>
            <h2>This is an h2 tag</h2>
            <h3>This is an h3 tag</h3>
            <h4>This is an h4 tag</h4>
            <p>This is a paragraph tag</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
