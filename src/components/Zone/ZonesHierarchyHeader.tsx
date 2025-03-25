
import { CardTitle, CardDescription } from "@/components/ui/card";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Dispatch, SetStateAction } from "react";

interface ZonesHierarchyHeaderProps {
  searchTerm: string;
  setSearchTerm: Dispatch<SetStateAction<string>>;
}

export function ZonesHierarchyHeader({ searchTerm, setSearchTerm }: ZonesHierarchyHeaderProps) {
  return (
    <div className="flex flex-col gap-2">
      <div>
        <CardTitle className="text-2xl font-bold">Zones Hierarchy</CardTitle>
        <CardDescription>
          View the hierarchical structure of zones for this site
        </CardDescription>
      </div>
      <div className="relative">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search zones..."
          className="pl-8 w-full"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
    </div>
  );
}
