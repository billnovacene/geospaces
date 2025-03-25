
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchSites } from "@/services/api";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { SitesTable } from "./SitesTable";
import { SitesLoadingSkeleton } from "./SitesLoadingSkeleton";
import { SitesEmptyState } from "./SitesEmptyState";
import { SitesErrorState } from "./SitesErrorState";

interface SitesListProps {
  projectId?: number;
}

export function SitesList({ projectId = 145 }: SitesListProps) {
  const { data: sites = [], isLoading, error, refetch } = useQuery({
    queryKey: ["sites", projectId],
    queryFn: () => projectId ? fetchSites(projectId) : Promise.resolve([]),
    enabled: !!projectId,
  });

  const handleRetry = () => {
    refetch();
  };

  if (error) {
    return <SitesErrorState onRetry={handleRetry} />;
  }

  return (
    <Card className="dashboard-card overflow-hidden">
      <CardHeader className="pb-4">
        <div>
          <CardTitle className="text-2xl font-bold">Sites</CardTitle>
          <CardDescription>
            View and manage sites for this project
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <SitesLoadingSkeleton />
        ) : !projectId ? (
          <SitesEmptyState noProject />
        ) : sites.length === 0 ? (
          <SitesEmptyState />
        ) : (
          <SitesTable sites={sites} />
        )}
      </CardContent>
      {projectId && sites.length > 0 && (
        <CardFooter className="border-t p-4 text-sm text-muted-foreground flex justify-between items-center">
          <div>Total sites: {sites.length}</div>
          <div>Showing {sites.length} of {sites.length}</div>
        </CardFooter>
      )}
    </Card>
  );
}
