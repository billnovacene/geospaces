
import React from "react";
import { Table, TableHeader, TableHead, TableBody, TableRow, TableCell } from "@/components/ui/table";
import { TableSettings } from "./types";

interface TablePreviewProps {
  settings: TableSettings;
}

export const TablePreview: React.FC<TablePreviewProps> = ({ settings }) => {
  return (
    <div className="p-4 border rounded-md overflow-auto">
      <h3 className="heading-3 mb-3">Table Preview</h3>
      <Table className={`${settings.borderColor}`}>
        <TableHeader className={`${settings.headerBackground}`}>
          <TableRow>
            <TableHead className={`${settings.headerTextColor} ${settings.headerFontSize} ${settings.headerFontWeight}`}>ID</TableHead>
            <TableHead className={`${settings.headerTextColor} ${settings.headerFontSize} ${settings.headerFontWeight}`}>Name</TableHead>
            <TableHead className={`${settings.headerTextColor} ${settings.headerFontSize} ${settings.headerFontWeight}`}>Status</TableHead>
            <TableHead className={`text-right ${settings.headerTextColor} ${settings.headerFontSize} ${settings.headerFontWeight}`}>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow className={`${settings.rowBackground} ${settings.hoverBackground}`}>
            <TableCell className={`${settings.rowTextColor} ${settings.rowFontSize} ${settings.rowFontWeight}`}>001</TableCell>
            <TableCell className={`${settings.rowTextColor} ${settings.rowFontSize} ${settings.rowFontWeight}`}>John Doe</TableCell>
            <TableCell className={`${settings.rowTextColor} ${settings.rowFontSize} ${settings.rowFontWeight}`}>Active</TableCell>
            <TableCell className={`text-right ${settings.rowTextColor} ${settings.rowFontSize} ${settings.rowFontWeight}`}>Edit</TableCell>
          </TableRow>
          <TableRow className={`${settings.rowBackground} ${settings.hoverBackground}`}>
            <TableCell className={`${settings.rowTextColor} ${settings.rowFontSize} ${settings.rowFontWeight}`}>002</TableCell>
            <TableCell className={`${settings.rowTextColor} ${settings.rowFontSize} ${settings.rowFontWeight}`}>Jane Smith</TableCell>
            <TableCell className={`${settings.rowTextColor} ${settings.rowFontSize} ${settings.rowFontWeight}`}>Inactive</TableCell>
            <TableCell className={`text-right ${settings.rowTextColor} ${settings.rowFontSize} ${settings.rowFontWeight}`}>Edit</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  );
};
