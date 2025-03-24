
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { fetchProject, Project } from "@/services/api";
import { SidebarWrapper } from "@/components/Dashboard/Sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Calendar } from "lucide-react";
import { format } from "date-fns";
import { SitesList } from "@/components/Dashboard/SitesList";

const ProjectDetail = () => {
  const { projectId } = useParams<{ projectId: string }>();
  
  const { data: project, isLoading, error } = useQuery({
    queryKey: ["project", projectId],
    queryFn: () => fetchProject(projectId || ""),
    enabled: !!projectId,
  });

  // Format date
  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "MMMM d, yyyy 'at' h:mm a");
    } catch (e) {
      return dateString;
    }
  };

  // Get status color
  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
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

  if (error) {
    return (
      <SidebarWrapper>
        <div className="container mx-auto py-6">
          <Button variant="outline" size="sm" asChild className="mb-6">
            <a href="/">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </a>
          </Button>
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col items-center justify-center h-40 text-center">
                <p className="text-destructive mb-2">Failed to load project</p>
                <p className="text-muted-foreground text-sm">Please try again later or check your connection</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </SidebarWrapper>
    );
  }

  return (
    <SidebarWrapper>
      <div className="container mx-auto py-6">
        <Button variant="outline" size="sm" asChild className="mb-6">
          <a href="/">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </a>
        </Button>
        
        {isLoading ? (
          <div className="space-y-4">
            <Skeleton className="h-12 w-80" />
            <Card>
              <CardHeader>
                <Skeleton className="h-7 w-40" />
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
              </CardContent>
            </Card>
          </div>
        ) : (
          <>
            <div className="flex justify-between items-start mb-6">
              <div>
                <h1 className="text-3xl font-bold">{project?.name}</h1>
                <div className="flex items-center mt-2 text-muted-foreground">
                  <Calendar className="mr-2 h-4 w-4" />
                  <span>Created on {formatDate(project?.createdAt || "")}</span>
                </div>
              </div>
              <Badge variant="outline" className={`${getStatusColor(project?.status || "")}`}>
                {project?.status || "Unknown"}
              </Badge>
            </div>
            
            <div className="grid gap-6 md:grid-cols-2 mb-8">
              <Card>
                <CardHeader>
                  <CardTitle>Project Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h3 className="font-medium text-sm text-muted-foreground mb-1">Project ID</h3>
                    <p>{project?.id}</p>
                  </div>
                  <div>
                    <h3 className="font-medium text-sm text-muted-foreground mb-1">Customer ID</h3>
                    <p>{project?.customerId}</p>
                  </div>
                  <div>
                    <h3 className="font-medium text-sm text-muted-foreground mb-1">Description</h3>
                    <p>{project?.description || "No description provided"}</p>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Additional Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {Object.entries(project || {})
                      .filter(([key]) => !["id", "name", "createdAt", "status", "customerId", "description"].includes(key))
                      .map(([key, value]) => (
                        <div key={key}>
                          <h3 className="font-medium text-sm text-muted-foreground mb-1">
                            {key.replace(/_/g, " ").replace(/\b\w/g, l => l.toUpperCase())}
                          </h3>
                          <p>{typeof value === "object" ? JSON.stringify(value) : String(value)}</p>
                        </div>
                      ))}
                  </div>
                </CardContent>
              </Card>
            </div>
            
            {/* Sites List */}
            <SitesList projectId={project?.id} />
          </>
        )}
      </div>
    </SidebarWrapper>
  );
};

export default ProjectDetail;
