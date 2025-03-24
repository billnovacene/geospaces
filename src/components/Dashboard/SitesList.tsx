
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchSites } from "@/services/api";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { SitesTable } from "./SitesTable";
import { SitesLoadingSkeleton } from "./SitesLoadingSkeleton";
import { SitesEmptyState } from "./SitesEmptyState";
import { SitesErrorState } from "./SitesErrorState";

interface SitesListProps {
  projectId?: number;
}

export function SitesList({ projectId }: SitesListProps) {
  const [searchTerm, setSearchTerm] = useState("");
  
  const { data: sites = [], isLoading, error, refetch } = useQuery({
    queryKey: ["sites", projectId],
    queryFn: () => projectId ? fetchSites(projectId) : Promise.resolve([]),
    enabled: !!projectId,
  });

  // Filter sites based on search term
  const filteredSites = sites.filter(site => 
    site.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    (site.type && site.type.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (site.locationText && site.locationText.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleRetry = () => {
    refetch();
  };

  if (error) {
    return <SitesErrorState onRetry={handleRetry} />;
  }

  return (
    <Card className="dashboard-card overflow-hidden">
      <CardHeader className="pb-4">
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
          <div>
            <CardTitle className="text-2xl font-bold">Sites</CardTitle>
            <CardDescription>
              View and manage sites for this project
            </CardDescription>
          </div>
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search sites..."
              className="pl-8 max-w-xs"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <SitesLoadingSkeleton />
        ) : !projectId ? (
          <SitesEmptyState noProject />
        ) : filteredSites.length === 0 ? (
          <SitesEmptyState searchTerm={searchTerm} />
        ) : (
          <SitesTable sites={filteredSites} />
        )}
      </CardContent>
      {projectId && sites.length > 0 && (
        <CardFooter className="border-t p-4 text-sm text-muted-foreground flex justify-between items-center">
          <div>Total sites: {sites.length}</div>
          <div>Showing {filteredSites.length} of {sites.length}</div>
        </CardFooter>
      )}
    </Card>
  );
}
