
import React, { useState } from "react";
import { SidebarWrapper } from "@/components/Dashboard/SidebarWrapper";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Form, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Label } from "@/components/ui/label";
import { Typography } from "@/components/Settings/Typography";
import { TypographyEditor } from "@/components/Settings/TypographyEditor";
import { ComponentsSection } from "@/components/Settings/ComponentsSection";
import { ColorSection } from "@/components/Settings/ColorSection";

const Settings = () => {
  const [activeTab, setActiveTab] = useState("typography");
  const [isEditing, setIsEditing] = useState(false);

  return (
    <SidebarWrapper>
      <div className="flex-1 overflow-auto bg-[#F9FAFB] min-h-screen">
        <div className="container mx-auto py-6 px-4 md:px-6">
          <div className="mb-6">
            <div className="flex flex-row items-center justify-between">
              <div className="flex flex-col">
                <h1 className="heading-1 mb-1">Settings</h1>
                <p className="body-normal">Customize your application settings</p>
              </div>
            </div>
          </div>

          <Tabs 
            value={activeTab} 
            onValueChange={setActiveTab}
            className="space-y-4"
          >
            <div className="flex justify-between items-center">
              <TabsList>
                <TabsTrigger value="typography">Typography</TabsTrigger>
                <TabsTrigger value="components">Components</TabsTrigger>
                <TabsTrigger value="colors">Colors</TabsTrigger>
              </TabsList>
              
              {activeTab === "typography" && (
                <Button 
                  variant="outline"
                  onClick={() => setIsEditing(!isEditing)}
                >
                  {isEditing ? "View Typography" : "Edit Typography"}
                </Button>
              )}
            </div>
            
            <TabsContent value="typography" className="space-y-4">
              {isEditing ? (
                <TypographyEditor />
              ) : (
                <Typography />
              )}
            </TabsContent>
            
            <TabsContent value="components">
              <ComponentsSection />
            </TabsContent>
            
            <TabsContent value="colors">
              <ColorSection />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </SidebarWrapper>
  );
};

export default Settings;
