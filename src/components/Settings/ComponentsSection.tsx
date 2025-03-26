
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Alert,
  AlertTitle,
  AlertDescription 
} from "@/components/ui/alert";
import { Textarea } from "@/components/ui/textarea";
import { 
  Form,
  FormField,
  FormItem,
  FormLabel
} from "@/components/ui/form";
import { Label } from "@/components/ui/label";
import { InfoIcon, AlertCircle, Check } from "lucide-react";

export const ComponentsSection = () => {
  const [inputValue, setInputValue] = useState("");

  return (
    <Card>
      <CardHeader>
        <CardTitle>Components</CardTitle>
      </CardHeader>
      <CardContent className="space-y-8">
        {/* Buttons Section */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Buttons</h3>
          <Separator />
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Button variant="default">Default</Button>
              <p className="text-sm text-muted-foreground">
                variant="default"
              </p>
            </div>
            
            <div className="space-y-2">
              <Button variant="destructive">Destructive</Button>
              <p className="text-sm text-muted-foreground">
                variant="destructive"
              </p>
            </div>
            
            <div className="space-y-2">
              <Button variant="outline">Outline</Button>
              <p className="text-sm text-muted-foreground">
                variant="outline"
              </p>
            </div>
            
            <div className="space-y-2">
              <Button variant="secondary">Secondary</Button>
              <p className="text-sm text-muted-foreground">
                variant="secondary"
              </p>
            </div>
            
            <div className="space-y-2">
              <Button variant="ghost">Ghost</Button>
              <p className="text-sm text-muted-foreground">
                variant="ghost"
              </p>
            </div>
            
            <div className="space-y-2">
              <Button variant="link">Link</Button>
              <p className="text-sm text-muted-foreground">
                variant="link"
              </p>
            </div>
            
            <div className="space-y-2">
              <Button variant="success">Success</Button>
              <p className="text-sm text-muted-foreground">
                variant="success"
              </p>
            </div>
          </div>
          
          <div className="space-y-2 mt-4">
            <h4 className="text-md font-medium">Button Sizes</h4>
            <div className="flex flex-wrap gap-4">
              <Button size="default">Default</Button>
              <Button size="sm">Small</Button>
              <Button size="lg">Large</Button>
              <Button size="icon"><Check /></Button>
            </div>
          </div>
        </div>
        
        {/* Form Elements */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Form Elements</h3>
          <Separator />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="demo-input">Input</Label>
              <Input 
                id="demo-input" 
                placeholder="Enter text here..." 
                className="mt-1.5" 
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
              />
            </div>
            
            <div>
              <Label htmlFor="demo-textarea">Textarea</Label>
              <Textarea 
                id="demo-textarea" 
                placeholder="Enter longer text here..." 
                className="mt-1.5" 
              />
            </div>
          </div>
        </div>
        
        {/* Badges */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Badges</h3>
          <Separator />
          
          <div className="flex flex-wrap gap-3">
            <Badge variant="default">Default</Badge>
            <Badge variant="secondary">Secondary</Badge>
            <Badge variant="destructive">Destructive</Badge>
            <Badge variant="outline">Outline</Badge>
            <Badge variant="success">Success</Badge>
          </div>
        </div>
        
        {/* Alerts */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Alerts</h3>
          <Separator />
          
          <div className="space-y-4">
            <Alert>
              <InfoIcon className="h-4 w-4" />
              <AlertTitle>Default Alert</AlertTitle>
              <AlertDescription>
                This is a default alert with neutral styling.
              </AlertDescription>
            </Alert>
            
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Destructive Alert</AlertTitle>
              <AlertDescription>
                This alert is used for important warnings or errors.
              </AlertDescription>
            </Alert>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
