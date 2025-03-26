
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
import { NavigationEditor } from "@/components/Settings/NavigationEditor";
import { TableEditor } from "@/components/Settings/TableEditor";
import { Table, TableHeader, TableHead, TableBody, TableRow, TableCell } from "@/components/ui/table";

const Settings = () => {
  const [activeTab, setActiveTab] = useState("typography");
  const [isEditing, setIsEditing] = useState(false);
  const [navTableEditing, setNavTableEditing] = useState(false);

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
                <TabsTrigger value="navigation">Navigation</TabsTrigger>
                <TabsTrigger value="tables">Tables</TabsTrigger>
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
              
              {(activeTab === "navigation" || activeTab === "tables") && (
                <Button 
                  variant="outline"
                  onClick={() => setNavTableEditing(!navTableEditing)}
                >
                  {navTableEditing ? "View Preview" : "Edit Settings"}
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
            
            <TabsContent value="navigation" className="space-y-4">
              {navTableEditing ? (
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
            </TabsContent>
            
            <TabsContent value="tables" className="space-y-4">
              {navTableEditing ? (
                <TableEditor />
              ) : (
                <Card>
                  <CardHeader>
                    <CardTitle>Tables Preview</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-4">
                      <h3 className="heading-3">Standard Table</h3>
                      <Separator />
                      
                      <div className="p-4 border rounded-md overflow-auto">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead className="table-header">ID</TableHead>
                              <TableHead className="table-header">Name</TableHead>
                              <TableHead className="table-header">Status</TableHead>
                              <TableHead className="table-header text-right">Actions</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            <TableRow>
                              <TableCell className="table-cell">001</TableCell>
                              <TableCell className="table-cell">John Doe</TableCell>
                              <TableCell className="table-cell">Active</TableCell>
                              <TableCell className="table-cell text-right">Edit</TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell className="table-cell">002</TableCell>
                              <TableCell className="table-cell">Jane Smith</TableCell>
                              <TableCell className="table-cell">Inactive</TableCell>
                              <TableCell className="table-cell text-right">Edit</TableCell>
                            </TableRow>
                          </TableBody>
                        </Table>
                      </div>
                    </div>
                  </CardContent>
                </Card>
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
