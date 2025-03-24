
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchProjects, Project } from "@/services/api";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { format } from "date-fns";
import { motion } from "framer-motion";

export function ProjectsList() {
  const [searchTerm, setSearchTerm] = useState("");
  
  const { data: projects = [], isLoading, error } = useQuery({
    queryKey: ["projects"],
    queryFn: fetchProjects,
  });

  // Filter projects based on search term
  const filteredProjects = projects.filter(project => 
    project.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Get status color
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "active":
        return "bg-green-100 text-green-800";
      case "inactive":
        return "bg-yellow-100 text-yellow-800";
      case "completed":
        return "bg-blue-100 text-blue-800";
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
            <p className="text-destructive mb-2">Failed to load projects</p>
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
            <CardTitle className="text-2xl font-bold">Projects</CardTitle>
            <CardDescription>
              View and manage your Novacene projects
            </CardDescription>
          </div>
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search projects..."
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
            {Array.from({ length: 5 }).map((_, i) => (
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
        ) : filteredProjects.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-40 text-center">
            <p className="text-lg font-medium mb-2">No projects found</p>
            <p className="text-muted-foreground text-sm">
              {searchTerm ? "Try a different search term" : "Create a new project to get started"}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredProjects.map((project, index) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className="card-hover"
              >
                <a href={`/project/${project.id}`} className="block p-4 border rounded-md hover:bg-muted/50 transition-colors">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                    <div>
                      <h3 className="font-medium truncate">{project.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        Created: {formatDate(project.createdAt)}
                      </p>
                    </div>
                    <div className="ml-auto">
                      <Badge variant="outline" className={`${getStatusColor(project.status || "Unknown")}`}>
                        {project.status || "Unknown"}
                      </Badge>
                    </div>
                  </div>
                </a>
              </motion.div>
            ))}
          </div>
        )}
      </CardContent>
      <CardFooter className="border-t p-4 text-sm text-muted-foreground flex justify-between items-center">
        <div>Total projects: {projects.length}</div>
        <div>Showing {filteredProjects.length} of {projects.length}</div>
      </CardFooter>
    </Card>
  );
}
