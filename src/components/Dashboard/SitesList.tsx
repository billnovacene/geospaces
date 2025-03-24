
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchSites, Site } from "@/services/api";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Search, MapPin } from "lucide-react";
import { Input } from "@/components/ui/input";
import { format } from "date-fns";
import { motion } from "framer-motion";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface SitesListProps {
  projectId?: number;
}

export function SitesList({ projectId }: SitesListProps) {
  const [searchTerm, setSearchTerm] = useState("");
  
  const { data: sites = [], isLoading, error } = useQuery({
    queryKey: ["sites", projectId],
    queryFn: () => projectId ? fetchSites(projectId) : Promise.resolve([]),
    enabled: !!projectId,
  });

  // Filter sites based on search term
  const filteredSites = sites.filter(site => 
    site.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Get status color
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "active":
        return "bg-green-100 text-green-800";
      case "inactive":
        return "bg-yellow-100 text-yellow-800";
      case "offline":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Format date
  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "MMM d, yyyy");
    } catch (e) {
      return dateString;
    }
  };

  if (error) {
    return (
      <Card className="dashboard-card">
        <CardContent className="pt-6">
          <div className="flex flex-col items-center justify-center h-40 text-center">
            <p className="text-destructive mb-2">Failed to load sites</p>
            <p className="text-muted-foreground text-sm">Please try again later or check your connection</p>
          </div>
        </CardContent>
      </Card>
    );
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
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="flex items-center gap-4 p-4 border rounded-md">
                <div className="space-y-2">
                  <Skeleton className="h-5 w-40" />
                  <Skeleton className="h-4 w-24" />
                </div>
                <div className="ml-auto">
                  <Skeleton className="h-6 w-20" />
                </div>
              </div>
            ))}
          </div>
        ) : !projectId ? (
          <div className="flex flex-col items-center justify-center h-40 text-center">
            <p className="text-lg font-medium mb-2">No project selected</p>
            <p className="text-muted-foreground text-sm">
              Select a project to view its sites
            </p>
          </div>
        ) : filteredSites.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-40 text-center">
            <p className="text-lg font-medium mb-2">No sites found</p>
            <p className="text-muted-foreground text-sm">
              {searchTerm ? "Try a different search term" : "This project doesn't have any sites yet"}
            </p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Address</TableHead>
                <TableHead>Devices</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredSites.map((site, index) => (
                <TableRow key={site.id}>
                  <TableCell className="font-medium">{site.name}</TableCell>
                  <TableCell className="text-muted-foreground">
                    {site.address || "No address provided"}
                  </TableCell>
                  <TableCell>{site.devices || 0}</TableCell>
                  <TableCell>{formatDate(site.createdAt)}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className={`${getStatusColor(site.status || "Unknown")}`}>
                      {site.status || "Unknown"}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
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
