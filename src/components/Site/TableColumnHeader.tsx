
import React from "react";
import { TableHead } from "@/components/ui/table";
import { ChevronUp, ChevronDown } from "lucide-react";

interface TableColumnHeaderProps {
  field: string;
  label: string;
  sortField: string | null;
  sortDirection: 'asc' | 'desc';
  onSort: (field: string) => void;
  className?: string;
}

export const TableColumnHeader = ({ 
  field, 
  label, 
  sortField, 
  sortDirection, 
  onSort,
  className 
}: TableColumnHeaderProps) => {
  // Get sort icon based on current sort state
  const getSortIcon = () => {
    if (sortField !== field) return null;
    return sortDirection === 'asc' ? 
      <ChevronUp className="h-4 w-4" /> : 
      <ChevronDown className="h-4 w-4" />;
  };

  return (
    <TableHead 
      className={`cursor-pointer hover:bg-muted/50 ${className || ''}`}
      onClick={() => onSort(field)}
    >
      <div className="flex items-center">
        {label}
        {getSortIcon()}
      </div>
    </TableHead>
  );
};
