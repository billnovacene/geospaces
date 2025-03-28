
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { TableEditor } from "@/components/Settings/Tables";
import { 
  Table, 
  TableHeader, 
  TableHead, 
  TableBody, 
  TableRow, 
  TableCell 
} from "@/components/ui/table";

export const TablesTab = () => {
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
    </div>
  );
};
