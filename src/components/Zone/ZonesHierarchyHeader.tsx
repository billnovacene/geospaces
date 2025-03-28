
import { CardTitle, CardDescription } from "@/components/ui/card";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

interface ZonesHierarchyHeaderProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  totalZones?: number;
  isLoading?: boolean;
}

export function ZonesHierarchyHeader({ 
  searchTerm, 
  setSearchTerm, 
  totalZones, 
  isLoading 
}: ZonesHierarchyHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
      <div>
        <CardTitle className="text-2xl font-bold dark:text-white">Zones Hierarchy</CardTitle>
        <CardDescription className="flex items-center gap-2 dark:text-gray-300">
          View the hierarchical structure of zones for this site
          {!isLoading && totalZones !== undefined && (
            <Badge variant="secondary" className="ml-1 dark:bg-gray-700 dark:text-gray-200">
              {totalZones} {totalZones === 1 ? 'zone' : 'zones'}
            </Badge>
          )}
        </CardDescription>
      </div>
      <div className="relative">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground dark:text-gray-400" />
        <Input
          type="search"
          placeholder="Search zones..."
          className="pl-8 max-w-xs dark:bg-gray-800 dark:text-white dark:border-gray-700 dark:placeholder:text-gray-500"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
    </div>
  );
}
