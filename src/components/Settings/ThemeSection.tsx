
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useTheme } from "@/components/ThemeProvider";
import { Sun, Moon, Laptop, Clock } from "lucide-react";
import { Input } from "@/components/ui/input";

export const ThemeSection = () => {
  const { 
    theme, 
    activeTheme,
    colorScheme,
    timeBasedSwitch,
    startDarkTime,
    endDarkTime,
    setTheme,
    setColorScheme,
    updateThemeSettings
  } = useTheme();

  const handleThemeChange = (value: string) => {
    setTheme(value as "light" | "dark" | "system");
  };

  const handleColorSchemeChange = (value: string) => {
    setColorScheme(value as "green" | "blue" | "purple");
  };

  const handleTimeBasedSwitchChange = (checked: boolean) => {
    updateThemeSettings({ timeBasedSwitch: checked });
  };

  const handleStartTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateThemeSettings({ startDarkTime: e.target.value });
  };

  const handleEndTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateThemeSettings({ endDarkTime: e.target.value });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Theme Settings</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Theme Mode */}
        <div className="space-y-4">
          <h3 className="heading-3">Theme Mode</h3>
          <Separator />
          
          <RadioGroup
            value={theme}
            onValueChange={handleThemeChange}
            className="grid grid-cols-3 gap-4"
          >
            <div className="flex flex-col items-center space-y-2">
              <div className={`p-4 rounded-md border ${theme === 'light' ? 'border-primary bg-primary/10' : 'border-input'}`}>
                <RadioGroupItem value="light" id="light" className="sr-only" />
                <Label htmlFor="light" className="flex flex-col items-center space-y-2 cursor-pointer">
                  <Sun className="h-6 w-6" />
                  <span>Light</span>
                </Label>
              </div>
            </div>
            
            <div className="flex flex-col items-center space-y-2">
              <div className={`p-4 rounded-md border ${theme === 'dark' ? 'border-primary bg-primary/10' : 'border-input'}`}>
                <RadioGroupItem value="dark" id="dark" className="sr-only" />
                <Label htmlFor="dark" className="flex flex-col items-center space-y-2 cursor-pointer">
                  <Moon className="h-6 w-6" />
                  <span>Dark</span>
                </Label>
              </div>
            </div>
            
            <div className="flex flex-col items-center space-y-2">
              <div className={`p-4 rounded-md border ${theme === 'system' ? 'border-primary bg-primary/10' : 'border-input'}`}>
                <RadioGroupItem value="system" id="system" className="sr-only" />
                <Label htmlFor="system" className="flex flex-col items-center space-y-2 cursor-pointer">
                  <Laptop className="h-6 w-6" />
                  <span>System</span>
                </Label>
              </div>
            </div>
          </RadioGroup>
          
          <div className="pt-2 text-sm text-muted-foreground">
            {theme === 'system' ? 
              `Currently using ${activeTheme} mode based on your system preference.` : 
              `Manual selection: ${theme} mode.`
            }
          </div>
        </div>
        
        {/* Auto Switch (Time-based) */}
        <div className="space-y-4">
          <h3 className="heading-3">Time-Based Mode</h3>
          <Separator />
          
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="time-based-switch" className="text-base">Scheduled dark mode</Label>
              <p className="text-sm text-muted-foreground">
                Automatically switch between light and dark based on time
              </p>
            </div>
            <Switch 
              id="time-based-switch" 
              checked={timeBasedSwitch}
              onCheckedChange={handleTimeBasedSwitchChange}
            />
          </div>
          
          {timeBasedSwitch && (
            <div className="grid grid-cols-2 gap-4 pt-2">
              <div className="space-y-2">
                <Label htmlFor="start-time">Dark mode start time</Label>
                <div className="flex items-center space-x-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <Input 
                    id="start-time" 
                    type="time" 
                    value={startDarkTime} 
                    onChange={handleStartTimeChange} 
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="end-time">Dark mode end time</Label>
                <div className="flex items-center space-x-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <Input 
                    id="end-time" 
                    type="time" 
                    value={endDarkTime} 
                    onChange={handleEndTimeChange} 
                  />
                </div>
              </div>
            </div>
          )}
        </div>
        
        {/* Color Scheme */}
        <div className="space-y-4">
          <h3 className="heading-3">Color Scheme</h3>
          <Separator />
          
          <div className="space-y-2">
            <Label htmlFor="color-scheme">Primary color</Label>
            <Select value={colorScheme} onValueChange={handleColorSchemeChange}>
              <SelectTrigger id="color-scheme" className="w-full">
                <SelectValue placeholder="Select a color scheme" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="green">Green</SelectItem>
                <SelectItem value="blue">Blue</SelectItem>
                <SelectItem value="purple">Purple</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          {/* Preview */}
          <div className="pt-4">
            <h4 className="text-sm font-medium mb-2">Preview</h4>
            <div className="p-4 rounded-md border bg-card text-card-foreground">
              <div className="flex flex-col space-y-2">
                <div className="flex items-center space-x-2">
                  <div className="h-6 w-6 rounded-full bg-primary"></div>
                  <span>Primary Color</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="h-6 w-6 rounded-full bg-secondary"></div>
                  <span>Secondary Color</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="h-6 w-6 rounded-full bg-accent"></div>
                  <span>Accent Color</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
